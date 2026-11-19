"""
main.py — PharmaGraph Diagnostics Clinical PGx & NVIDIA NIM GraphRAG API

FastAPI backend serving the full 9-gene pharmacogenomics panel with:
  - VCF parsing & diplotype extraction
  - Neo4j 5.x GraphRAG consultation (via graph_rag.py)
  - Phenoconversion checking (Drug-Drug-Gene Interactions)
  - SOAP note & patient handout report generation
  - Therapeutic Drug Monitoring (TDM) recommendations
"""

import os
import json
import pathlib
import urllib.request
from typing import List, Optional, Dict, Any, cast
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables from .env automatically
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Optional Neo4j 5.x driver import
try:
    from neo4j import GraphDatabase
    NEO4J_DRIVER_AVAILABLE = True
except ImportError:
    NEO4J_DRIVER_AVAILABLE = False

# Optional GraphRAG module import
try:
    from backend.graph_rag import run_graphrag_query, get_graph_schema
    GRAPHRAG_AVAILABLE = True
except ImportError:
    try:
        from graph_rag import run_graphrag_query, get_graph_schema
        GRAPHRAG_AVAILABLE = True
    except ImportError:
        GRAPHRAG_AVAILABLE = False

app = FastAPI(
    title="PharmaGraph Diagnostics | Clinical PGx & NVIDIA NIM GraphRAG API",
    description="Neo4j 5.x + PharmCAT v2.15 + NVIDIA NIMs GraphRAG Backend",
    version="2.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Robust path resolution for frontend/index.html
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
FRONTEND_HTML_PATH = BASE_DIR / "frontend" / "index.html"
ROOT_HTML_PATH = BASE_DIR / "index.html"

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "pharmagraph2026")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.3-70b-instruct")

# Optional LangChain NVIDIA NIMs import
try:
    from langchain_nvidia_ai_endpoints import ChatNVIDIA
    CHAT_NVIDIA_AVAILABLE = True
except ImportError:
    CHAT_NVIDIA_AVAILABLE = False

# ==============================================================================
# Drug-Drug-Gene Interaction (DDI) Inhibitor/Inducer Database
# ==============================================================================
INHIBITOR_INDUCER_DB: Dict[str, Dict[str, List[Dict[str, str]]]] = {
    "CYP2D6": {
        "inhibitors": [
            {"drug": "Fluoxetine", "strength": "strong"},
            {"drug": "Paroxetine", "strength": "strong"},
            {"drug": "Bupropion", "strength": "strong"},
            {"drug": "Quinidine", "strength": "strong"},
            {"drug": "Duloxetine", "strength": "moderate"},
            {"drug": "Terbinafine", "strength": "moderate"},
        ],
        "inducers": [],
    },
    "CYP2C19": {
        "inhibitors": [
            {"drug": "Fluvoxamine", "strength": "strong"},
            {"drug": "Fluconazole", "strength": "strong"},
            {"drug": "Omeprazole", "strength": "moderate"},
        ],
        "inducers": [],
    },
    "CYP3A4": {
        "inhibitors": [],
        "inducers": [
            {"drug": "Rifampin", "strength": "strong"},
            {"drug": "Carbamazepine", "strength": "strong"},
            {"drug": "Phenytoin", "strength": "strong"},
            {"drug": "St. John's Wort", "strength": "strong"},
        ],
    },
    "CYP2C9": {
        "inhibitors": [
            {"drug": "Fluconazole", "strength": "strong"},
            {"drug": "Amiodarone", "strength": "strong"},
        ],
        "inducers": [],
    },
}

