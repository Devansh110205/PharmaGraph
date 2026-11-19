"""
graph_rag.py — Neo4j 5.x GraphRAG orchestrator for PharmaGraph Diagnostics

Uses LangChain GraphCypherQAChain + NVIDIA NIMs (or Ollama fallback) to
generate Cypher queries and ground clinical responses in the knowledge graph.
"""

import os
from typing import Dict, Any, Optional, cast
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate

load_dotenv()

# ==============================================================================
# [USER CONFIG SECTION] — Automatically reads NVIDIA_API_KEY & NEO4J_URI from .env
# ==============================================================================
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "pharmagraph2026")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.3-70b-instruct")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

CYPHER_GENERATION_TEMPLATE = """Task: Generate a valid Neo4j 5.x Cypher query to answer a clinical pharmacogenomics question.
Instructions:
1. Use ONLY the node labels (:Gene, :Diplotype, :Phenotype, :Drug) and relationship types (:HAS_DIPLOTYPE, :MAPS_TO_PHENOTYPE, :CONTRAINDICATED_IN, :REDUCE_DOSE_IN, :SAFE_STANDARD_DOSING, :ALTERNATIVE_TO) in the schema.
2. When asked for suitable or safe medicines for a genotype, return drugs connected via [:SAFE_STANDARD_DOSING] or [:ALTERNATIVE_TO].
3. Always return the edgeId, CPIC guideline, and DPWG guideline properties.

Graph Schema:
{schema}

Clinician Question: {question}
Cypher Query:"""

QA_GROUNDING_TEMPLATE = """You are the PharmaGraph-CDS Clinical Pharmacogenomics Assistant powered by NVIDIA NIMs.
STRICT SAFETY GUARDRAIL:
- You may ONLY state facts explicitly present in the retrieved Neo4j Graph Context below.
- If the Graph Context is empty, you MUST reply: "OUT-OF-SCOPE CLAIM BLOCKED: 0 verified pharmacogenomic graph paths found."
- Cite the exact Edge ID (e.g., [EDGE-PGX-...]) and CPIC/DPWG level in every sentence.

Retrieved Neo4j 5.x Graph Context:
{context}

Clinician Question: {question}
Grounded Clinical Response:"""

# ==============================================================================
# Hardcoded schema description (used as fallback when Neo4j is unavailable)
# ==============================================================================
HARDCODED_SCHEMA_DESCRIPTION = """
PharmaGraph PGx Knowledge Graph Schema (9-Gene Panel)
======================================================

Node Labels:
  (:Gene)       — Properties: symbol, hgnc, source
  (:Diplotype)  — Properties: id, gene, allele
  (:Phenotype)  — Properties: id, gene, name, score
  (:Drug)       — Properties: name, rxnorm, drugClass

Relationship Types:
  (:Gene)-[:HAS_DIPLOTYPE]->(:Diplotype)
  (:Diplotype)-[:MAPS_TO_PHENOTYPE]->(:Phenotype)
  (:Phenotype)-[:CONTRAINDICATED_IN {edgeId, severity, cpic, dpwg, action}]->(:Drug)
  (:Phenotype)-[:REDUCE_DOSE_IN {edgeId, severity, cpic, dpwg, action}]->(:Drug)
  (:Phenotype)-[:SAFE_STANDARD_DOSING {edgeId, severity?, cpic?, dpwg?, action?}]->(:Drug)
  (:Drug)-[:ALTERNATIVE_TO]->(:Drug)

Covered Genes:
  CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, HLA-B, TPMT, UGT1A1
""".strip()


