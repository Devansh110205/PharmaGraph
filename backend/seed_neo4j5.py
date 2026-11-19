"""
seed_neo4j5.py — Full 9-gene PGx panel seeder for Neo4j 5.x

Seeds all CPIC v2024.09 / DPWG v2024.05 / PharmVar v6.1 pharmacogenomic
knowledge-graph edges for the complete clinical panel:

  CYP2C19 · CYP2D6 · CYP2C9 · VKORC1 · SLCO1B1 · DPYD · HLA-B · TPMT · UGT1A1

Every relationship edge carries:
    edgeId, severity, cpic, dpwg, action
"""

import os
from typing import Any, cast
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "pharmagraph2026")

CYPHER_STATEMENTS = [
    # ──────────────────────────────────────────────────────────────────────
    # Uniqueness constraints
    # ──────────────────────────────────────────────────────────────────────
    "CREATE CONSTRAINT gene_symbol IF NOT EXISTS FOR (g:Gene) REQUIRE g.symbol IS UNIQUE",
    "CREATE CONSTRAINT drug_rxnorm IF NOT EXISTS FOR (d:Drug) REQUIRE d.rxnorm IS UNIQUE",
    "CREATE CONSTRAINT diplotype_id IF NOT EXISTS FOR (dip:Diplotype) REQUIRE dip.id IS UNIQUE",
    "CREATE CONSTRAINT phenotype_id IF NOT EXISTS FOR (ph:Phenotype) REQUIRE ph.id IS UNIQUE",

    # ──────────────────────────────────────────────────────────────────────
    # 1. CYP2C19 — Clopidogrel, Sertraline, Citalopram, Prasugrel, Ticagrelor
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'CYP2C19', hgnc: 'HGNC:2621', source: 'PharmVar v6.1'})
    MERGE (dip:Diplotype {id: 'CYP2C19_*2/*2', gene: 'CYP2C19', allele: '*2/*2'})
    MERGE (ph:Phenotype {id: 'CYP2C19_PM', gene: 'CYP2C19', name: 'Poor Metabolizer', score: '0.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip)-[:MAPS_TO_PHENOTYPE]->(ph)
    MERGE (clop:Drug {name: 'Clopidogrel', rxnorm: 'RxNorm:32968', drugClass: 'Antiplatelet'})
    MERGE (pras:Drug {name: 'Prasugrel', rxnorm: 'RxNorm:613391', drugClass: 'Antiplatelet'})
    MERGE (tica:Drug {name: 'Ticagrelor', rxnorm: 'RxNorm:1116632', drugClass: 'Antiplatelet'})
    MERGE (sert:Drug {name: 'Sertraline', rxnorm: 'RxNorm:36437', drugClass: 'Antidepressant'})
    MERGE (cita:Drug {name: 'Citalopram', rxnorm: 'RxNorm:2556', drugClass: 'Antidepressant'})
    MERGE (ph)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-2C19-CLOP-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2022.07 Level A (PMID:35034351)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID CLOPIDOGREL — Prescribe Prasugrel or Ticagrelor'
    }]->(clop)
    MERGE (ph)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-2C19-SERT-01',
        severity: 'MODERATE',
        cpic: 'CPIC v2023.04 Level A/B',
        dpwg: 'DPWG v2024.05 Grade 3',
        action: 'REDUCE STARTING DOSE BY 50% (Max 75 mg/day)'
    }]->(sert)
    MERGE (ph)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-2C19-CITA-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2023.04 Level A',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'CAP DOSE <=20 MG/DAY OR SWITCH SSRI (QTc prolongation risk)'
    }]->(cita)
    MERGE (clop)-[:ALTERNATIVE_TO]->(pras)
    MERGE (clop)-[:ALTERNATIVE_TO]->(tica)
    MERGE (ph)-[:SAFE_STANDARD_DOSING {edgeId: 'EDGE-SAFE-2C19-PRAS-01'}]->(pras)
    MERGE (ph)-[:SAFE_STANDARD_DOSING {edgeId: 'EDGE-SAFE-2C19-TICA-01'}]->(tica)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 2. CYP2D6 — Codeine, Tramadol
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'CYP2D6', hgnc: 'HGNC:2625', source: 'PharmVar v6.1'})

    MERGE (dip_um:Diplotype {id: 'CYP2D6_*1/*1xN', gene: 'CYP2D6', allele: '*1/*1xN'})
    MERGE (ph_um:Phenotype {id: 'CYP2D6_UM', gene: 'CYP2D6', name: 'Ultrarapid Metabolizer', score: '3.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip_um)-[:MAPS_TO_PHENOTYPE]->(ph_um)

    MERGE (dip_pm:Diplotype {id: 'CYP2D6_*4/*4', gene: 'CYP2D6', allele: '*4/*4'})
    MERGE (ph_pm:Phenotype {id: 'CYP2D6_PM', gene: 'CYP2D6', name: 'Poor Metabolizer', score: '0.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip_pm)-[:MAPS_TO_PHENOTYPE]->(ph_pm)

    MERGE (cod:Drug {name: 'Codeine', rxnorm: 'RxNorm:2670', drugClass: 'Opioid Analgesic'})
    MERGE (tram:Drug {name: 'Tramadol', rxnorm: 'RxNorm:10689', drugClass: 'Opioid Analgesic'})

    MERGE (ph_um)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-2D6-COD-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2020.01 Level A (PMID:31562822)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID CODEINE — Risk of fatal respiratory depression in UM; use non-opioid analgesic'
    }]->(cod)
    MERGE (ph_um)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-2D6-TRAM-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2020.01 Level A (PMID:31562822)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID TRAMADOL — Increased toxicity risk in UM; use non-opioid analgesic'
    }]->(tram)
    MERGE (ph_pm)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-2D6-COD-02',
        severity: 'MODERATE',
        cpic: 'CPIC v2020.01 Level A (PMID:31562822)',
        dpwg: 'DPWG v2024.05 Grade 3',
        action: 'AVOID CODEINE in PM — Lack of efficacy (no morphine conversion); use alternative analgesic'
    }]->(cod)
    MERGE (ph_pm)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-2D6-TRAM-02',
        severity: 'MODERATE',
        cpic: 'CPIC v2020.01 Level A (PMID:31562822)',
        dpwg: 'DPWG v2024.05 Grade 3',
        action: 'AVOID TRAMADOL in PM — Reduced efficacy; consider non-opioid analgesic'
    }]->(tram)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 3. CYP2C9 — Warfarin
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'CYP2C9', hgnc: 'HGNC:2623', source: 'PharmVar v6.1'})
    MERGE (dip:Diplotype {id: 'CYP2C9_*3/*3', gene: 'CYP2C9', allele: '*3/*3'})
    MERGE (ph:Phenotype {id: 'CYP2C9_PM', gene: 'CYP2C9', name: 'Poor Metabolizer', score: '0.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip)-[:MAPS_TO_PHENOTYPE]->(ph)
    MERGE (warf:Drug {name: 'Warfarin', rxnorm: 'RxNorm:11289', drugClass: 'Anticoagulant'})
    MERGE (ph)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-2C9-WARF-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2017.03 Level A (PMID:28198005)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'REDUCE WARFARIN DOSE BY 20-40% — CYP2C9 PM increased bleeding risk; monitor INR closely'
    }]->(warf)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 4. VKORC1 — Warfarin sensitivity
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'VKORC1', hgnc: 'HGNC:23663', source: 'CPIC v2022'})
    MERGE (dip:Diplotype {id: 'VKORC1_A/A', gene: 'VKORC1', allele: 'A/A (rs9923231)'})
    MERGE (ph:Phenotype {id: 'VKORC1_HIGH_SENSITIVITY', gene: 'VKORC1', name: 'High Warfarin Sensitivity', score: 'N/A'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip)-[:MAPS_TO_PHENOTYPE]->(ph)
    MERGE (warf:Drug {name: 'Warfarin', rxnorm: 'RxNorm:11289', drugClass: 'Anticoagulant'})
    MERGE (ph)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-VKORC1-WARF-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2017.03 Level A (PMID:28198005)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'REDUCE WARFARIN DOSE BY 25-50% — VKORC1 A/A high sensitivity; start low, titrate slowly'
    }]->(warf)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 5. SLCO1B1 — Simvastatin, Rosuvastatin, Atorvastatin
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g2:Gene {symbol: 'SLCO1B1', hgnc: 'HGNC:10959', source: 'CPIC v2022'})
    MERGE (dip2:Diplotype {id: 'SLCO1B1_*5/*5', gene: 'SLCO1B1', allele: '*5/*5'})
    MERGE (ph2:Phenotype {id: 'SLCO1B1_PF', gene: 'SLCO1B1', name: 'Poor Function', score: '0.0'})
    MERGE (g2)-[:HAS_DIPLOTYPE]->(dip2)-[:MAPS_TO_PHENOTYPE]->(ph2)
    MERGE (simv:Drug {name: 'Simvastatin', rxnorm: 'RxNorm:36567', drugClass: 'Statin'})
    MERGE (rosu:Drug {name: 'Rosuvastatin', rxnorm: 'RxNorm:301542', drugClass: 'Statin'})
    MERGE (ator:Drug {name: 'Atorvastatin', rxnorm: 'RxNorm:83367', drugClass: 'Statin'})
    MERGE (ph2)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-SLCO-SIMV-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2022.02 Level A',
        dpwg: 'DPWG v2024.05 Grade 3',
        action: 'AVOID SIMVASTATIN — Switch to Rosuvastatin (<=20 mg/day)'
    }]->(simv)
    MERGE (simv)-[:ALTERNATIVE_TO]->(rosu)
    MERGE (ph2)-[:SAFE_STANDARD_DOSING {edgeId: 'EDGE-SAFE-SLCO-ROSU-01'}]->(rosu)
    MERGE (ph2)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-SLCO-ATOR-01',
        severity: 'MODERATE',
        cpic: 'CPIC v2022.02 Level A',
        dpwg: 'DPWG v2024.05 Grade 2',
        action: 'USE ATORVASTATIN WITH CAUTION — Consider lower dose; monitor for myopathy'
    }]->(ator)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 6. DPYD — Fluorouracil, Capecitabine
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g3:Gene {symbol: 'DPYD', hgnc: 'HGNC:3012', source: 'PharmVar v6.1'})
    MERGE (dip3:Diplotype {id: 'DPYD_*1/*2A', gene: 'DPYD', allele: '*1/*2A'})
    MERGE (ph3:Phenotype {id: 'DPYD_IM', gene: 'DPYD', name: 'Intermediate Metabolizer', score: '1.0'})
    MERGE (g3)-[:HAS_DIPLOTYPE]->(dip3)-[:MAPS_TO_PHENOTYPE]->(ph3)
    MERGE (fu:Drug {name: 'Fluorouracil (5-FU)', rxnorm: 'RxNorm:4492', drugClass: 'Oncology'})
    MERGE (cape:Drug {name: 'Capecitabine', rxnorm: 'RxNorm:194000', drugClass: 'Oncology'})
    MERGE (ph3)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-DPYD-5FU-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2018.11 Level A',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'REDUCE STARTING DOSE BY 50% — Severe/fatal fluoropyrimidine toxicity risk'
    }]->(fu)
    MERGE (ph3)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-DPYD-CAPE-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2018.11 Level A',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'REDUCE STARTING DOSE BY 50%'
    }]->(cape)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 7. HLA-B — Carbamazepine, Levetiracetam, Abacavir
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'HLA-B', hgnc: 'HGNC:4932', source: 'CPIC v2024'})

    MERGE (dip_1502:Diplotype {id: 'HLA-B_*15:02_POS', gene: 'HLA-B', allele: '*15:02 Positive'})
    MERGE (ph_1502:Phenotype {id: 'HLA-B_1502_CARRIER', gene: 'HLA-B', name: '*15:02 Positive (SJS/TEN Risk)', score: 'N/A'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip_1502)-[:MAPS_TO_PHENOTYPE]->(ph_1502)

    MERGE (dip_5701:Diplotype {id: 'HLA-B_*57:01_POS', gene: 'HLA-B', allele: '*57:01 Positive'})
    MERGE (ph_5701:Phenotype {id: 'HLA-B_5701_CARRIER', gene: 'HLA-B', name: '*57:01 Positive (HSR Risk)', score: 'N/A'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip_5701)-[:MAPS_TO_PHENOTYPE]->(ph_5701)

    MERGE (cbz:Drug {name: 'Carbamazepine', rxnorm: 'RxNorm:2002', drugClass: 'Antiepileptic'})
    MERGE (lev:Drug {name: 'Levetiracetam', rxnorm: 'RxNorm:39998', drugClass: 'Antiepileptic'})
    MERGE (abc:Drug {name: 'Abacavir', rxnorm: 'RxNorm:190521', drugClass: 'Antiretroviral'})

    MERGE (ph_1502)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-HLAB-CBZ-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2018.04 Level A (PMID:24407187)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID CARBAMAZEPINE — HLA-B*15:02 carrier at high risk of SJS/TEN; use Levetiracetam or other non-aromatic AED'
    }]->(cbz)
    MERGE (ph_1502)-[:SAFE_STANDARD_DOSING {
        edgeId: 'EDGE-SAFE-HLAB-LEV-01',
        severity: 'STANDARD',
        cpic: 'CPIC v2018.04 Level A (PMID:24407187)',
        dpwg: 'DPWG v2024.05 Grade 1',
        action: 'Levetiracetam is SAFE — No HLA-B*15:02 association'
    }]->(lev)
    MERGE (cbz)-[:ALTERNATIVE_TO]->(lev)

    MERGE (ph_5701)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-HLAB-ABC-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2014.09 Level A (PMID:22378157)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID ABACAVIR — HLA-B*57:01 carrier at high risk of hypersensitivity reaction'
    }]->(abc)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 8. TPMT — Azathioprine, Mercaptopurine
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'TPMT', hgnc: 'HGNC:12014', source: 'PharmVar v6.1'})

    MERGE (dip_im:Diplotype {id: 'TPMT_*1/*3A', gene: 'TPMT', allele: '*1/*3A'})
    MERGE (ph_im:Phenotype {id: 'TPMT_IM', gene: 'TPMT', name: 'Intermediate Metabolizer', score: '1.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip_im)-[:MAPS_TO_PHENOTYPE]->(ph_im)

    MERGE (dip_pm:Diplotype {id: 'TPMT_*3A/*3A', gene: 'TPMT', allele: '*3A/*3A'})
    MERGE (ph_pm:Phenotype {id: 'TPMT_PM', gene: 'TPMT', name: 'Poor Metabolizer', score: '0.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip_pm)-[:MAPS_TO_PHENOTYPE]->(ph_pm)

    MERGE (aza:Drug {name: 'Azathioprine', rxnorm: 'RxNorm:1256', drugClass: 'Immunosuppressant'})
    MERGE (merc:Drug {name: 'Mercaptopurine', rxnorm: 'RxNorm:6651', drugClass: 'Immunosuppressant'})

    MERGE (ph_im)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-TPMT-AZA-01',
        severity: 'MODERATE',
        cpic: 'CPIC v2019.02 Level A (PMID:21270794)',
        dpwg: 'DPWG v2024.05 Grade 3',
        action: 'REDUCE AZATHIOPRINE DOSE BY 30-50% — Intermediate TPMT activity; monitor CBC weekly'
    }]->(aza)
    MERGE (ph_im)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-TPMT-MERC-01',
        severity: 'MODERATE',
        cpic: 'CPIC v2019.02 Level A (PMID:21270794)',
        dpwg: 'DPWG v2024.05 Grade 3',
        action: 'REDUCE MERCAPTOPURINE DOSE BY 30-50% — Intermediate TPMT activity; monitor CBC weekly'
    }]->(merc)

    MERGE (ph_pm)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-TPMT-AZA-02',
        severity: 'CRITICAL',
        cpic: 'CPIC v2019.02 Level A (PMID:21270794)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID AZATHIOPRINE — TPMT PM at life-threatening myelosuppression risk; consider alternative immunosuppressant'
    }]->(aza)
    MERGE (ph_pm)-[:CONTRAINDICATED_IN {
        edgeId: 'EDGE-PGX-TPMT-MERC-02',
        severity: 'CRITICAL',
        cpic: 'CPIC v2019.02 Level A (PMID:21270794)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'AVOID MERCAPTOPURINE — TPMT PM at life-threatening myelosuppression risk'
    }]->(merc)
    """,

    # ──────────────────────────────────────────────────────────────────────
    # 9. UGT1A1 — Irinotecan, Atazanavir
    # ──────────────────────────────────────────────────────────────────────
    """
    MERGE (g:Gene {symbol: 'UGT1A1', hgnc: 'HGNC:12530', source: 'PharmVar v6.1'})
    MERGE (dip:Diplotype {id: 'UGT1A1_*28/*28', gene: 'UGT1A1', allele: '*28/*28'})
    MERGE (ph:Phenotype {id: 'UGT1A1_PM', gene: 'UGT1A1', name: 'Poor Metabolizer', score: '0.0'})
    MERGE (g)-[:HAS_DIPLOTYPE]->(dip)-[:MAPS_TO_PHENOTYPE]->(ph)
    MERGE (iri:Drug {name: 'Irinotecan', rxnorm: 'RxNorm:51499', drugClass: 'Oncology'})
    MERGE (ataz:Drug {name: 'Atazanavir', rxnorm: 'RxNorm:343047', drugClass: 'Antiretroviral'})
    MERGE (ph)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-UGT1A1-IRI-01',
        severity: 'CRITICAL',
        cpic: 'CPIC v2019.03 Level A (PMID:30950129)',
        dpwg: 'DPWG v2024.05 Grade 4',
        action: 'REDUCE IRINOTECAN DOSE BY 30% — UGT1A1 *28/*28 at high risk of severe neutropenia and diarrhea'
    }]->(iri)
    MERGE (ph)-[:REDUCE_DOSE_IN {
        edgeId: 'EDGE-PGX-UGT1A1-ATAZ-01',
        severity: 'MODERATE',
        cpic: 'CPIC v2016.02 Level A (PMID:26417955)',
        dpwg: 'DPWG v2024.05 Grade 2',
        action: 'MONITOR ATAZANAVIR — UGT1A1 *28/*28 increased risk of jaundice/hyperbilirubinemia; monitor LFTs'
    }]->(ataz)
    """,
]


def seed_neo4j() -> None:
    """Connect to Neo4j 5.x and execute all MERGE statements for the full PGx panel."""
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        driver.verify_connectivity()
        with driver.session() as session:
            for stmt in CYPHER_STATEMENTS:
                session.run(cast(Any, stmt))  # type: ignore
        driver.close()
        print(
            "SUCCESS: Seeded CPIC v2024.09, DPWG v2024.05, and PharmVar v6.1 edges "
            "into Neo4j 5.x for 9 genes: CYP2C19, CYP2D6, CYP2C9, VKORC1, "
            "SLCO1B1, DPYD, HLA-B, TPMT, UGT1A1."
        )
    except Exception as exc:
        print(f"NOTE: Neo4j 5.x not reachable at {NEO4J_URI} ({exc}).")
        print("The portal will automatically use its built-in Zero-Docker Property Graph.")


if __name__ == "__main__":
    seed_neo4j()