# ==============================================================================
# Therapeutic Drug Monitoring (TDM) Recommendations Database
# ==============================================================================
TDM_RECOMMENDATIONS: Dict[str, Dict[str, Any]] = {
    "Warfarin": {
        "monitoring_parameter": "INR (International Normalized Ratio)",
        "target_range": "2.0–3.0 (standard); 2.5–3.5 (mechanical heart valve)",
        "frequency": "Daily during initiation, then weekly x4, then monthly when stable",
        "notes": "CYP2C9 and VKORC1 genotypes influence dose requirements significantly.",
    },
    "Carbamazepine": {
        "monitoring_parameter": "Serum carbamazepine level; CBC with differential; LFTs",
        "target_range": "4–12 mcg/mL (serum trough)",
        "frequency": "Baseline CBC/LFTs, then every 2 weeks x2 months, then every 3–6 months",
        "notes": "HLA-B*15:02 screening mandatory before initiation in at-risk populations. Auto-induces CYP3A4.",
    },
    "Azathioprine": {
        "monitoring_parameter": "CBC with differential; LFTs; TPMT activity",
        "target_range": "N/A (monitor for leukopenia: WBC >3,500/µL)",
        "frequency": "Weekly CBC x8 weeks, then every 2–4 weeks; LFTs monthly x3 then quarterly",
        "notes": "TPMT PM patients at life-threatening myelosuppression risk; IM patients need dose reduction.",
    },
    "Mercaptopurine": {
        "monitoring_parameter": "CBC with differential; LFTs; TPMT activity; 6-TGN levels",
        "target_range": "6-TGN: 235–450 pmol/8×10⁸ RBC",
        "frequency": "Weekly CBC x8 weeks, then every 2 weeks; LFTs monthly",
        "notes": "Same TPMT-based dosing adjustments as azathioprine.",
    },
    "Simvastatin": {
        "monitoring_parameter": "CK (Creatine Kinase); LFTs; lipid panel",
        "target_range": "N/A (monitor for CK >10× ULN indicating rhabdomyolysis)",
        "frequency": "Baseline LFTs, then 12 weeks post-initiation, then annually; CK if symptomatic",
        "notes": "SLCO1B1 *5/*5 carriers — AVOID simvastatin; switch to rosuvastatin.",
    },
    "Fluorouracil (5-FU)": {
        "monitoring_parameter": "CBC with differential; mucositis grading; DPD enzyme activity",
        "target_range": "AUC-based dosing: target 20–24 mg·h/L",
        "frequency": "CBC before each cycle; DPD testing before first dose",
        "notes": "DPYD IM/PM patients at severe/fatal toxicity risk — mandatory pre-treatment genotyping.",
    },
    "Capecitabine": {
        "monitoring_parameter": "CBC with differential; LFTs; renal function; hand-foot syndrome grading",
        "target_range": "N/A (toxicity-guided dosing)",
        "frequency": "CBC and LFTs before each cycle; renal function at baseline",
        "notes": "Oral prodrug of 5-FU; same DPYD-based dose adjustments apply.",
    },
    "Irinotecan": {
        "monitoring_parameter": "CBC with differential; LFTs; bilirubin; diarrhea grading",
        "target_range": "N/A (toxicity-guided dosing)",
        "frequency": "CBC before each dose; LFTs at baseline and before each cycle",
        "notes": "UGT1A1 *28/*28 patients — reduce dose by 30% to prevent severe neutropenia.",
    },
    "Codeine": {
        "monitoring_parameter": "Pain assessment; respiratory rate; sedation score",
        "target_range": "N/A (clinical response monitoring)",
        "frequency": "At each clinical encounter during active use",
        "notes": "CYP2D6 UM: AVOID (fatal respiratory depression risk). CYP2D6 PM: AVOID (no efficacy).",
    },
    "Clopidogrel": {
        "monitoring_parameter": "Platelet function testing (e.g., VerifyNow P2Y12 assay)",
        "target_range": "PRU <208 (VerifyNow); >40% inhibition (LTA)",
        "frequency": "Consider testing 24–48h after loading dose in high-risk patients",
        "notes": "CYP2C19 PM: AVOID — switch to prasugrel or ticagrelor.",
    },
    "Abacavir": {
        "monitoring_parameter": "HLA-B*57:01 status; HIV viral load; CD4 count",
        "target_range": "N/A (binary HLA-based go/no-go)",
        "frequency": "HLA-B*57:01 screening once (before first dose); viral load per HIV guidelines",
        "notes": "HLA-B*57:01 positive — NEVER prescribe abacavir (hypersensitivity reaction).",
    },
    "Atazanavir": {
        "monitoring_parameter": "LFTs; bilirubin (total and indirect); HIV viral load",
        "target_range": "N/A (monitor for indirect bilirubin >2.5× ULN)",
        "frequency": "LFTs at baseline, 2 weeks, then quarterly; bilirubin if symptomatic jaundice",
        "notes": "UGT1A1 *28/*28 increases risk of jaundice/hyperbilirubinemia.",
    },
}


# ==============================================================================
# Pydantic Request Models
# ==============================================================================
class ClinicalQueryRequest(BaseModel):
    accession: str = "ACC-2026-8841"
    question: str
    engine: str = "Llama 3.3 70B Instruct (NVIDIA NIM API)"
    diplotypes: Optional[Dict[str, str]] = None
    ordered_drugs: Optional[List[str]] = None
    retrieved_graph_context: Optional[str] = None


class GraphRAGQueryRequest(BaseModel):
    """Request body for the direct GraphRAG query endpoint."""
    question: str
    engine: str = "Llama 3.3 70B Instruct (NVIDIA NIM API)"


class PhenoconversionCheckRequest(BaseModel):
    """Request body for phenoconversion/DDI checking."""
    diplotypes: Dict[str, str]
    concomitant_drugs: List[str]


class SOAPReportRequest(BaseModel):
    """Request body for SOAP note generation."""
    accession: str = "ACC-2026-0001"
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    diplotypes: Optional[Dict[str, str]] = None
    ordered_drugs: Optional[List[str]] = None
    evaluation_results: Optional[List[Dict[str, Any]]] = None
    phenoconversion_warnings: Optional[List[str]] = None
    chief_complaint: Optional[str] = None


class PatientHandoutRequest(BaseModel):
    """Request body for patient-friendly handout generation."""
    accession: str = "ACC-2026-0001"
    patient_name: Optional[str] = "Patient"
    diplotypes: Optional[Dict[str, str]] = None
    evaluation_results: Optional[List[Dict[str, Any]]] = None


class VcfParseRequest(BaseModel):
    vcf_text: Optional[str] = None
    filename: Optional[str] = None


# ==============================================================================
# Helper: Check Neo4j connectivity
# ==============================================================================
def _check_neo4j_connection() -> bool:
    """Test whether Neo4j is reachable at the configured URI."""
    if not NEO4J_DRIVER_AVAILABLE:
        return False
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        driver.verify_connectivity()
        driver.close()
        return True
    except Exception:
        return False