def get_graph_schema() -> Dict[str, Any]:
    """
    Retrieve the Neo4j graph schema by querying node labels, relationship types,
    and node/relationship counts.

    Falls back to a hardcoded schema description if Neo4j is unreachable.

    Returns:
        Dict containing 'status', 'schema' (structured data or description string),
        and optional 'node_labels', 'relationship_types', 'counts'.
    """
    try:
        from neo4j import GraphDatabase

        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD))
        driver.verify_connectivity()

        schema_info: Dict[str, Any] = {
            "status": "connected",
            "node_labels": [],
            "relationship_types": [],
            "counts": {},
        }

        with driver.session() as session:
            # Get node labels
            result = session.run("CALL db.labels() YIELD label RETURN label ORDER BY label")
            schema_info["node_labels"] = [record["label"] for record in result]

            # Get relationship types
            result = session.run(
                "CALL db.relationshipTypes() YIELD relationshipType "
                "RETURN relationshipType ORDER BY relationshipType"
            )
            schema_info["relationship_types"] = [record["relationshipType"] for record in result]

            # Get node counts per label
            for label in schema_info["node_labels"]:
                result = session.run(cast(Any, f"MATCH (n:`{label}`) RETURN count(n) AS cnt"))  # type: ignore
                record = result.single()
                schema_info["counts"][label] = record["cnt"] if record else 0

            # Get total relationship count
            result = session.run("MATCH ()-[r]->() RETURN count(r) AS cnt")
            record = result.single()
            schema_info["counts"]["_total_relationships"] = record["cnt"] if record else 0

        driver.close()
        schema_info["schema"] = HARDCODED_SCHEMA_DESCRIPTION
        return schema_info

    except Exception as exc:
        return {
            "status": "unavailable",
            "error": str(exc),
            "schema": HARDCODED_SCHEMA_DESCRIPTION,
            "node_labels": ["Gene", "Diplotype", "Phenotype", "Drug"],
            "relationship_types": [
                "HAS_DIPLOTYPE",
                "MAPS_TO_PHENOTYPE",
                "CONTRAINDICATED_IN",
                "REDUCE_DOSE_IN",
                "SAFE_STANDARD_DOSING",
                "ALTERNATIVE_TO",
            ],
            "counts": {},
        }


def get_llm(engine_name: str = "Llama 3.3 70B Instruct (NVIDIA NIM API)"):
    """
    Returns ChatNVIDIA (using NVIDIA_API_KEY from .env) or falls back to local ChatOllama
    for on-premises hospital privacy mode.
    """
    if "Ollama" not in engine_name and NVIDIA_API_KEY and NVIDIA_API_KEY != "nvapi-your_actual_nvidia_nim_key_here":
        from langchain_nvidia_ai_endpoints import ChatNVIDIA
        model_id = "nvidia/llama-3.1-nemotron-70b-instruct" if "Nemotron" in engine_name else (
            "meta/llama-3.1-8b-instruct" if "8B" in engine_name else (
                "mistralai/mixtral-8x22b-instruct-v0.1" if "Mixtral" in engine_name else NVIDIA_MODEL
            )
        )
        return ChatNVIDIA(
            model=model_id,
            nvidia_api_key=NVIDIA_API_KEY,
            temperature=0.0,
            max_tokens=350
        )

    from langchain_ollama import ChatOllama
    return ChatOllama(
        base_url=OLLAMA_BASE_URL,
        model=OLLAMA_MODEL,
        temperature=0.0
    )


def run_graphrag_query(question: str, engine_name: str = "Llama 3.3 70B Instruct (NVIDIA NIM API)") -> Dict[str, Any]:
    """
    Executes a Neo4j 5.x Cypher query via LangChain GraphCypherQAChain and phrases
    the retrieved path using NVIDIA NIMs.

    Args:
        question: The clinician's pharmacogenomics question.
        engine_name: The LLM engine to use for response generation.

    Returns:
        Dict with 'question', 'engine', 'answer', and 'intermediate_steps'.
    """
    from langchain_neo4j import Neo4jGraph, GraphCypherQAChain

    graph = Neo4jGraph(
        url=NEO4J_URI,
        username=NEO4J_USERNAME,
        password=NEO4J_PASSWORD
    )
    llm = get_llm(engine_name)

    chain = GraphCypherQAChain.from_llm(
        llm=llm,
        graph=graph,
        verbose=True,
        return_intermediate_steps=True,
        allow_dangerous_requests=True,
        cypher_prompt=PromptTemplate(
            input_variables=["schema", "question"],
            template=CYPHER_GENERATION_TEMPLATE
        ),
        qa_prompt=PromptTemplate(
            input_variables=["context", "question"],
            template=QA_GROUNDING_TEMPLATE
        )
    )
    result = chain.invoke({"query": question})
    return {
        "question": question,
        "engine": engine_name,
        "answer": result.get("result", ""),
        "intermediate_steps": result.get("intermediate_steps", [])
    }
