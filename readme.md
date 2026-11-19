# PharmaGraph Diagnostics — Clinical Pharmacogenomics & e-Prescribing CDS Portal

![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)
![Neo4j 5.x](https://img.shields.io/badge/Neo4j-5.x-008CC1?logo=neo4j&logoColor=white)
![NVIDIA NIMs](https://img.shields.io/badge/NVIDIA%20NIMs-Llama%203.3%2070B-76B900?logo=nvidia&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-0.3+-1C3C3C?logo=langchain&logoColor=white)
![PharmCAT](https://img.shields.io/badge/PharmCAT-v2.15-FF6F00)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Capstone%20Project-blueviolet)

---

## Project Overview

**PharmaGraph Diagnostics** is a clinical decision support system (CDSS) for
pharmacogenomics-guided prescribing. It translates a patient's VCF genotype
file into actionable drug–gene interaction alerts grounded in CPIC and DPWG
evidence-based guidelines.

The system is powered by:

| Component | Role |
|---|---|
| **Neo4j 5.x Property Graph** | Knowledge graph storing Gene → Diplotype → Phenotype → Drug relationships with CPIC/DPWG edge annotations |
| **NVIDIA NIMs (Llama 3.3 70B Instruct)** | Large-language model inference via NVIDIA AI Endpoints for natural-language clinical consultation |
| **LangChain GraphCypherQAChain** | Graph-retrieval-augmented generation (GraphRAG) pipeline that converts clinician questions into Cypher, retrieves evidence paths, and grounds LLM output |
| **PharmCAT v2.15** | Pharmacogenomics Clinical Annotation Tool for genotype calling and star-allele resolution |

Designed as a capstone project for clinical pharmacogenomics coursework.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PharmaGraph Diagnostics Architecture                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐     ┌──────────────────┐     ┌────────────────────┐  │
│  │  VCF Input   │────▶│  PharmCAT Parser  │────▶│  Neo4j Knowledge   │  │
│  │ (GRCh37/38)  │     │  (v2.15 + PGx DB) │     │  Graph (5.x)       │  │
│  └──────────────┘     └──────────────────┘     └────────┬───────────┘  │
│                                                          │              │
│                                                          ▼              │
│                                                ┌─────────────────────┐ │
│                                                │   GraphRAG Engine   │ │
│                                                │ LangChain + NVIDIA  │ │
│                                                │ NIMs (Llama 3.3)   │ │
│                                                └────────┬────────────┘ │
│                                                          │              │
│              ┌───────────────────────────────────────────┤              │
│              ▼                                           ▼              │
│  ┌────────────────────────┐              ┌────────────────────────┐    │
│  │  Clinical Decision     │              │   FHIR R4 Export       │    │
│  │  Support UI            │              │   DiagnosticReport +   │    │
│  │  (TailwindCSS/HTML5)   │              │   GuidanceResponse     │    │
│  └────────────────────────┘              └────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

- **8-Gene Pharmacogenomic Panel** — CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, HLA-B, TPMT (+ UGT1A1 auxiliary)
- **5-Hop Multi-Hop Pathway Visualization** — Gene → Phenotype → PK Exposure → ADR Risk → Guideline Action
- **CPIC v2022–2024 & DPWG v2024.05** evidence-grounded recommendations with edge-level citations
- **Ancestry-Stratified Coverage** with health equity alerts aligned to UN SDG 10 (Reduced Inequalities)
- **Drug-Drug-Gene Interaction (Phenoconversion) Detection** — identifies CYP2D6 inhibitor-mediated metabolizer status shifts
- **Hallucination Guardrail** — refuses ungrounded claims when zero graph paths are retrieved ("OUT-OF-SCOPE CLAIM BLOCKED")
- **VCF Upload** supporting GRCh37/GRCh38, 1000 Genomes, GIAB, and custom clinical VCFs
- **HL7 FHIR R4 Export** — DiagnosticReport + GuidanceResponse resource generation
- **SOAP Clinical Consultation Note Generator** — structured Subjective/Objective/Assessment/Plan notes
- **Patient-Facing PGx Passport** — plain-language handout for patient education
- **Therapeutic Drug Monitoring (TDM) Prompts** — lab follow-up recommendations for dose-adjusted medications
- **Clinical Override Audit Trail** — tracks clinician overrides with timestamped justification logging
- **6 Pre-Packaged Diverse Ancestry Specimen VCFs** + 1 wild-type benchmark control

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.10+ |
| Web Framework | FastAPI ≥ 0.115 |
| ASGI Server | Uvicorn |
| Knowledge Graph | Neo4j 5.x (Cypher) |
| RAG Orchestration | LangChain ≥ 0.3 / LangChain-Neo4j |
| LLM Inference | NVIDIA NIMs (Llama 3.3 70B Instruct) |
| Genotype Caller | PharmCAT v2.15 |
| Frontend | TailwindCSS, HTML5, Vanilla JS |
| Data Models | Pydantic v2 |
| Config | python-dotenv |

---

## Project Structure

```
study_capstone_project/
├── app.py                          # ASGI entrypoint (uvicorn app:app)
├── readme.md                       # This documentation
├── shared.js                       # Shared PGx state, knowledge base, & clinical logic
├── index.html                      # Page 1: Patient Clinical Intake & VCF Ingestion
├── pharmacogenes.html              # Page 2: 8 Core Pharmacogenes Panel & Health Equity
├── prescribing.html                # Page 3: e-Prescribing Formulary & DDGI Phenoconversion
├── cds-alerts.html                 # Page 4: Clinical Decision Support & 5-Hop Mechanism
├── consultation.html               # Page 5: AI Clinical Consultation & EHR Export
├── .env                            # Environment variables (NVIDIA NIMs / Neo4j)
│
├── backend/
│   ├── __init__.py                 # Package init
│   ├── main.py                     # FastAPI app, VCF parser, API routes, multi-page router
│   ├── graph_rag.py                # LangChain GraphCypherQAChain + NVIDIA NIMs
│   ├── seed_neo4j5.py              # Neo4j 5.x graph seeder (CPIC/DPWG edges for 9 genes)
│   └── requirements.txt           # Python dependencies
│
├── frontend/
│   ├── index.html                  # Page 1: Intake & VCF UI
│   ├── pharmacogenes.html          # Page 2: 8-Gene Assay UI
│   ├── prescribing.html            # Page 3: Formulary & DDGI UI
│   ├── cds-alerts.html             # Page 4: Decision Support & 5-Hop Trace UI
│   ├── consultation.html           # Page 5: Consultation, SOAP & FHIR UI
│   └── shared.js                   # Client-side shared state & persistence
│
├── data/
│   └── specimens/
│       ├── samples_manifest.json   # Specimen metadata manifest
│       ├── ACC_2026_8841_SAS.vcf   # South Asian specimen
│       ├── ACC_2026_8842_EAS.vcf   # East Asian specimen
│       ├── ACC_2026_8843_EUR.vcf   # European specimen
│       ├── ACC_2026_8844_AFR.vcf   # African specimen
│       ├── ACC_2026_8845_MULTI.vcf # Multi-ethnic specimen
│       └── BENCHMARK_CONTROL_WT.vcf # Wild-type control (GIAB NA12878)
│
└── tests/
    ├── __init__.py
    ├── conftest.py                 # Pytest fixtures
    └── test_cpic_accuracy.py       # CPIC accuracy & API test suite (14 unit tests)
```

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. (Optional) Start Neo4j and seed the knowledge graph
python backend/seed_neo4j5.py

# 3. Start the server
uvicorn app:app --reload --port 8000

# 4. Open the clinical portal
# Navigate to http://localhost:8000
```

---

## Environment Variables

Create a `.env` file in the project root (or edit the existing one):

```env
# NVIDIA NIMs Configuration
NVIDIA_API_KEY=nvapi-your_actual_nvidia_nim_key_here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.3-70b-instruct

# Neo4j 5.x Connection
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=pharmagraph2026
```

| Variable | Description | Default |
|---|---|---|
| `NVIDIA_API_KEY` | NVIDIA AI Endpoints API key for NIM inference | *(required for LLM)* |
| `NVIDIA_BASE_URL` | NVIDIA NIM API base URL | `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_MODEL` | Model identifier for NVIDIA NIM | `meta/llama-3.3-70b-instruct` |
| `NEO4J_URI` | Neo4j Bolt connection URI | `bolt://localhost:7687` |
| `NEO4J_USERNAME` | Neo4j username | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j password | `pharmagraph2026` |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Clinical Portal UI (serves `frontend/index.html`) |
| `GET` | `/api/health` | Health check — returns system status, API key detection, engine info |
| `POST` | `/api/consult` | NVIDIA NIM GraphRAG clinical consultation (guardrail-protected) |
| `POST` | `/api/vcf/parse` | Parse VCF text or sample file → extract diplotypes for 8-gene panel |
| `GET` | `/api/vcf/samples` | List pre-packaged sample VCF specimens |
| `GET` | `/api/vcf/download/{filename}` | Download a specific sample VCF file |
| `GET` | `/api/graph/schema` | Retrieve Neo4j knowledge graph schema |
| `POST` | `/api/graphrag/query` | Direct GraphRAG query (Cypher generation + LLM grounding) |
| `POST` | `/api/phenoconversion/check` | Drug-drug-gene interaction (phenoconversion) detection |
| `POST` | `/api/report/soap` | Generate SOAP clinical consultation note |
| `POST` | `/api/report/patient-handout` | Generate patient-facing PGx passport / plain-language handout |

---

## Neo4j Graph Schema

### Node Labels

| Label | Key Properties | Description |
|---|---|---|
| **Gene** | `symbol`, `hgnc`, `source` | Pharmacogene (e.g., CYP2C19, SLCO1B1) |
| **Diplotype** | `id`, `gene`, `allele` | Star-allele diplotype call (e.g., *2/*2) |
| **Phenotype** | `id`, `gene`, `name`, `score` | Metabolizer/function phenotype (e.g., Poor Metabolizer) |
| **Drug** | `name`, `rxnorm`, `drugClass` | Medication with RxNorm code (e.g., Clopidogrel) |

### Relationship Types

| Relationship | Direction | Description |
|---|---|---|
| `HAS_DIPLOTYPE` | Gene → Diplotype | Gene carries this diplotype call |
| `MAPS_TO_PHENOTYPE` | Diplotype → Phenotype | Diplotype resolves to this metabolizer phenotype |
| `CONTRAINDICATED_IN` | Phenotype → Drug | Drug is contraindicated for this phenotype (CRITICAL) |
| `REDUCE_DOSE_IN` | Phenotype → Drug | Drug requires dose reduction for this phenotype |
| `SAFE_STANDARD_DOSING` | Phenotype → Drug | Drug is safe at standard dose for this phenotype |
| `ALTERNATIVE_TO` | Drug → Drug | Therapeutic alternative recommendation |

### Edge Properties

All clinical edges carry: `edgeId`, `severity`, `cpic` (CPIC guideline citation), `dpwg` (DPWG guideline citation), and `action` (clinical recommendation text).

---

## Sample Specimens

| Filename | Accession | Ancestry | Key Risk |
|---|---|---|---|
| `ACC_2026_8841_SAS.vcf` | ACC-2026-8841 | South Asian | CYP2C19 *2/*2 — Clopidogrel resistance (stent thrombosis risk) |
| `ACC_2026_8842_EAS.vcf` | ACC-2026-8842 | East Asian | HLA-B *15:02 Positive — Carbamazepine SJS risk; CYP2C9 *3/*3 + VKORC1 A/A — severe warfarin bleeding |
| `ACC_2026_8843_EUR.vcf` | ACC-2026-8843 | European | DPYD *1/*2A — Fatal 5-FU/capecitabine toxicity risk |
| `ACC_2026_8844_AFR.vcf` | ACC-2026-8844 | African | SLCO1B1 *5/*5 — Simvastatin rhabdomyolysis; CYP2C19 *17/*17 — ultrarapid SSRI clearance |
| `ACC_2026_8845_MULTI.vcf` | ACC-2026-8845 | Multi-ethnic / Admixed | Multi-gene collision: CYP2C19 *2/*2 + CYP2D6 *4/*4 + SLCO1B1 *1/*5 |
| `BENCHMARK_CONTROL_WT.vcf` | REF-1000G-NA12878 | CEU (European) | Wild-type control — no actionable PGx variants |

---

## Data Sources & Licenses

| Source | URL | License |
|---|---|---|
| **CPIC** (Clinical Pharmacogenetics Implementation Consortium) | [cpicpgx.org](https://cpicpgx.org) | Creative Commons CC BY-SA 4.0 |
| **DPWG** (Dutch Pharmacogenetics Working Group) | [PharmGKB](https://www.pharmgkb.org) | Creative Commons CC BY-SA 4.0 |
| **PharmVar** (Pharmacogene Variation Consortium) | [pharmvar.org](https://www.pharmvar.org) | Open Access |
| **1000 Genomes Project** | [internationalgenome.org](https://www.internationalgenome.org) | Fort Lauderdale Agreement / Open Access |
| **Genome in a Bottle (GIAB)** | [NIST GIAB](https://www.nist.gov/programs-projects/genome-bottle) | Public Domain (NIST) |
| **PharmCAT** | [PharmCAT](https://pharmcat.org) | Mozilla Public License 2.0 |
| **dbSNP** | [NCBI dbSNP](https://www.ncbi.nlm.nih.gov/snp/) | Public Domain (NCBI) |

---

## Testing

Run the full test suite with:

```bash
python -m pytest tests/ -v
```

Run a specific test file:

```bash
python -m pytest tests/test_cpic_accuracy.py -v
```

The test suite covers:

- VCF parsing accuracy across all 6 specimen VCFs
- Diplotype-to-phenotype mapping verification
- Drug–gene severity classification (CRITICAL / MODERATE / STANDARD)
- Hallucination guardrail enforcement
- API endpoint validation (health, VCF samples)
- Phenoconversion detection

---

## Disclaimer

> **⚠️ CLINICAL DECISION SUPPORT PROTOTYPE — RESEARCH USE ONLY.**
>
> Not a medical device. Not FDA/CE cleared. Outputs are advisory and must be
> validated by licensed clinicians. Do not use for direct patient care without
> independent clinical verification.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Acknowledgments

This capstone project was made possible by the following communities and resources:

- **[CPIC](https://cpicpgx.org)** — Clinical Pharmacogenetics Implementation Consortium
- **[DPWG](https://www.pharmgkb.org)** — Dutch Pharmacogenetics Working Group
- **[PharmVar](https://www.pharmvar.org)** — Pharmacogene Variation Consortium
- **[PharmGKB](https://www.pharmgkb.org)** — Pharmacogenomics Knowledge Base
- **[NVIDIA NIMs](https://build.nvidia.com)** — NVIDIA Inference Microservices
- **[Neo4j](https://neo4j.com)** — Graph Database Platform
- **[LangChain](https://langchain.com)** — LLM Orchestration Framework