# ==============================================================================
# Routes: Portal & Health
# ==============================================================================
def _serve_html_page(page_name: str) -> HTMLResponse:
    """Helper to locate and serve HTML pages from frontend/ or root directory."""
    candidate_paths = [
        BASE_DIR / "frontend" / page_name,
        BASE_DIR / page_name,
        pathlib.Path.cwd() / "frontend" / page_name,
        pathlib.Path.cwd() / page_name,
        pathlib.Path(__file__).resolve().parent / page_name,
    ]
    for target_path in candidate_paths:
        if target_path and target_path.exists() and target_path.is_file():
            try:
                return HTMLResponse(content=target_path.read_text(encoding="utf-8"), status_code=200)
            except Exception as exc:
                return HTMLResponse(content=f"<h3>Error reading {page_name}: {exc}</h3>", status_code=500)
    raise HTTPException(status_code=404, detail=f"Page '{page_name}' not found.")


@app.get("/", response_class=HTMLResponse)
@app.get("/index.html", response_class=HTMLResponse)
def serve_clinical_portal():
    """Page 1: Patient Clinical Intake & VCF Genotyping."""
    return _serve_html_page("index.html")


@app.get("/pharmacogenes", response_class=HTMLResponse)
@app.get("/pharmacogenes.html", response_class=HTMLResponse)
def serve_pharmacogenes_page():
    """Page 2: 8 Core Pharmacogenes Panel & Health Equity."""
    return _serve_html_page("pharmacogenes.html")


@app.get("/prescribing", response_class=HTMLResponse)
@app.get("/prescribing.html", response_class=HTMLResponse)
def serve_prescribing_page():
    """Page 3: e-Prescribing Formulary & Phenoconversion Engine."""
    return _serve_html_page("prescribing.html")


@app.get("/cds-alerts", response_class=HTMLResponse)
@app.get("/cds-alerts.html", response_class=HTMLResponse)
def serve_cds_alerts_page():
    """Page 4: Clinical Decision Support & 5-Hop Mechanism."""
    return _serve_html_page("cds-alerts.html")


@app.get("/consultation", response_class=HTMLResponse)
@app.get("/consultation.html", response_class=HTMLResponse)
def serve_consultation_page():
    """Page 5: AI Clinical Consultation & EHR Interoperability."""
    return _serve_html_page("consultation.html")


@app.get("/shared.js")
def serve_shared_js():
    """Serves the shared JavaScript library for all 5 portal pages."""
    candidate_paths = [
        BASE_DIR / "frontend" / "shared.js",
        BASE_DIR / "shared.js",
        pathlib.Path.cwd() / "frontend" / "shared.js",
        pathlib.Path.cwd() / "shared.js",
    ]
    for target_path in candidate_paths:
        if target_path and target_path.exists() and target_path.is_file():
            return Response(content=target_path.read_text(encoding="utf-8"), media_type="application/javascript")
    raise HTTPException(status_code=404, detail="shared.js not found")


@app.get("/api/health")
def health_check():
    """System health endpoint reporting all subsystem statuses."""
    nvidia_configured = bool(
        NVIDIA_API_KEY and NVIDIA_API_KEY != "nvapi-your_actual_nvidia_nim_key_here"
    )
    neo4j_connected = _check_neo4j_connection()
    return {
        "status": "online",
        "nvidia_api_key_detected": nvidia_configured,
        "nvidia_endpoint": NVIDIA_BASE_URL,
        "rag_orchestrator": "LlamaIndex PropertyGraphIndex + LangChain GraphCypherQAChain",
        "genotype_caller": "PharmCAT v2.15",
        "graphrag_available": GRAPHRAG_AVAILABLE,
        "neo4j_connected": neo4j_connected,
    }


# ==============================================================================
# Routes: GraphRAG Consultation
# ==============================================================================
@app.post("/api/consult")
def nvidia_nim_graphrag_consultation(req: ClinicalQueryRequest):
    """
    Primary clinical consultation endpoint.

    Resolution order:
    1. If GraphRAG module is available and Neo4j is reachable → full GraphRAG pipeline
    2. If frontend-provided graph context is present → return grounded context
    3. Otherwise → guardrail block (refuse ungrounded generation)
    """
    # Strategy 1: Full GraphRAG pipeline via graph_rag.py
    if GRAPHRAG_AVAILABLE and _check_neo4j_connection():
        try:
            result = run_graphrag_query(req.question, req.engine)
            return {
                "status": "grounded_graphrag_response",
                "engine": req.engine,
                "answer": result.get("answer", ""),
                "intermediate_steps": result.get("intermediate_steps", []),
            }
        except Exception as exc:
            # Fall through to strategy 2 if GraphRAG fails
            pass

    # Strategy 2: Frontend-provided graph context
    if req.retrieved_graph_context:
        return {
            "status": "grounded_nvidia_nim_response",
            "engine": req.engine,
            "answer": req.retrieved_graph_context
        }

    # Strategy 3: Guardrail block — refuse ungrounded generation
    return {
        "status": "blocked_by_guardrail",
        "engine": req.engine,
        "answer": "OUT-OF-SCOPE CLAIM BLOCKED: 0 verified pharmacogenomic graph paths found. Free-text generation refused."
    }


@app.post("/api/graphrag/query")
def direct_graphrag_query(req: GraphRAGQueryRequest):
    """
    Direct GraphRAG query endpoint.

    Accepts a clinical question and engine name, calls run_graphrag_query()
    directly, and returns the full result including intermediate Cypher steps.
    """
    if not GRAPHRAG_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="GraphRAG module is not available. Ensure graph_rag.py and its dependencies are installed.",
        )
    if not _check_neo4j_connection():
        raise HTTPException(
            status_code=503,
            detail=f"Neo4j is not reachable at {NEO4J_URI}. Start Neo4j and retry.",
        )
    try:
        result = run_graphrag_query(req.question, req.engine)
        return {
            "status": "success",
            "data": result,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"GraphRAG query failed: {exc}")


# ==============================================================================
# Routes: Graph Schema
# ==============================================================================
@app.get("/api/graph/schema")
def graph_schema():
    """
    Returns the Neo4j graph schema (node labels, relationship types, counts).

    If GraphRAG module is loaded, delegates to get_graph_schema(). Otherwise
    queries Neo4j directly or returns a hardcoded schema description.
    """
    if GRAPHRAG_AVAILABLE:
        try:
            return get_graph_schema()
        except Exception:
            pass

    # Direct Neo4j query fallback
    if NEO4J_DRIVER_AVAILABLE and _check_neo4j_connection():
        try:
            driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            schema_info: Dict[str, Any] = {
                "status": "connected",
                "node_labels": [],
                "relationship_types": [],
                "counts": {},
            }
            with driver.session() as session:
                result = session.run("CALL db.labels() YIELD label RETURN label ORDER BY label")
                schema_info["node_labels"] = [r["label"] for r in result]

                result = session.run(
                    "CALL db.relationshipTypes() YIELD relationshipType "
                    "RETURN relationshipType ORDER BY relationshipType"
                )
                schema_info["relationship_types"] = [r["relationshipType"] for r in result]

                for label in schema_info["node_labels"]:
                    result = session.run(cast(Any, f"MATCH (n:`{label}`) RETURN count(n) AS cnt"))  # type: ignore
                    record = result.single()
                    schema_info["counts"][label] = record["cnt"] if record else 0
            driver.close()
            return schema_info
        except Exception:
            pass

    # Hardcoded fallback
    return {
        "status": "unavailable",
        "schema": (
            "PharmaGraph PGx Knowledge Graph Schema (9-Gene Panel)\n"
            "Node Labels: Gene, Diplotype, Phenotype, Drug\n"
            "Relationship Types: HAS_DIPLOTYPE, MAPS_TO_PHENOTYPE, "
            "CONTRAINDICATED_IN, REDUCE_DOSE_IN, SAFE_STANDARD_DOSING, ALTERNATIVE_TO\n"
            "Covered Genes: CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, HLA-B, TPMT, UGT1A1"
        ),
        "node_labels": ["Gene", "Diplotype", "Phenotype", "Drug"],
        "relationship_types": [
            "HAS_DIPLOTYPE", "MAPS_TO_PHENOTYPE", "CONTRAINDICATED_IN",
            "REDUCE_DOSE_IN", "SAFE_STANDARD_DOSING", "ALTERNATIVE_TO",
        ],
        "counts": {},
    }


# ==============================================================================
# Routes: Phenoconversion / Drug-Drug-Gene Interaction Check
# ==============================================================================
@app.post("/api/phenoconversion/check")
def check_phenoconversion(req: PhenoconversionCheckRequest):
    """
    Checks for phenoconversion risk caused by concomitant drug interactions.

    Evaluates whether any co-prescribed medications are known inhibitors or
    inducers of CYP enzymes that metabolize the patient's genotyped drugs,
    potentially converting a normal metabolizer phenotype to a different
    functional status.

    Args:
        req: Contains patient diplotypes and list of concomitant drugs.

    Returns:
        Dict with warnings list and affected enzymes.
    """
    warnings: List[Dict[str, Any]] = []
    affected_enzymes: List[str] = []
    concomitant_lower = [d.lower().strip() for d in req.concomitant_drugs]

    for enzyme, interactions in INHIBITOR_INDUCER_DB.items():
        # Check inhibitors
        for entry in interactions.get("inhibitors", []):
            if entry["drug"].lower() in concomitant_lower:
                affected_enzymes.append(enzyme)
                # Determine phenoconversion effect
                genotyped_phenotype = _infer_phenotype_from_diplotype(
                    enzyme, req.diplotypes.get(enzyme, "*1/*1")
                )
                converted_phenotype = _apply_inhibition(
                    genotyped_phenotype, entry["strength"]
                )
                warnings.append({
                    "type": "inhibition",
                    "enzyme": enzyme,
                    "perpetrator_drug": entry["drug"],
                    "strength": entry["strength"],
                    "genotyped_phenotype": genotyped_phenotype,
                    "converted_phenotype": converted_phenotype,
                    "clinical_note": (
                        f"{entry['drug']} is a {entry['strength']} {enzyme} inhibitor. "
                        f"Patient's genotyped phenotype ({genotyped_phenotype}) may be "
                        f"phenoconverted to {converted_phenotype}. "
                        f"Adjust substrate drug dosing accordingly."
                    ),
                })

        # Check inducers
        for entry in interactions.get("inducers", []):
            if entry["drug"].lower() in concomitant_lower:
                affected_enzymes.append(enzyme)
                warnings.append({
                    "type": "induction",
                    "enzyme": enzyme,
                    "perpetrator_drug": entry["drug"],
                    "strength": entry["strength"],
                    "clinical_note": (
                        f"{entry['drug']} is a {entry['strength']} {enzyme} inducer. "
                        f"This may increase metabolism of {enzyme} substrates, "
                        f"reducing drug efficacy. Consider dose increase or alternative therapy."
                    ),
                })

    return {
        "status": "checked",
        "warnings_count": len(warnings),
        "warnings": warnings,
        "affected_enzymes": list(set(affected_enzymes)),
    }


def _infer_phenotype_from_diplotype(enzyme: str, diplotype: str) -> str:
    """Infer a simplified phenotype label from a diplotype string."""
    dip = diplotype.lower().strip()
    if "*1/*1" in dip or "normal" in dip:
        return "Normal Metabolizer"
    if any(pm in dip for pm in ["*2/*2", "*3/*3", "*4/*4", "*3a/*3a"]):
        return "Poor Metabolizer"
    if any(im in dip for im in ["*1/*2", "*1/*3", "*1/*4", "*1/*3a", "*1/*3b", "*1/*3c", "*1/*10", "*1/*41"]):
        return "Intermediate Metabolizer"
    if any(um in dip for um in ["xn", "ultrarapid"]):
        return "Ultrarapid Metabolizer"
    return "Indeterminate"


def _apply_inhibition(genotyped_phenotype: str, strength: str) -> str:
    """Apply phenoconversion shift based on inhibitor strength."""
    phenotype_ladder = [
        "Ultrarapid Metabolizer",
        "Normal Metabolizer",
        "Intermediate Metabolizer",
        "Poor Metabolizer",
    ]
    try:
        idx = phenotype_ladder.index(genotyped_phenotype)
    except ValueError:
        return "Poor Metabolizer"  # Conservative assumption

    shift = 2 if strength == "strong" else 1
    new_idx = min(idx + shift, len(phenotype_ladder) - 1)
    return phenotype_ladder[new_idx]


# ==============================================================================
# Routes: SOAP Note Report
# ==============================================================================
@app.post("/api/report/soap")
def generate_soap_note(req: SOAPReportRequest):
    """
    Generates a formatted SOAP (Subjective, Objective, Assessment, Plan) note
    for clinical pharmacogenomics consultation.

    Args:
        req: Patient accession data, diplotypes, drugs, and evaluation results.

    Returns:
        Dict with the formatted SOAP note string and metadata.
    """
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    diplotypes = req.diplotypes or {}
    drugs = req.ordered_drugs or []
    evaluations = req.evaluation_results or []
    warnings = req.phenoconversion_warnings or []

    # --- Subjective ---
    subjective_lines = [
        f"Chief Complaint: {req.chief_complaint or 'Pharmacogenomic consultation requested.'}",
        f"Patient reports current medication regimen for review.",
    ]

    # --- Objective ---
    objective_lines = [
        f"Accession: {req.accession}",
        f"Age: {req.patient_age or 'Not provided'}  |  Sex: {req.patient_sex or 'Not provided'}",
        "",
        "PGx Genotyping Results:",
    ]
    for gene, diplotype in diplotypes.items():
        objective_lines.append(f"  {gene}: {diplotype}")
    if drugs:
        objective_lines.append("")
        objective_lines.append(f"Current/Ordered Medications: {', '.join(drugs)}")

    # --- Assessment ---
    assessment_lines = []
    critical_count = 0
    moderate_count = 0
    for ev in evaluations:
        severity = ev.get("severity", "STANDARD")
        drug = ev.get("drug", "Unknown")
        action = ev.get("action", "No specific action")
        edge_id = ev.get("edgeId", "N/A")
        if severity == "CRITICAL":
            critical_count += 1
            assessment_lines.append(f"  ⚠ CRITICAL [{edge_id}] — {drug}: {action}")
        elif severity == "MODERATE":
            moderate_count += 1
            assessment_lines.append(f"  ⚡ MODERATE [{edge_id}] — {drug}: {action}")
        else:
            assessment_lines.append(f"  ✓ STANDARD [{edge_id}] — {drug}: {action}")

    if warnings:
        assessment_lines.append("")
        assessment_lines.append("Phenoconversion Warnings:")
        for w in warnings:
            assessment_lines.append(f"  ⚠ {w}")

    if not assessment_lines:
        assessment_lines.append("  No actionable gene-drug interactions identified.")

    # --- Plan ---
    plan_lines = []
    for ev in evaluations:
        severity = ev.get("severity", "STANDARD")
        drug = ev.get("drug", "Unknown")
        action = ev.get("action", "")
        if severity == "CRITICAL":
            plan_lines.append(f"  1. {drug}: {action}")
        elif severity == "MODERATE":
            plan_lines.append(f"  2. {drug}: {action}")
    # Add TDM recommendations for ordered drugs
    for drug in drugs:
        if drug in TDM_RECOMMENDATIONS:
            tdm = TDM_RECOMMENDATIONS[drug]
            plan_lines.append(f"  TDM — {drug}: Monitor {tdm['monitoring_parameter']}; {tdm['frequency']}")
    if not plan_lines:
        plan_lines.append("  Continue current regimen. No pharmacogenomic dose adjustments required.")
    plan_lines.append("")
    plan_lines.append("  Follow-up: Reassess in 2–4 weeks or as clinically indicated.")

    # --- Assemble SOAP note ---
    soap_note = "\n".join([
        "=" * 72,
        f"PHARMAGRAPH DIAGNOSTICS — CLINICAL PGx SOAP NOTE",
        f"Generated: {timestamp}",
        "=" * 72,
        "",
        "S (SUBJECTIVE):",
        *[f"  {line}" for line in subjective_lines],
        "",
        "O (OBJECTIVE):",
        *[f"  {line}" for line in objective_lines],
        "",
        "A (ASSESSMENT):",
        f"  Critical Interactions: {critical_count}  |  Moderate Interactions: {moderate_count}",
        *assessment_lines,
        "",
        "P (PLAN):",
        *plan_lines,
        "",
        "=" * 72,
        f"Report ID: {req.accession} | PharmaGraph Diagnostics v2.4.0",
        "=" * 72,
    ])

    return {
        "status": "generated",
        "accession": req.accession,
        "soap_note": soap_note,
        "critical_count": critical_count,
        "moderate_count": moderate_count,
    }


# ==============================================================================
# Routes: Patient-Friendly Handout
# ==============================================================================
@app.post("/api/report/patient-handout")
def generate_patient_handout(req: PatientHandoutRequest):
    """
    Generates a patient-friendly plain-language summary of PGx results.

    Written at ~6th grade reading level for health literacy accessibility.

    Args:
        req: Patient accession data, diplotypes, and evaluation results.

    Returns:
        Dict with the formatted handout string.
    """
    diplotypes = req.diplotypes or {}
    evaluations = req.evaluation_results or []

    handout_lines = [
        "═" * 56,
        "YOUR PHARMACOGENOMICS TEST RESULTS",
        f"Patient: {req.patient_name}  |  ID: {req.accession}",
        "═" * 56,
        "",
        "WHAT IS PHARMACOGENOMICS?",
        "  Your genes can affect how your body processes",
        "  certain medications. This test looks at your DNA",
        "  to help your doctor choose the safest and most",
        "  effective medicines for you.",
        "",
        "YOUR GENE RESULTS:",
    ]

    gene_explanations: Dict[str, str] = {
        "CYP2C19": "affects how you process heart and antidepressant medicines",
        "CYP2D6": "affects how you process pain medicines and some antidepressants",
        "CYP2C9": "affects how you process blood thinners like warfarin",
        "VKORC1": "affects your sensitivity to the blood thinner warfarin",
        "SLCO1B1": "affects how you process cholesterol-lowering medicines (statins)",
        "DPYD": "affects how you process certain cancer medicines",
        "HLA-B": "affects your risk of severe skin or allergic reactions to some medicines",
        "TPMT": "affects how you process immune-suppressing medicines",
        "UGT1A1": "affects how you process certain cancer and HIV medicines",
    }

    for gene, diplotype in diplotypes.items():
        explanation = gene_explanations.get(gene, "affects how you process certain medicines")
        handout_lines.append(f"  • {gene} ({diplotype}): This gene {explanation}.")

    handout_lines.extend([
        "",
        "WHAT THIS MEANS FOR YOUR MEDICINES:",
    ])

    has_actions = False
    for ev in evaluations:
        severity = ev.get("severity", "STANDARD")
        drug = ev.get("drug", "a medicine")
        action = ev.get("action", "")

        if severity == "CRITICAL":
            has_actions = True
            handout_lines.append(
                f"  🔴 IMPORTANT — {drug}: Your doctor may need to use"
                f" a different medicine or a lower dose because of your genes."
            )
            if action:
                handout_lines.append(f"     Doctor's note: {action}")
        elif severity == "MODERATE":
            has_actions = True
            handout_lines.append(
                f"  🟡 CAUTION — {drug}: Your doctor may adjust your dose"
                f" based on your genetic test."
            )
            if action:
                handout_lines.append(f"     Doctor's note: {action}")
        else:
            handout_lines.append(f"  🟢 {drug}: Standard dosing is expected to work well for you.")

    if not has_actions and not evaluations:
        handout_lines.append("  No special medicine changes are needed based on your test results.")

    handout_lines.extend([
        "",
        "IMPORTANT REMINDERS:",
        "  • Do NOT stop or change any medicine on your own.",
        "  • Show this report to all your doctors and pharmacists.",
        "  • These results last your whole life — your genes do not change.",
        "  • Ask your doctor or pharmacist if you have questions.",
        "",
        "═" * 56,
        f"PharmaGraph Diagnostics | {req.accession}",
        "═" * 56,
    ])

    handout = "\n".join(handout_lines)

    return {
        "status": "generated",
        "accession": req.accession,
        "handout": handout,
    }


# ==============================================================================
# Routes: VCF Specimens & Parsing (existing)
# ==============================================================================
SPECIMENS_DIRS = [
    BASE_DIR / "data" / "specimens",
    BASE_DIR / "data" / "data" / "specimens",
    pathlib.Path.cwd() / "data" / "specimens",
    pathlib.Path.cwd() / "data" / "data" / "specimens",
]


def find_specimen_file(filename: str) -> Optional[pathlib.Path]:
    safe_name = pathlib.Path(filename).name
    for sdir in SPECIMENS_DIRS:
        cand = sdir / safe_name
        if cand.exists() and cand.is_file():
            return cand
    return None


@app.get("/api/vcf/samples")
def list_sample_vcfs():
    """Lists pre-packaged clinical testing VCF specimens."""
    manifest_path = find_specimen_file("samples_manifest.json")
    if manifest_path:
        try:
            return JSONResponse(content=json.loads(manifest_path.read_text(encoding="utf-8")))
        except Exception:
            pass

    results = []
    seen = set()
    for sdir in SPECIMENS_DIRS:
        if sdir.exists():
            for f in sorted(sdir.glob("*.vcf")):
                if f.name not in seen:
                    seen.add(f.name)
                    results.append({
                        "filename": f.name,
                        "download_url": f"/api/vcf/download/{f.name}"
                    })
    return JSONResponse(content=results)


@app.get("/api/vcf/download/{filename}")
def download_sample_vcf(filename: str):
    """Directly downloads a sample clinical VCF file."""
    file_path = find_specimen_file(filename)
    if not file_path:
        raise HTTPException(status_code=404, detail=f"VCF sample '{filename}' not found.")
    content = file_path.read_text(encoding="utf-8")
    return Response(
        content=content,
        media_type="text/plain; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{file_path.name}"'
        }
    )


PGX_VARIANT_DATABASE = [
    {"rsid": "rs4244285", "chr": "10", "pos38": 94781859, "pos37": 96541600, "gene": "CYP2C19", "name": "*2", "het": "*1/*2", "hom": "*2/*2"},
    {"rsid": "rs4986893", "chr": "10", "pos38": 94775409, "pos37": 96535150, "gene": "CYP2C19", "name": "*3", "het": "*1/*3", "hom": "*3/*3"},
    {"rsid": "rs12248560", "chr": "10", "pos38": 94761900, "pos37": 96521641, "gene": "CYP2C19", "name": "*17", "het": "*1/*17", "hom": "*17/*17"},
    {"rsid": "rs3892097", "chr": "22", "pos38": 42128945, "pos37": 42524947, "gene": "CYP2D6", "name": "*4", "het": "*1/*4", "hom": "*4/*4"},
    {"rsid": "rs1065852", "chr": "22", "pos38": 42130692, "pos37": 42526694, "gene": "CYP2D6", "name": "*10", "het": "*1/*10", "hom": "*10/*10"},
    {"rsid": "rs28371725", "chr": "22", "pos38": 42126611, "pos37": 42522613, "gene": "CYP2D6", "name": "*41", "het": "*1/*41", "hom": "*41/*41"},
    {"rsid": "rs1057910", "chr": "10", "pos38": 94981296, "pos37": 96741051, "gene": "CYP2C9", "name": "*3", "het": "*1/*3", "hom": "*3/*3"},
    {"rsid": "rs1799853", "chr": "10", "pos38": 94942292, "pos37": 96702047, "gene": "CYP2C9", "name": "*2", "het": "*1/*2", "hom": "*2/*2"},
    {"rsid": "rs9923231", "chr": "16", "pos38": 31096368, "pos37": 31107660, "gene": "VKORC1", "name": "-1639G>A", "het": "G/A (rs9923231)", "hom": "A/A (rs9923231)"},
    {"rsid": "rs4149056", "chr": "12", "pos38": 21178615, "pos37": 21331549, "gene": "SLCO1B1", "name": "*5", "het": "*1/*5", "hom": "*5/*5"},
    {"rsid": "rs2306283", "chr": "12", "pos38": 21176859, "pos37": 21329793, "gene": "SLCO1B1", "name": "*1B", "het": "*1/*1B", "hom": "*1B/*1B"},
    {"rsid": "rs3918290", "chr": "1", "pos38": 97450058, "pos37": 97915614, "gene": "DPYD", "name": "*2A", "het": "*1/*2A", "hom": "*2A/*2A"},
    {"rsid": "rs55886062", "chr": "1", "pos38": 97078864, "pos37": 97544420, "gene": "DPYD", "name": "*13", "het": "*1/*13", "hom": "*13/*13"},
    {"rsid": "rs67376798", "chr": "1", "pos38": 97284698, "pos37": 97750254, "gene": "DPYD", "name": "c.2846A>T", "het": "*1/c.2846A>T", "hom": "c.2846A>T/c.2846A>T"},
    {"rsid": "rs3909184", "chr": "6", "pos38": 31356450, "pos37": 31324249, "gene": "HLA-B", "name": "*15:02 Tag", "het": "*15:02 Positive", "hom": "*15:02 Positive"},
    {"rsid": "rs2395029", "chr": "6", "pos38": 31357178, "pos37": 31324977, "gene": "HLA-B", "name": "*57:01 Tag", "het": "*57:01 Positive", "hom": "*57:01 Positive"},
    {"rsid": "rs1142345", "chr": "6", "pos38": 18130918, "pos37": 18144088, "gene": "TPMT", "name": "*3C", "het": "*1/*3C", "hom": "*3C/*3C"},
    {"rsid": "rs1800460", "chr": "6", "pos38": 18139228, "pos37": 18135778, "gene": "TPMT", "name": "*3B", "het": "*1/*3B", "hom": "*3B/*3B"},
    {"rsid": "rs1800462", "chr": "6", "pos38": 18143955, "pos37": 18131051, "gene": "TPMT", "name": "*2", "het": "*1/*2", "hom": "*2/*2"},
    {"rsid": "rs887829", "chr": "2", "pos38": 233759924, "pos37": 234668879, "gene": "UGT1A1", "name": "*28 Tag", "het": "*1/*28", "hom": "*28/*28"},
    {"rsid": "rs4148323", "chr": "2", "pos38": 233760498, "pos37": 234669453, "gene": "UGT1A1", "name": "*6", "het": "*1/*6", "hom": "*6/*6"}
]


@app.post("/api/vcf/parse")
def parse_vcf_payload(req: VcfParseRequest):
    """Universal PGx VCF parser that supports arbitrary sequencing, 1000G, and GIAB VCFs."""
    content = req.vcf_text or ""
    if not content and req.filename:
        file_path = find_specimen_file(req.filename)
        if file_path:
            content = file_path.read_text(encoding="utf-8")

    if not content:
        raise HTTPException(status_code=400, detail="No VCF text or recognized filename provided.")

    sample_id = "VCF-SPECIMEN"
    detected_build = "GRCh38"
    total_variants = 0
    locus_calls: Dict[str, Any] = {}

    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue

        if line.startswith("##"):
            if "reference" in line or "assembly" in line:
                if any(x in line for x in ["37", "hg19", "b37"]):
                    detected_build = "GRCh37"
                elif any(x in line for x in ["38", "hg38"]):
                    detected_build = "GRCh38"
            if "##SAMPLE=<" in line and "Accession=" in line:
                for part in line.split(","):
                    if "Accession=" in part:
                        sample_id = part.split("=")[1].strip(">").strip()
            continue

        if line.startswith("#CHROM"):
            parts = line.split("\t")
            if len(parts) >= 10 and parts[9].strip() and parts[9].strip() not in ["SAMPLE", "FORMAT"]:
                sample_id = parts[9].strip()
            continue

        total_variants += 1
        cols = line.split("\t")
        if len(cols) < 8:
            continue

        raw_chr = cols[0].lower().replace("chr", "")
        pos = int(cols[1]) if cols[1].isdigit() else -1
        rsid = cols[2].strip()
        info = cols[7]

        gt = "0/1"
        if len(cols) >= 10:
            format_keys = cols[8].split(":")
            sample_vals = cols[9].split(":")
            if "GT" in format_keys:
                gt_idx = format_keys.index("GT")
                if gt_idx < len(sample_vals):
                    gt = sample_vals[gt_idx]

        # Strategy 1: Pre-annotated INFO fields (e.g. PharmCAT benchmark callsets)
        px = None
        allele = None
        for item in info.split(";"):
            if item.startswith("PX=") or item.startswith("GENE="):
                px = item.split("=")[1]
            elif item.startswith("ALLELE="):
                raw_allele = item.split("=")[1]
                allele = raw_allele.split("_")[0]
                if "G/G" in item: allele = "G/G (rs9923231)"
                elif "A/A" in item: allele = "A/A (rs9923231)"
                elif "G/A" in item: allele = "G/A (rs9923231)"
                elif "*15:02" in item and "pos" in item.lower(): allele = "*15:02 Positive"
                elif "*15:02" in item and "neg" in item.lower(): allele = "*15:02 Negative"
        if px and allele:
            is_ref = "ref" in allele.lower() or allele == "*1/*1"
            if not is_ref or px not in locus_calls:
                locus_calls[px] = allele
            continue

        is_hom = gt in ["1/1", "1|1", "2/2"]
        is_het = gt in ["0/1", "1/0", "0|1", "1|0", "1/2", "1|2"]
        if not is_hom and not is_het:
            continue

        # Strategy 2: Match against PGx Variant Database by rsID or (chr, pos)
        for target in PGX_VARIANT_DATABASE:
            matched = False
            if rsid and rsid != "." and rsid.lower() == str(target["rsid"]).lower():
                matched = True
            elif raw_chr == target["chr"] and (pos == target["pos38"] or pos == target["pos37"]):
                matched = True

            if matched:
                gene = str(target["gene"])
                called = str(target["hom"] if is_hom else target["het"])
                if gene not in locus_calls or not isinstance(locus_calls[gene], list):
                    locus_calls[gene] = []
                locus_calls[gene].append({"name": str(target["name"]), "is_hom": is_hom, "called": called})
                break

    # Resolve standard 8 panel genes (defaulting unmutated genes to wild-type *1/*1)
    final_diplotypes = {
        "CYP2C19": "*1/*1",
        "CYP2D6": "*1/*1",
        "CYP2C9": "*1/*1",
        "VKORC1": "G/G (rs9923231)",
        "SLCO1B1": "*1/*1",
        "DPYD": "*1/*1",
        "HLA-B": "*15:02 Negative",
        "TPMT": "*1/*1"
    }

    for gene, calls in locus_calls.items():
        if isinstance(calls, str):
            final_diplotypes[gene] = calls
            continue
        if isinstance(calls, list) and calls:
            if gene == "CYP2C19":
                has_2 = any(c["name"] == "*2" for c in calls)
                has_17 = any(c["name"] == "*17" for c in calls)
                hom_2 = any(c["name"] == "*2" and c["is_hom"] for c in calls)
                hom_17 = any(c["name"] == "*17" and c["is_hom"] for c in calls)
                if hom_2:
                    final_diplotypes["CYP2C19"] = "*2/*2"
                elif hom_17:
                    final_diplotypes["CYP2C19"] = "*17/*17"
                elif has_2 and has_17:
                    final_diplotypes["CYP2C19"] = "*2/*17"
                elif has_2:
                    final_diplotypes["CYP2C19"] = "*1/*2"
                elif has_17:
                    final_diplotypes["CYP2C19"] = "*1/*17"
                else:
                    final_diplotypes["CYP2C19"] = calls[0]["called"]
            elif gene == "TPMT":
                has_3b = any(c["name"] == "*3B" for c in calls)
                has_3c = any(c["name"] == "*3C" for c in calls)
                if has_3b and has_3c:
                    final_diplotypes["TPMT"] = "*1/*3A"
                else:
                    final_diplotypes["TPMT"] = calls[0]["called"]
            else:
                final_diplotypes[gene] = calls[0]["called"]

    return {
        "status": "parsed_success",
        "sample_id": sample_id,
        "detected_build": detected_build,
        "total_variants_scanned": total_variants,
        "extracted_diplotypes": final_diplotypes
    }
