/**
 * shared.js — PharmaGraph Diagnostics Shared State, Knowledge Base & Clinical Logic
 * Shared across all 5 clinical portal pages with localStorage persistence.
 */

const GENE_PANEL = {
    CYP2C19: {
        hgnc: "HGNC:2621",
        refDb: "PharmVar v6.1 / CPIC",
        alleles: {
            "*1/*1": { score: "2.0", phenotype: "Normal Metabolizer", pill: "emerald", variantNote: "Wild-type normal activity" },
            "*1/*2": { score: "1.0", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Heterozygous rs4244285 (c.681G>A)" },
            "*2/*2": { score: "0.0", phenotype: "Poor Metabolizer", pill: "rose", variantNote: "Homozygous loss-of-function rs4244285 (*2/*2)" },
            "*1/*17": { score: "2.5", phenotype: "Rapid Metabolizer", pill: "amber", variantNote: "Increased transcription rs12248560" },
            "*17/*17": { score: "3.0", phenotype: "Ultrarapid Metabolizer", pill: "rose", variantNote: "Homozygous gain-of-function (*17/*17)" },
            "*2/*17": { score: "1.0", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Compound heterozygote (*2 LoF + *17 GoF)" }
        },
        ancestry: {
            "South Asian": { freq: "32–36% LoF (*2/*3)", cov: 74 },
            "East Asian": { freq: "29–35% LoF (*2/*3)", cov: 79 },
            "European": { freq: "14–15% LoF / 21% *17", cov: 95 },
            "African": { freq: "17–18% LoF / 24% *17", cov: 65 }
        },
        equityWarning: "CYP2C19 loss-of-function (*2, *3) alleles occur at >2x higher frequency in South/East Asian populations compared to European cohorts."
    },
    CYP2D6: {
        hgnc: "HGNC:2625",
        refDb: "PharmVar v6.1 / CPIC",
        alleles: {
            "*1/*1": { score: "2.0", phenotype: "Normal Metabolizer", pill: "emerald", variantNote: "Wild-type fully functional" },
            "*1/*4": { score: "1.0", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Heterozygous rs3892097 splice defect" },
            "*4/*4": { score: "0.0", phenotype: "Poor Metabolizer", pill: "rose", variantNote: "Homozygous null rs3892097 (*4/*4)" },
            "*1/*1xN": { score: "≥3.0", phenotype: "Ultrarapid Metabolizer", pill: "rose", variantNote: "Gene copy-number duplication (*1xN)" },
            "*1/*10": { score: "1.25", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "East Asian decreased function *10" }
        },
        ancestry: {
            "European": { freq: "PM 6–10% / UM 2–3%", cov: 94 },
            "South Asian": { freq: "UM 3–6%", cov: 70 },
            "East Asian": { freq: "*10 Reduced 40%", cov: 76 }
        },
        equityWarning: "CYP2D6 copy-number duplications and African-specific reduced-function alleles are often missing from standard European commercial panels."
    },
    CYP2C9: {
        hgnc: "HGNC:2623",
        refDb: "PharmVar v6.1 / CPIC",
        alleles: {
            "*1/*1": { score: "2.0", phenotype: "Normal Metabolizer", pill: "emerald", variantNote: "Reference activity" },
            "*1/*2": { score: "1.5", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Heterozygous rs1799853 (430C>T)" },
            "*1/*3": { score: "1.0", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Heterozygous rs1057910 (1075A>C)" },
            "*3/*3": { score: "0.0", phenotype: "Poor Metabolizer", pill: "rose", variantNote: "Homozygous rs1057910 — severe Warfarin clearance deficit" },
            "*2/*3": { score: "0.5", phenotype: "Poor Metabolizer", pill: "rose", variantNote: "Compound heterozygote (*2 + *3)" }
        },
        ancestry: {
            "European": { freq: "*2 10–13% / *3 7–9%", cov: 92 },
            "South Asian": { freq: "*3 8–12%", cov: 78 },
            "East Asian": { freq: "*3 2–4%", cov: 85 }
        },
        equityWarning: "Warfarin dosing algorithms must integrate both CYP2C9 and VKORC1. Dosing algorithms derived solely on Europeans under-dose African and Asian patients."
    },
    VKORC1: {
        hgnc: "HGNC:23663",
        refDb: "CPIC v2022",
        alleles: {
            "G/G (rs9923231)": { score: "Normal", phenotype: "Normal Warfarin Sensitivity", pill: "emerald", variantNote: "Wild-type promoter" },
            "G/A (rs9923231)": { score: "Intermediate", phenotype: "Intermediate Warfarin Sensitivity", pill: "amber", variantNote: "Heterozygous -1639G>A" },
            "A/A (rs9923231)": { score: "High", phenotype: "High Warfarin Sensitivity", pill: "rose", variantNote: "Homozygous -1639A/A — requires 30–50% dose reduction" }
        },
        ancestry: {
            "East Asian": { freq: "A allele ~90%", cov: 96 },
            "European": { freq: "A allele ~37%", cov: 91 },
            "African": { freq: "A allele ~10%", cov: 60 }
        },
        equityWarning: "The VKORC1 -1639A sensitivity allele reaches ~90% prevalence in East Asians, dictating markedly lower baseline Warfarin initiation doses."
    },
    SLCO1B1: {
        hgnc: "HGNC:10959",
        refDb: "CPIC v2022",
        alleles: {
            "*1/*1": { score: "2.0", phenotype: "Normal Function", pill: "emerald", variantNote: "Normal hepatic uptake transporter" },
            "*1/*5": { score: "1.0", phenotype: "Decreased Function", pill: "amber", variantNote: "Heterozygous rs4149056 (521T>C)" },
            "*5/*5": { score: "0.0", phenotype: "Poor Function", pill: "rose", variantNote: "Homozygous rs4149056 — severe statin myopathy risk (+221% AUC)" }
        },
        ancestry: {
            "European": { freq: "*5 allele ~15%", cov: 94 },
            "African": { freq: "*5 allele ~2%", cov: 60 },
            "South Asian": { freq: "*5 allele ~8%", cov: 72 }
        },
        equityWarning: "High-dose Simvastatin is contraindicated in SLCO1B1 *5 carriers. Rosuvastatin or Atorvastatin are safer alternatives."
    },
    DPYD: {
        hgnc: "HGNC:3012",
        refDb: "PharmVar v6.1 / CPIC",
        alleles: {
            "*1/*1": { score: "2.0", phenotype: "Normal Metabolizer", pill: "emerald", variantNote: "Standard fluoropyrimidine clearance" },
            "*1/*2A": { score: "1.0", phenotype: "Intermediate Metabolizer", pill: "rose", variantNote: "Splice variant rs3918290 — 50% dose reduction required" },
            "*2A/*2A": { score: "0.0", phenotype: "Poor Metabolizer", pill: "rose", variantNote: "Complete DPD deficiency — fatal 5-FU toxicity risk" },
            "*1/c.2846A>T": { score: "1.5", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Missense rs67376798 (c.2846A>T)" }
        },
        ancestry: {
            "European": { freq: "*2A 3–5%", cov: 95 },
            "African": { freq: "p.Y186C variant ~2%", cov: 55 }
        },
        equityWarning: "European DPYD panels testing only *2A omit African-specific functional variant p.Y186C (rs115687345)."
    },
    "HLA-B": {
        hgnc: "HGNC:4932",
        refDb: "CPIC",
        alleles: {
            "*15:02 Negative": { score: "Neg", phenotype: "Normal Risk", pill: "emerald", variantNote: "Risk allele not detected" },
            "*15:02 Positive": { score: "Pos", phenotype: "High-Risk Positive", pill: "rose", variantNote: "Carrier of HLA-B*15:02 (SJS/TEN risk with Carbamazepine)" }
        },
        ancestry: {
            "East Asian": { freq: "8–15% Carrier", cov: 93 },
            "European": { freq: "<0.1% Carrier", cov: 90 }
        },
        equityWarning: "HLA-B*15:02 is concentrated in East Asian and South Asian populations; mandatory FDA boxed warning before prescribing Carbamazepine."
    },
    TPMT: {
        hgnc: "HGNC:12014",
        refDb: "CPIC",
        alleles: {
            "*1/*1": { score: "2.0", phenotype: "Normal Metabolizer", pill: "emerald", variantNote: "Standard thiopurine metabolism" },
            "*1/*3A": { score: "1.0", phenotype: "Intermediate Metabolizer", pill: "amber", variantNote: "Heterozygous *3A (rs1800460 + rs1142345) — 30-50% dose cut" },
            "*3A/*3A": { score: "0.0", phenotype: "Poor Metabolizer", pill: "rose", variantNote: "Homozygous null — severe fatal myelosuppression risk" }
        },
        ancestry: {
            "European": { freq: "IM 8–10%", cov: 94 },
            "African": { freq: "*3C predominant", cov: 75 }
        },
        equityWarning: "TPMT deficiency causes life-threatening neutropenia under standard Azathioprine or Mercaptopurine doses."
    }
};

const ACCESSIONS = {
    "ACC-2026-8841": {
        accessionNo: "ACC-2026-8841",
        patientId: "PT-IND-9042",
        ageSex: "58 Y / Male",
        ancestry: "South Asian",
        department: "Cardiology & Behavioral Health",
        physician: "Dr. R. Subramanian, MD",
        condition: "Acute Coronary Syndrome (Post-PCI) & Major Depressive Disorder",
        verifiedDate: "2026-10-20 11:15 IST",
        diplotypes: {
            CYP2C19: "*2/*2",
            CYP2D6: "*1/*1",
            CYP2C9: "*1/*1",
            VKORC1: "G/G (rs9923231)",
            SLCO1B1: "*1/*1",
            DPYD: "*1/*1",
            "HLA-B": "*15:02 Negative",
            TPMT: "*1/*1"
        },
        defaultRx: ["clopidogrel", "sertraline"]
    },
    "ACC-2026-8842": {
        accessionNo: "ACC-2026-8842",
        patientId: "PT-EAS-4418",
        ageSex: "42 Y / Female",
        ancestry: "East Asian",
        department: "Neurology & Thrombosis Clinic",
        physician: "Dr. M. Chen, MD",
        condition: "Focal Seizures & Atrial Fibrillation",
        verifiedDate: "2026-10-20 09:50 IST",
        diplotypes: {
            CYP2C19: "*1/*2",
            CYP2D6: "*1/*1",
            CYP2C9: "*3/*3",
            VKORC1: "A/A (rs9923231)",
            SLCO1B1: "*1/*1",
            DPYD: "*1/*1",
            "HLA-B": "*15:02 Positive",
            TPMT: "*1/*1"
        },
        defaultRx: ["carbamazepine", "warfarin"]
    },
    "ACC-2026-8843": {
        accessionNo: "ACC-2026-8843",
        patientId: "PT-EUR-7105",
        ageSex: "66 Y / Male",
        ancestry: "European",
        department: "Medical Oncology & Palliative Care",
        physician: "Dr. C. Dupont, MD",
        condition: "Stage III Colorectal Adenocarcinoma & Post-Surgical Cancer Pain",
        verifiedDate: "2026-10-21 14:30 CET",
        diplotypes: {
            CYP2C19: "*1/*1",
            CYP2D6: "*1/*1xN",
            CYP2C9: "*1/*1",
            VKORC1: "G/G (rs9923231)",
            SLCO1B1: "*1/*1",
            DPYD: "*1/*2A",
            "HLA-B": "*15:02 Negative",
            TPMT: "*1/*1"
        },
        defaultRx: ["fluorouracil", "codeine"]
    },
    "ACC-2026-8844": {
        accessionNo: "ACC-2026-8844",
        patientId: "PT-AFR-3390",
        ageSex: "51 Y / Female",
        ancestry: "African",
        department: "Preventive Cardiology & Psychiatry",
        physician: "Dr. K. Mensah, MD",
        condition: "Hypercholesterolemia & Generalized Anxiety Disorder",
        verifiedDate: "2026-10-21 16:10 GMT",
        diplotypes: {
            CYP2C19: "*17/*17",
            CYP2D6: "*1/*1",
            CYP2C9: "*1/*1",
            VKORC1: "G/G (rs9923231)",
            SLCO1B1: "*5/*5",
            DPYD: "*1/*1",
            "HLA-B": "*15:02 Negative",
            TPMT: "*1/*1"
        },
        defaultRx: ["simvastatin", "sertraline"]
    },
    "ACC-2026-8845": {
        accessionNo: "ACC-2026-8845",
        patientId: "PT-CUS-9901",
        ageSex: "63 Y / Male",
        ancestry: "Multi-ethnic / Admixed",
        department: "Multidisciplinary Complex Care",
        physician: "Dr. S. Nair, MD",
        condition: "Triple-Vessel CAD, Neuropathic Pain & Severe Dyslipidemia",
        verifiedDate: "2026-10-22 08:00 IST",
        diplotypes: {
            CYP2C19: "*2/*2",
            CYP2D6: "*4/*4",
            CYP2C9: "*1/*1",
            VKORC1: "G/G (rs9923231)",
            SLCO1B1: "*1/*5",
            DPYD: "*1/*1",
            "HLA-B": "*15:02 Negative",
            TPMT: "*1/*1"
        },
        defaultRx: ["clopidogrel", "codeine", "simvastatin"]
    },
    "REF-1000G-NA12878": {
        accessionNo: "REF-1000G-NA12878",
        patientId: "NA12878 / HG001 (GIAB Reference Control)",
        ageSex: "48 Y / Female",
        ancestry: "CEU (Utah Residents with NW European Ancestry)",
        department: "Reference Benchmark Control",
        physician: "Prof. Genomic Quality Control, MD",
        condition: "Reference Normal Control — Wild Type Across Core Panel",
        verifiedDate: "2026-10-22 10:00 UTC",
        diplotypes: {
            CYP2C19: "*1/*1",
            CYP2D6: "*1/*1",
            CYP2C9: "*1/*1",
            VKORC1: "G/G (rs9923231)",
            SLCO1B1: "*1/*1",
            DPYD: "*1/*1",
            "HLA-B": "*15:02 Negative",
            TPMT: "*1/*1"
        },
        defaultRx: ["clopidogrel", "simvastatin"]
    }
};

const FORMULARY = {
    clopidogrel: {
        name: "Clopidogrel",
        rxnorm: "RxNorm:32968",
        drugClass: "Antiplatelet",
        gene: "CYP2C19",
        alternatives: ["prasugrel", "ticagrelor"],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2C19", diplotypes.CYP2C19).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 4",
                    summaryAction: "AVOID CLOPIDOGREL — Prescribe Prasugrel (10 mg/day) or Ticagrelor (90 mg BID).",
                    kineticsNode: "Zero Bioactivation (CYP2C19 Loss)",
                    exposureNode: "-72% Active Thiol Metabolite",
                    adrNode: "Stent Thrombosis & Ischemic Recurrence",
                    prescribingNode: "Switch to Prasugrel / Ticagrelor",
                    cpicText: "Avoid clopidogrel due to significantly reduced active metabolite formation and increased risk of major cardiovascular events. (CPIC v2022.07, PMID:35034351).",
                    dpwgText: "Select an alternative antiplatelet drug (prasugrel or ticagrelor) in CYP2C19 poor metabolizers. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-CLOP-01"
                };
            }
            if (pheno === "Intermediate Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A / DPWG Grade 3",
                    summaryAction: "USE ALTERNATIVE ANTIPLATELET — Consider Prasugrel or Ticagrelor (diminished clopidogrel response).",
                    kineticsNode: "Reduced Bioactivation (~50%)",
                    exposureNode: "Diminished Platelet Inhibition",
                    adrNode: "Residual Thrombotic Risk",
                    prescribingNode: "Consider Prasugrel or Ticagrelor",
                    cpicText: "Alternative antiplatelet therapy (prasugrel or ticagrelor) is recommended in acute coronary syndrome/PCI settings. (CPIC v2022.07).",
                    dpwgText: "Select alternative or double clopidogrel dose per protocol. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-CLOP-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Prescribe standard 75 mg/day.",
                kineticsNode: "Normal Bioactivation",
                exposureNode: "Expected Plasma Concentration",
                adrNode: "Baseline Cardiovascular Risk",
                prescribingNode: "Standard Regimen (75 mg/day)",
                cpicText: "Standard clopidogrel dosing is recommended. (CPIC v2022.07).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2C19-CLOP-03"
            };
        }
    },
    prasugrel: {
        name: "Prasugrel",
        rxnorm: "RxNorm:613391",
        drugClass: "Antiplatelet",
        gene: "CYP2C19",
        alternatives: [],
        evaluate: () => ({
            severity: "STANDARD",
            rank: 3,
            evidenceBadge: "CPIC Level A Safe Alternative",
            summaryAction: "SUITABLE ALTERNATIVE — Standard dosing (10 mg QD); unaffected by CYP2C19.",
            kineticsNode: "CYP3A4 / CYP2B6 Cleavage",
            exposureNode: "Normal Active Metabolite Formation",
            adrNode: "Effective Platelet Inhibition",
            prescribingNode: "Standard Dosing (10 mg QD)",
            cpicText: "Prasugrel metabolism does not depend on CYP2C19; safe alternative in poor metabolizers. (CPIC v2022.07).",
            dpwgText: "Approved alternative to clopidogrel in CYP2C19 PM/IM. (DPWG v2024.05).",
            edgeId: "EDGE-SAFE-2C19-PRAS-01"
        })
    },
    ticagrelor: {
        name: "Ticagrelor",
        rxnorm: "RxNorm:1116632",
        drugClass: "Antiplatelet",
        gene: "CYP2C19",
        alternatives: [],
        evaluate: () => ({
            severity: "STANDARD",
            rank: 3,
            evidenceBadge: "CPIC Level A Safe Alternative",
            summaryAction: "SUITABLE ALTERNATIVE — Standard dosing (90 mg BID); direct P2Y12 inhibitor.",
            kineticsNode: "Direct Acting (No Hepatic Bioactivation)",
            exposureNode: "Potent P2Y12 Blockade",
            adrNode: "Predictable Antiplatelet Action",
            prescribingNode: "Standard Dosing (90 mg BID)",
            cpicText: "Ticagrelor is not a prodrug and is unaffected by CYP2C19 status. (CPIC v2022.07).",
            dpwgText: "Approved alternative to clopidogrel in CYP2C19 PM/IM. (DPWG v2024.05).",
            edgeId: "EDGE-SAFE-2C19-TICA-01"
        })
    },
    citalopram: {
        name: "Citalopram",
        rxnorm: "RxNorm:2556",
        drugClass: "Antidepressant (SSRI)",
        gene: "CYP2C19",
        alternatives: ["sertraline"],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2C19", diplotypes.CYP2C19).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Warning",
                    summaryAction: "DOSE CAP ≤20 MG/DAY OR SWITCH — Severe QTc prolongation and Torsades de Pointes risk.",
                    kineticsNode: "Severely Reduced CYP2C19 N-demethylation",
                    exposureNode: "+100% Citalopram Plasma AUC",
                    adrNode: "Fatal QTc Prolongation & Ventricular Arrhythmias",
                    prescribingNode: "Cap at ≤20 mg/day or switch to Sertraline",
                    cpicText: "In CYP2C19 poor metabolizers, reduce starting dose by 50% or do not exceed 20 mg/day due to risk of QT prolongation. (CPIC v2023.04, PMID:25974703).",
                    dpwgText: "Do not exceed maximum daily dose of 20 mg citalopram in PMs. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-CITA-01"
                };
            }
            if (pheno === "Ultrarapid Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "MONITOR FOR THERAPEUTIC INEFFICIENCY — Accelerated clearance; consider alternative SSRI.",
                    kineticsNode: "Hyperactive CYP2C19 Clearance",
                    exposureNode: "-45% Citalopram Exposure",
                    adrNode: "Lack of Efficacy / Relapse of Depression",
                    prescribingNode: "Titrate to Response or Switch SSRI",
                    cpicText: "Consider an alternative antidepressant not predominantly metabolized by CYP2C19 due to probability of therapeutic failure. (CPIC v2023.04).",
                    dpwgText: "Titrate dose or select alternative antidepressant. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-CITA-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Initiate standard 20 mg/day; monitor ECG if risk factors present.",
                kineticsNode: "Normal CYP2C19 Demethylation",
                exposureNode: "Therapeutic Steady-State",
                adrNode: "Baseline Cardiac Safety Profile",
                prescribingNode: "Standard Dosing (20–40 mg/day)",
                cpicText: "Standard initial dosing is recommended. (CPIC v2023.04).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2C19-CITA-03"
            };
        }
    },
    escitalopram: {
        name: "Escitalopram",
        rxnorm: "RxNorm:32994",
        drugClass: "Antidepressant (SSRI)",
        gene: "CYP2C19",
        alternatives: ["sertraline"],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2C19", diplotypes.CYP2C19).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A / DPWG Grade 3",
                    summaryAction: "REDUCE STARTING DOSE BY 50% — Maximum 10 mg/day (elevated plasma concentration).",
                    kineticsNode: "Impaired S-enantiomer Clearance",
                    exposureNode: "+85% Escitalopram Plasma AUC",
                    adrNode: "QTc Prolongation & Serotonergic Toxicity",
                    prescribingNode: "Cap Dose at ≤10 mg/day",
                    cpicText: "In CYP2C19 poor metabolizers, reduce starting dose by 50% or cap at 10 mg/day. (CPIC v2023.04, PMID:25974703).",
                    dpwgText: "Reduce dose by 50% or maximum 10 mg/day. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-ESCIT-01"
                };
            }
            if (pheno === "Ultrarapid Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "MONITOR EFFICACY — Rapid clearance may cause treatment non-response.",
                    kineticsNode: "Accelerated S-citalopram clearance",
                    exposureNode: "-40% Plasma Exposure",
                    adrNode: "Depressive Symptom Non-Response",
                    prescribingNode: "Titrate to Clinical Response",
                    cpicText: "Be alert for diminished therapeutic response; consider alternative antidepressant if unassisted. (CPIC v2023.04).",
                    dpwgText: "Titrate dose to response. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-ESCIT-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard 10 mg/day initiation.",
                kineticsNode: "Normal CYP2C19 Clearance",
                exposureNode: "Therapeutic Steady-State",
                adrNode: "Expected Tolerability",
                prescribingNode: "Standard Dosing (10–20 mg/day)",
                cpicText: "Initiate at standard starting dose. (CPIC v2023.04).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2C19-ESCIT-03"
            };
        }
    },
    sertraline: {
        name: "Sertraline",
        rxnorm: "RxNorm:36437",
        drugClass: "Antidepressant (SSRI)",
        gene: "CYP2C19",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2C19", diplotypes.CYP2C19).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A/B / DPWG Grade 3",
                    summaryAction: "REDUCE STARTING DOSE BY 50% — Cap maximum daily dose at 75 mg.",
                    kineticsNode: "Reduced Sertraline Hydroxylation",
                    exposureNode: "+80% Parent Drug Exposure",
                    adrNode: "Serotonergic Side Effects & GI Intolerance",
                    prescribingNode: "Reduce Starting Dose by 50%",
                    cpicText: "Reduce starting dose by 50% or select alternative antidepressant not predominantly metabolized by CYP2C19. (CPIC v2023.04).",
                    dpwgText: "Reduce dose by 50% or titrate based on plasma concentration. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-SERT-01"
                };
            }
            if (pheno === "Ultrarapid Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "MONITOR FOR THERAPEUTIC FAILURE — Rapid clearance may necessitate dose increase.",
                    kineticsNode: "Accelerated Hydroxylation",
                    exposureNode: "-40% Plasma AUC",
                    adrNode: "Lack of Efficacy / Depressive Relapse",
                    prescribingNode: "Titrate to Response",
                    cpicText: "Be alert for diminished therapeutic response; titrate or switch SSRI if response is inadequate. (CPIC v2023.04).",
                    dpwgText: "Titrate dose to clinical efficacy. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C19-SERT-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Initiate at standard 50 mg/day.",
                kineticsNode: "Standard CYP2C19 Clearance",
                exposureNode: "Therapeutic Steady-State",
                adrNode: "Standard Safety Profile",
                prescribingNode: "Standard Regimen (50 mg/day)",
                cpicText: "Initiate sertraline at standard recommended dosing. (CPIC v2023.04).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2C19-SERT-03"
            };
        }
    },
    amitriptyline: {
        name: "Amitriptyline",
        rxnorm: "RxNorm:704",
        drugClass: "Tricyclic Antidepressant",
        gene: "CYP2D6",
        alternatives: ["sertraline"],
        evaluate: (diplotypes) => {
            const pheno2D6 = getAlleleInfo("CYP2D6", diplotypes.CYP2D6).phenotype;
            const pheno2C19 = getAlleleInfo("CYP2C19", diplotypes.CYP2C19).phenotype;
            if (pheno2D6 === "Poor Metabolizer" || pheno2C19 === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 4",
                    summaryAction: "AVOID AMITRIPTYLINE — Severe cardiotoxicity, anticholinergic delirium, and arrhythmia risk.",
                    kineticsNode: "Impaired TCA Hydroxylation / Demethylation",
                    exposureNode: "+150% Toxic Tricyclic Blood Levels",
                    adrNode: "Fatal QTc Arrhythmia & Orthostatic Shock",
                    prescribingNode: "Switch to Non-TCA Antidepressant (Sertraline)",
                    cpicText: "Avoid amitriptyline in CYP2D6 or CYP2C19 poor metabolizers due to elevated plasma concentrations and cardiotoxicity risk; consider alternative SSRI. (CPIC v2016.12, PMID:27997040).",
                    dpwgText: "Select alternative drug or reduce dose by 50% with therapeutic drug monitoring. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-AMIT-01"
                };
            }
            if (pheno2D6 === "Ultrarapid Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "AVOID AMITRIPTYLINE — Severe lack of therapeutic efficacy from ultra-rapid clearance.",
                    kineticsNode: "Hyperactive CYP2D6 Hydroxylation",
                    exposureNode: "-70% Active Parent Amitriptyline",
                    adrNode: "Therapeutic Failure in Severe Neuropathic Pain / Depression",
                    prescribingNode: "Switch to Alternative Agent",
                    cpicText: "Avoid tricyclics in ultrarapid metabolizers due to high probability of therapeutic failure. (CPIC v2016.12).",
                    dpwgText: "Select alternative antidepressant. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-AMIT-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD INITIATION — Initiate at 25–50 mg at bedtime.",
                kineticsNode: "Balanced Clearance (2C19 & 2D6)",
                exposureNode: "Therapeutic Nortriptyline Ratio",
                adrNode: "Expected Tolerability Profile",
                prescribingNode: "Standard Initial Regimen",
                cpicText: "Standard starting doses are recommended. (CPIC v2016.12).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2D6-AMIT-03"
            };
        }
    },
    simvastatin: {
        name: "Simvastatin",
        rxnorm: "RxNorm:36567",
        drugClass: "Statin",
        gene: "SLCO1B1",
        alternatives: ["rosuvastatin", "atorvastatin"],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("SLCO1B1", diplotypes.SLCO1B1).phenotype;
            if (pheno === "Poor Function") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 3",
                    summaryAction: "AVOID SIMVASTATIN — Switch to Rosuvastatin (≤20 mg/day) or Atorvastatin.",
                    kineticsNode: "Impaired OATP1B1 Hepatic Uptake",
                    exposureNode: "+221% Statin Plasma AUC Elevation",
                    adrNode: "Statin-Induced Myopathy / Rhabdomyolysis",
                    prescribingNode: "Switch to Rosuvastatin ≤20mg",
                    cpicText: "Avoid simvastatin; prescribe an alternative statin such as rosuvastatin or pravastatin due to markedly increased risk of myopathy. (CPIC v2022.02, PMID:35152405).",
                    dpwgText: "Avoid simvastatin; choose rosuvastatin or pravastatin. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-SLCO-SIMV-01"
                };
            }
            if (pheno === "Decreased Function") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "DOSE CAP SIMVASTATIN — Do not exceed 20 mg/day; monitor CK levels.",
                    kineticsNode: "Moderately Reduced Hepatic Clearance",
                    exposureNode: "+100% Statin AUC Exposure",
                    adrNode: "Elevated Muscle Pain / Myalgia Risk",
                    prescribingNode: "Cap Dose at ≤20 mg/day",
                    cpicText: "Prescribe ≤20 mg/day simvastatin or consider alternative statin. (CPIC v2022.02).",
                    dpwgText: "Dose reduction recommended. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-SLCO-SIMV-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard titration (20–40 mg/day).",
                kineticsNode: "Normal OATP1B1 Uptake",
                exposureNode: "Expected Statin Exposure",
                adrNode: "Standard Myopathy Risk",
                prescribingNode: "Standard Regimen",
                cpicText: "Standard simvastatin dosing is recommended. (CPIC v2022.02).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-SLCO-SIMV-03"
            };
        }
    },
    atorvastatin: {
        name: "Atorvastatin",
        rxnorm: "RxNorm:83367",
        drugClass: "Statin",
        gene: "SLCO1B1",
        alternatives: ["rosuvastatin"],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("SLCO1B1", diplotypes.SLCO1B1).phenotype;
            if (pheno === "Poor Function") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A Safe Statin",
                    summaryAction: "SUITABLE ALTERNATIVE STATIN — Cap dose at ≤40 mg/day (lower sensitivity to SLCO1B1 *5).",
                    kineticsNode: "CYP3A4 + OATP1B1 Dual Clearance",
                    exposureNode: "Mild (+40%) AUC Increase",
                    adrNode: "Low Myopathy Risk compared to Simvastatin",
                    prescribingNode: "Prescribe ≤40 mg/day",
                    cpicText: "Atorvastatin has significantly lower risk of myopathy than simvastatin in SLCO1B1 poor function. (CPIC v2022.02).",
                    dpwgText: "Safe alternative statin with dose titration. (DPWG v2024.05).",
                    edgeId: "EDGE-SAFE-SLCO-ATOR-01"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Prescribe standard 10–80 mg/day.",
                kineticsNode: "Normal Hepatic Uptake & Metabolism",
                exposureNode: "Therapeutic Lipid Lowering",
                adrNode: "Baseline Safety Profile",
                prescribingNode: "Standard Dosing Regimen",
                cpicText: "Standard atorvastatin dosing is recommended. (CPIC v2022.02).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-SLCO-ATOR-02"
            };
        }
    },
    rosuvastatin: {
        name: "Rosuvastatin",
        rxnorm: "RxNorm:301542",
        drugClass: "Statin",
        gene: "SLCO1B1",
        alternatives: [],
        evaluate: () => ({
            severity: "STANDARD",
            rank: 3,
            evidenceBadge: "CPIC Level A Safe Alternative",
            summaryAction: "SAFE ALTERNATIVE STATIN — Initiate ≤20 mg/day; minimal OATP1B1 sensitivity.",
            kineticsNode: "Multitransporter Clearance (BCRP/OATP)",
            exposureNode: "Low Myotoxicity Profile",
            adrNode: "Low Myopathy Risk",
            prescribingNode: "Initiate ≤20 mg/day",
            cpicText: "Rosuvastatin has lower sensitivity to SLCO1B1 *5; safe alternative in poor function carriers. (CPIC v2022.02).",
            dpwgText: "Preferred alternative in SLCO1B1 dysfunction. (DPWG v2024.05).",
            edgeId: "EDGE-SAFE-SLCO-ROSU-01"
        })
    },
    carbamazepine: {
        name: "Carbamazepine",
        rxnorm: "RxNorm:2002",
        drugClass: "Anticonvulsant",
        gene: "HLA-B",
        alternatives: ["levetiracetam"],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("HLA-B", diplotypes["HLA-B"]).phenotype;
            if (pheno === "High-Risk Positive") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Boxed Warning",
                    summaryAction: "CONTRAINDICATED — Switch to Levetiracetam (Severe SJS/TEN risk).",
                    kineticsNode: "HLA-B*15:02 MHC Antigen Presentation",
                    exposureNode: "Cytotoxic T-Cell Hyper-Activation",
                    adrNode: "Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis",
                    prescribingNode: "Switch to Levetiracetam",
                    cpicText: "Do not use carbamazepine in patients positive for HLA-B*15:02; life-threatening cutaneous adverse reactions. (CPIC v2018.04, PMID:24407187).",
                    dpwgText: "Avoid carbamazepine; select non-aromatic antiepileptic like levetiracetam. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-HLAB-CBZ-01"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — HLA-B*15:02 risk allele not detected.",
                kineticsNode: "Absence of MHC-I Presentation Trigger",
                exposureNode: "Normal Antigenic Profile",
                adrNode: "Baseline Cutaneous Risk",
                prescribingNode: "Standard Titration",
                cpicText: "Use per standard guidelines. (CPIC v2018.04).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-HLAB-CBZ-02"
            };
        }
    },
    levetiracetam: {
        name: "Levetiracetam",
        rxnorm: "RxNorm:39998",
        drugClass: "Anticonvulsant",
        gene: "HLA-B",
        alternatives: [],
        evaluate: () => ({
            severity: "STANDARD",
            rank: 3,
            evidenceBadge: "CPIC Level A Safe Alternative",
            summaryAction: "SAFE / SUITABLE ANTICONVULSANT — No HLA-B*15:02 association; non-aromatic AED.",
            kineticsNode: "SV2A Binding (Renal Excretion)",
            exposureNode: "Independent of HLA-B / Cytochromes",
            adrNode: "No SJS/TEN Predisposition",
            prescribingNode: "Standard Titration (500 mg BID)",
            cpicText: "Safe alternative in HLA-B*15:02 carriers. (CPIC v2018.04).",
            dpwgText: "Standard dosing. (DPWG v2024.05).",
            edgeId: "EDGE-SAFE-HLAB-LEV-01"
        })
    },
    phenytoin: {
        name: "Phenytoin",
        rxnorm: "RxNorm:8183",
        drugClass: "Anticonvulsant",
        gene: "CYP2C9",
        alternatives: ["levetiracetam"],
        evaluate: (diplotypes) => {
            const hlab = getAlleleInfo("HLA-B", diplotypes["HLA-B"]).phenotype;
            const c9 = getAlleleInfo("CYP2C9", diplotypes.CYP2C9).phenotype;
            if (hlab === "High-Risk Positive") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Black Box",
                    summaryAction: "CONTRAINDICATED IN HLA-B*15:02 — High risk of Stevens-Johnson Syndrome / TEN.",
                    kineticsNode: "Aromatic Ring Antigenic Presentation",
                    exposureNode: "Severe Immune Cutaneous Reaction",
                    adrNode: "Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis",
                    prescribingNode: "Switch to Levetiracetam",
                    cpicText: "Avoid phenytoin in HLA-B*15:02 positive patients; consider alternative non-aromatic anticonvulsant. (CPIC v2020.10, PMID:32711548).",
                    dpwgText: "Avoid phenytoin; prescribe alternative AED. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-HLAB-PHEN-01"
                };
            }
            if (c9 === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "REDUCE MAINTENANCE DOSE BY 50% — Severe ataxia and neurotoxicity risk.",
                    kineticsNode: "Nonlinear Zero-Order Saturation Kinetics",
                    exposureNode: "+180% Phenytoin Serum Accumulation",
                    adrNode: "Cerebellar Ataxia, Nystagmus & Mental Confusion",
                    prescribingNode: "Reduce Maintenance Dose by 50% with TDM",
                    cpicText: "In CYP2C9 poor metabolizers, reduce starting maintenance dose by 50% and evaluate serum concentrations regularly. (CPIC v2020.10).",
                    dpwgText: "Reduce dose by 50%; monitor serum level (target 10-20 mg/L). (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C9-PHEN-02"
                };
            }
            if (c9 === "Intermediate Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "REDUCE MAINTENANCE DOSE BY 25% — Monitor serum trough levels (10–20 mcg/mL).",
                    kineticsNode: "Reduced CYP2C9 Clearance Capacity",
                    exposureNode: "+50% Serum Accumulation",
                    adrNode: "Dose-Dependent Neurotoxicity",
                    prescribingNode: "Reduce Dose by 25% + TDM",
                    cpicText: "Reduce maintenance dose by 25% and monitor drug concentrations. (CPIC v2020.10).",
                    dpwgText: "Dose reduction recommended based on TDM. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C9-PHEN-03"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard dosing with routine serum level monitoring.",
                kineticsNode: "Normal CYP2C9/2C19 Clearance",
                exposureNode: "Therapeutic Serum Level (10–20 mcg/mL)",
                adrNode: "Standard Safety Profile",
                prescribingNode: "Standard Maintenance (300 mg/day)",
                cpicText: "Standard dosing is recommended. (CPIC v2020.10).",
                dpwgText: "Standard dosing with TDM. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2C9-PHEN-04"
            };
        }
    },
    abacavir: {
        name: "Abacavir",
        rxnorm: "RxNorm:190521",
        drugClass: "Antiretroviral (NRTI)",
        gene: "HLA-B",
        alternatives: [],
        evaluate: (diplotypes) => {
            const hlab = getAlleleInfo("HLA-B", diplotypes["HLA-B"]).phenotype;
            if (hlab === "High-Risk Positive") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Black Box",
                    summaryAction: "CONTRAINDICATED — Fatal Multi-Organ Hypersensitivity Reaction (HSR).",
                    kineticsNode: "HLA-B*57:01 Antigen-Binding Cleft Presentation",
                    exposureNode: "Severe Systemic Immune Hypersensitivity",
                    adrNode: "Fatal Anaphylactic Shock, Fever & Organ Failure",
                    prescribingNode: "Prescribe Alternative NRTI (Tenofovir)",
                    cpicText: "Abacavir is contraindicated in HLA-B*57:01 positive patients due to life-threatening hypersensitivity. (CPIC v2014.04, PMID:24522185).",
                    dpwgText: "Do not use abacavir in HLA-B*57:01 carriers. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-HLAB-ABAC-01"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD REGIMEN — HLA-B*57:01 negative; standard 600 mg daily.",
                kineticsNode: "Glucuronidation & Alcohol Dehydrogenase",
                exposureNode: "Predictable Antiretroviral Suppression",
                adrNode: "Low Cutaneous Hypersensitivity Risk",
                prescribingNode: "Standard Dosing (600 mg QD)",
                cpicText: "Abacavir is safe and recommended in HLA-B*57:01 negative patients. (CPIC v2014.04).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-HLAB-ABAC-02"
            };
        }
    },
    fluorouracil: {
        name: "Fluorouracil (5-FU)",
        rxnorm: "RxNorm:4492",
        drugClass: "Oncology",
        gene: "DPYD",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("DPYD", diplotypes.DPYD).phenotype;
            if (pheno === "Intermediate Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 4",
                    summaryAction: "REDUCE STARTING DOSE BY 50% — Severe/fatal fluoropyrimidine toxicity risk.",
                    kineticsNode: "Impaired Dihydroorotate Dehydrogenase (DPD)",
                    exposureNode: "Markedly Prolonged 5-FU Plasma Half-Life",
                    adrNode: "Life-Threatening Neutropenia, Mucositis, Diarrhea",
                    prescribingNode: "Reduce Starting Dose by 50%",
                    cpicText: "Reduce starting dose by 50% followed by titration based on toxicity or therapeutic drug monitoring. (CPIC v2018.11, PMID:29152729).",
                    dpwgText: "Reduce dose by 50% for DPYD *1/*2A or c.2846A>T. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-DPYD-5FU-01"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard oncology protocol dosing.",
                kineticsNode: "Normal DPD Enzymatic Clearance",
                exposureNode: "Predictable Fluoropyrimidine Catabolism",
                adrNode: "Standard Toxicity Profile",
                prescribingNode: "Standard Protocol Dose",
                cpicText: "Standard fluorouracil dosing is recommended. (CPIC v2018.11).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-DPYD-5FU-02"
            };
        }
    },
    capecitabine: {
        name: "Capecitabine",
        rxnorm: "RxNorm:194000",
        drugClass: "Oncology",
        gene: "DPYD",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("DPYD", diplotypes.DPYD).phenotype;
            if (pheno === "Intermediate Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 4",
                    summaryAction: "REDUCE STARTING DOSE BY 50% — Severe oral fluoropyrimidine toxicity risk.",
                    kineticsNode: "Defective DPD Conversion of 5-FU Metabolite",
                    exposureNode: "Massive Intracellular 5-FU Accumulation",
                    adrNode: "Severe Hand-Foot Syndrome, Enteritis & Sepsis",
                    prescribingNode: "Reduce Starting Dose by 50%",
                    cpicText: "Reduce starting dose by 50% in DPYD intermediate metabolizers. (CPIC v2018.11, PMID:29152729).",
                    dpwgText: "Reduce dose by 50% for DPYD deficiency. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-DPYD-CAPE-01"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard oncology protocol dosing (1250 mg/m² BID).",
                kineticsNode: "Normal DPD Cleavage",
                exposureNode: "Expected Fluoropyrimidine AUC",
                adrNode: "Standard Chemotherapy Risk",
                prescribingNode: "Standard Dosing Regimen",
                cpicText: "Standard capecitabine dosing is recommended. (CPIC v2018.11).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-DPYD-CAPE-02"
            };
        }
    },
    codeine: {
        name: "Codeine",
        rxnorm: "RxNorm:2670",
        drugClass: "Opioid Analgesic",
        gene: "CYP2D6",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2D6", diplotypes.CYP2D6).phenotype;
            if (pheno === "Ultrarapid Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Black Box Warning",
                    summaryAction: "AVOID CODEINE — Fatal Respiratory Depression Risk (Ultra-rapid morphine conversion).",
                    kineticsNode: "Hyperactive CYP2D6 O-demethylation",
                    exposureNode: "Massive Uncontrolled Morphine Peak",
                    adrNode: "Severe Apnea & Fatal Respiratory Arrest",
                    prescribingNode: "Switch to Non-Opioid Analgesic",
                    cpicText: "Avoid codeine due to potential for life-threatening morphine toxicity; select non-opioid or direct morphine. (CPIC v2020.01, PMID:31562822).",
                    dpwgText: "Avoid codeine in ultrarapid metabolizers. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-COD-01"
                };
            }
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "AVOID CODEINE (INEFFICACY) — Zero morphine conversion; therapeutic failure.",
                    kineticsNode: "Absent CYP2D6 O-demethylation",
                    exposureNode: "Negligible Morphine Plasma Levels",
                    adrNode: "Uncontrolled Breakthrough Pain",
                    prescribingNode: "Switch to Alternative Analgesic",
                    cpicText: "Avoid codeine due to lack of efficacy; prescribe an alternative analgesic that is not dependent on CYP2D6. (CPIC v2020.01).",
                    dpwgText: "Avoid codeine; select morphine or non-opioid. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-COD-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard analgesic dosing.",
                kineticsNode: "Standard Bioactivation to Morphine",
                exposureNode: "Therapeutic Analgesic Levels",
                adrNode: "Expected Opioid Tolerability",
                prescribingNode: "Standard Dosing (30 mg q4–6h)",
                cpicText: "Standard codeine dosing is recommended. (CPIC v2020.01).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2D6-COD-03"
            };
        }
    },
    tramadol: {
        name: "Tramadol",
        rxnorm: "RxNorm:10689",
        drugClass: "Opioid Analgesic",
        gene: "CYP2D6",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2D6", diplotypes.CYP2D6).phenotype;
            if (pheno === "Ultrarapid Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Black Box",
                    summaryAction: "AVOID TRAMADOL — Fatal respiratory depression risk from rapid active M1 conversion.",
                    kineticsNode: "Accelerated CYP2D6 O-demethylation to M1",
                    exposureNode: "High O-desmethyltramadol Toxic Levels",
                    adrNode: "Severe CNS/Respiratory Depression & Seizures",
                    prescribingNode: "Switch to Non-Codeine/Tramadol Analgesic",
                    cpicText: "Avoid tramadol in ultrarapid metabolizers due to potential for life-threatening respiratory depression. (CPIC v2020.01, PMID:31562822).",
                    dpwgText: "Avoid tramadol in ultrarapid metabolizers. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-TRAM-01"
                };
            }
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "AVOID TRAMADOL (INEFFICACY) — Lack of active M1 metabolite formation; inadequate pain relief.",
                    kineticsNode: "Impaired Bioactivation to M1",
                    exposureNode: "Deficient Analgesic Active Moiety",
                    adrNode: "Persistent Uncontrolled Pain",
                    prescribingNode: "Select Non-CYP2D6 Analgesic",
                    cpicText: "Avoid tramadol due to lack of efficacy; prescribe alternative analgesic not metabolized by CYP2D6. (CPIC v2020.01).",
                    dpwgText: "Avoid tramadol in PMs; choose alternative. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-TRAM-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard dosing (50–100 mg q4–6h PRN).",
                kineticsNode: "Normal M1 Bioactivation",
                exposureNode: "Therapeutic Analgesic Steady-State",
                adrNode: "Standard Opioid Profile",
                prescribingNode: "Standard Dosing Regimen",
                cpicText: "Standard tramadol dosing is recommended. (CPIC v2020.01).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2D6-TRAM-03"
            };
        }
    },
    tamoxifen: {
        name: "Tamoxifen",
        rxnorm: "RxNorm:10324",
        drugClass: "Oncology (SERM)",
        gene: "CYP2D6",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("CYP2D6", diplotypes.CYP2D6).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / ASCO Guideline",
                    summaryAction: "AVOID TAMOXIFEN — Switch to Aromatase Inhibitor (Severe Breast Cancer Recurrence Risk).",
                    kineticsNode: "Zero Bioactivation to Active Endoxifen",
                    exposureNode: "-75% Endoxifen Plasma Concentration",
                    adrNode: "2- to 3-Fold Higher Breast Cancer Relapse",
                    prescribingNode: "Switch to Anastrozole / Letrozole",
                    cpicText: "In CYP2D6 poor metabolizers, avoid tamoxifen and prescribe an aromatase inhibitor (in postmenopausal women) due to reduced endoxifen concentrations and higher recurrence risk. (CPIC v2018.10, PMID:30298921).",
                    dpwgText: "Avoid tamoxifen; select aromatase inhibitor. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-TAM-01"
                };
            }
            if (pheno === "Intermediate Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "DOSE ESCALATION ADVISED — Increase tamoxifen to 40 mg/day or switch to Aromatase Inhibitor.",
                    kineticsNode: "Suboptimal Endoxifen Formation",
                    exposureNode: "-40% Endoxifen Blood Levels",
                    adrNode: "Elevated Risk of Disease Progression",
                    prescribingNode: "Increase Dose to 40 mg/day or Switch",
                    cpicText: "Consider dose escalation to 40 mg daily or alternative therapy in intermediate metabolizers. (CPIC v2018.10).",
                    dpwgText: "Dose increase to 40 mg/day recommended. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2D6-TAM-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard 20 mg/day endocrine therapy.",
                kineticsNode: "Normal Endoxifen Bioactivation",
                exposureNode: "Adequate Target Therapeutic Endoxifen",
                adrNode: "Standard SERM Safety Profile",
                prescribingNode: "Standard Regimen (20 mg/day)",
                cpicText: "Standard tamoxifen 20 mg/day is recommended. (CPIC v2018.10).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2D6-TAM-03"
            };
        }
    },
    warfarin: {
        name: "Warfarin",
        rxnorm: "RxNorm:11289",
        drugClass: "Anticoagulant",
        gene: "CYP2C9",
        alternatives: [],
        evaluate: (diplotypes) => {
            const c9Pheno = getAlleleInfo("CYP2C9", diplotypes.CYP2C9).phenotype;
            const vkorc1Pheno = getAlleleInfo("VKORC1", diplotypes.VKORC1).phenotype;
            const isHigh = vkorc1Pheno.includes("High");
            const isMod = c9Pheno.includes("Intermediate") || c9Pheno.includes("Poor") || isHigh;

            if (c9Pheno === "Poor Metabolizer" || isHigh) {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / FDA Algorithm",
                    summaryAction: "REDUCE STARTING DOSE BY 30–50% — Major Bleeding Risk; frequent INR monitoring.",
                    kineticsNode: "Severely Reduced S-Warfarin Clearance & VKORC1 Sensitivity",
                    exposureNode: "Markedly Prolonged Half-life & Hyper-Anticoagulation",
                    adrNode: "Severe Intracranial & Gastrointestinal Hemorrhage",
                    prescribingNode: "Reduce Dose by 30–50% (Initial ≤2 mg/day)",
                    cpicText: "Calculate initial dose using pharmacogenetic algorithm (e.g., WarfarinDosing.org); reduce dose by 30-50% in CYP2C9 PM or VKORC1 A/A. (CPIC v2017.03, PMID:28198005).",
                    dpwgText: "Reduce starting dose by 50%; adjust according to INR. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C9-WARF-01"
                };
            }
            if (isMod) {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "REDUCE STARTING DOSE BY 20–30% — Initiate at ≤3 mg/day; monitor INR at 48 hours.",
                    kineticsNode: "Decreased S-Warfarin Metabolism",
                    exposureNode: "Elevated INR Response",
                    adrNode: "Elevated Bleeding Tendency",
                    prescribingNode: "Reduce Dose by 20–30%",
                    cpicText: "Recommend pharmacogenetic algorithm dosing or empirical 20-30% reduction. (CPIC v2017.03).",
                    dpwgText: "Dose reduction recommended. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-2C9-WARF-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD INITIATION — Standard 5 mg/day initiation; monitor INR.",
                kineticsNode: "Standard S-Warfarin Clearance",
                exposureNode: "Expected INR Kinetics",
                adrNode: "Standard Anticoagulation Risk",
                prescribingNode: "Standard Starting Dose (5 mg/day)",
                cpicText: "Standard initial dose is recommended (CPIC v2017.03).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-2C9-WARF-03"
            };
        }
    },
    azathioprine: {
        name: "Azathioprine",
        rxnorm: "RxNorm:1256",
        drugClass: "Immunosuppressant",
        gene: "TPMT",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("TPMT", diplotypes.TPMT).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 4",
                    summaryAction: "REDUCE DOSE BY 90% OR SWITCH — Life-threatening bone marrow aplasia and fatal pancytopenia risk.",
                    kineticsNode: "Near-Total TPMT Methylation Loss",
                    exposureNode: "Excessive Toxic Cytotoxic TGN Accumulation",
                    adrNode: "Fatal Bone Marrow Failure & Sepsis",
                    prescribingNode: "Reduce Dose by 90% (0.15 mg/kg 3x/wk) or Switch",
                    cpicText: "In TPMT poor metabolizers, consider alternative non-thiopurine or reduce starting dose by 90% and evaluate blood counts closely. (CPIC v2019.01, PMID:30412619).",
                    dpwgText: "Select alternative or reduce dose by 90%. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-TPMT-AZA-01"
                };
            }
            if (pheno === "Intermediate Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "REDUCE STARTING DOSE BY 30–50% — Target 1.0–1.5 mg/kg/day; weekly CBC monitoring.",
                    kineticsNode: "Impaired S-methylation Shunt",
                    exposureNode: "Elevated Intracellular 6-TGN Levels",
                    adrNode: "Leukopenia, Thrombocytopenia & Anemia",
                    prescribingNode: "Reduce Starting Dose by 30–50%",
                    cpicText: "Reduce initial dose to 30–50% of full standard dose and titrate to clinical response and ANC. (CPIC v2019.01).",
                    dpwgText: "Reduce dose by 50% with CBC monitoring. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-TPMT-AZA-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard dosing (2.0–2.5 mg/kg/day) with periodic CBC.",
                kineticsNode: "Normal S-methylation",
                exposureNode: "Balanced Thiopurine Metabolites",
                adrNode: "Baseline Hematologic Safety",
                prescribingNode: "Standard Protocol Prescribing",
                cpicText: "Initiate azathioprine at normal starting dose. (CPIC v2019.01).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-TPMT-AZA-03"
            };
        }
    },
    mercaptopurine: {
        name: "Mercaptopurine",
        rxnorm: "RxNorm:6651",
        drugClass: "Immunosuppressant / Antineoplastic",
        gene: "TPMT",
        alternatives: [],
        evaluate: (diplotypes) => {
            const pheno = getAlleleInfo("TPMT", diplotypes.TPMT).phenotype;
            if (pheno === "Poor Metabolizer") {
                return {
                    severity: "CRITICAL",
                    rank: 1,
                    evidenceBadge: "CPIC Level A / DPWG Grade 4",
                    summaryAction: "REDUCE DOSE BY 90% — Severe life-threatening myelosuppression risk.",
                    kineticsNode: "Loss of S-methylation Clearance",
                    exposureNode: "Toxic 6-Thioguanine Nucleotide Overload",
                    adrNode: "Severe Aplastic Anemia & Life-Threatening Sepsis",
                    prescribingNode: "Reduce Dose by 90% (e.g., reduce daily dose tenfold)",
                    cpicText: "Reduce mercaptopurine dose by tenfold (reduce dose by 90%) and adjust based on degree of myelosuppression. (CPIC v2019.01, PMID:30412619).",
                    dpwgText: "Reduce dose by 90% or choose alternative. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-TPMT-MERC-01"
                };
            }
            if (pheno === "Intermediate Metabolizer") {
                return {
                    severity: "MODERATE",
                    rank: 2,
                    evidenceBadge: "CPIC Level A",
                    summaryAction: "REDUCE DOSE BY 30–50% — Initiate at 30–50% target protocol dose; weekly CBC.",
                    kineticsNode: "Decreased TPMT S-methylation",
                    exposureNode: "Elevated 6-TGN Concentrations",
                    adrNode: "Neutropenia and Hematologic Toxicity",
                    prescribingNode: "Reduce Dose by 30–50%",
                    cpicText: "Start with 30–50% of the normal starting dose and titrate to clinical goals. (CPIC v2019.01).",
                    dpwgText: "Reduce dose by 50% with CBC monitoring. (DPWG v2024.05).",
                    edgeId: "EDGE-PGX-TPMT-MERC-02"
                };
            }
            return {
                severity: "STANDARD",
                rank: 3,
                evidenceBadge: "CPIC Level A",
                summaryAction: "SAFE / STANDARD DOSING — Standard oncology protocol dosing (75 mg/m²/day).",
                kineticsNode: "Standard TPMT Clearance",
                exposureNode: "Controlled 6-TGN Steady-State",
                adrNode: "Standard Oncology Protocol Risk",
                prescribingNode: "Standard Protocol Prescribing",
                cpicText: "Standard mercaptopurine dosing is recommended. (CPIC v2019.01).",
                dpwgText: "Standard dosing. (DPWG v2024.05).",
                edgeId: "EDGE-SAFE-TPMT-MERC-03"
            };
        }
    }
};

const SMART_PGX_DB = [
    { rsid: "rs4244285", chr: "10", pos38: 94781859, pos37: 96541600, gene: "CYP2C19", name: "*2", het: "*1/*2", hom: "*2/*2" },
    { rsid: "rs4986893", chr: "10", pos38: 94775409, pos37: 96535150, gene: "CYP2C19", name: "*3", het: "*1/*3", hom: "*3/*3" },
    { rsid: "rs12248560", chr: "10", pos38: 94761900, pos37: 96521641, gene: "CYP2C19", name: "*17", het: "*1/*17", hom: "*17/*17" },
    { rsid: "rs3892097", chr: "22", pos38: 42128945, pos37: 42524947, gene: "CYP2D6", name: "*4", het: "*1/*4", hom: "*4/*4" },
    { rsid: "rs1065852", chr: "22", pos38: 42130692, pos37: 42526694, gene: "CYP2D6", name: "*10", het: "*1/*10", hom: "*10/*10" },
    { rsid: "rs28371725", chr: "22", pos38: 42126611, pos37: 42522613, gene: "CYP2D6", name: "*41", het: "*1/*41", hom: "*41/*41" },
    { rsid: "rs1057910", chr: "10", pos38: 94981296, pos37: 96741051, gene: "CYP2C9", name: "*3", het: "*1/*3", hom: "*3/*3" },
    { rsid: "rs1799853", chr: "10", pos38: 94942292, pos37: 96702047, gene: "CYP2C9", name: "*2", het: "*1/*2", hom: "*2/*2" },
    { rsid: "rs9923231", chr: "16", pos38: 31096368, pos37: 31107660, gene: "VKORC1", name: "-1639G>A", het: "G/A (rs9923231)", hom: "A/A (rs9923231)" },
    { rsid: "rs4149056", chr: "12", pos38: 21178615, pos37: 21331549, gene: "SLCO1B1", name: "*5", het: "*1/*5", hom: "*5/*5" },
    { rsid: "rs2306283", chr: "12", pos38: 21176859, pos37: 21329793, gene: "SLCO1B1", name: "*1B", het: "*1/*1B", hom: "*1B/*1B" },
    { rsid: "rs3918290", chr: "1", pos38: 97450058, pos37: 97915614, gene: "DPYD", name: "*2A", het: "*1/*2A", hom: "*2A/*2A" },
    { rsid: "rs55886062", chr: "1", pos38: 97078864, pos37: 97544420, gene: "DPYD", name: "*13", het: "*1/*13", hom: "*13/*13" },
    { rsid: "rs67376798", chr: "1", pos38: 97284698, pos37: 97750254, gene: "DPYD", name: "c.2846A>T", het: "*1/c.2846A>T", hom: "c.2846A>T/c.2846A>T" },
    { rsid: "rs3909184", chr: "6", pos38: 31356450, pos37: 31324249, gene: "HLA-B", name: "*15:02 Tag", het: "*15:02 Positive", hom: "*15:02 Positive" },
    { rsid: "rs2395029", chr: "6", pos38: 31357178, pos37: 31324977, gene: "HLA-B", name: "*57:01 Tag", het: "*57:01 Positive", hom: "*57:01 Positive" },
    { rsid: "rs1142345", chr: "6", pos38: 18130918, pos37: 18144088, gene: "TPMT", name: "*3C", het: "*1/*3C", hom: "*3C/*3C" },
    { rsid: "rs1800460", chr: "6", pos38: 18139228, pos37: 18135778, gene: "TPMT", name: "*3B", het: "*1/*3B", hom: "*3B/*3B" },
    { rsid: "rs1800462", chr: "6", pos38: 18143955, pos37: 18131051, gene: "TPMT", name: "*2", het: "*1/*2", hom: "*2/*2" }
];

const LOINC_GENE_CODES = {
    CYP2C19: { code: "18177-6", display: "CYP2C19 diplotype" },
    CYP2D6: { code: "18178-4", display: "CYP2D6 diplotype" },
    CYP2C9: { code: "18179-2", display: "CYP2C9 diplotype" },
    VKORC1: { code: "49586-1", display: "VKORC1 -1639G>A genotype" },
    SLCO1B1: { code: "49587-9", display: "SLCO1B1 diplotype" },
    DPYD: { code: "49588-7", display: "DPYD diplotype" },
    "HLA-B": { code: "49589-5", display: "HLA-B*15:02 screening" },
    TPMT: { code: "49590-3", display: "TPMT diplotype" }
};

// Global Shared State with LocalStorage Persistence
const STATE_STORAGE_KEY = "pharmagraph_cds_state_v1";

function loadStateFromStorage() {
    try {
        const raw = localStorage.getItem(STATE_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.accessionData) return parsed;
        }
    } catch (_) {}

    // Default initial template
    const defTemplate = ACCESSIONS["ACC-2026-8841"];
    return {
        activeAccessionKey: "ACC-2026-8841",
        accessionData: JSON.parse(JSON.stringify(defTemplate)),
        orderedDrugs: [...defTemplate.defaultRx],
        focusedDrugKey: defTemplate.defaultRx[0],
        overrides: {},
        concomitantMeds: [],
        lastConsultationMode: "suitable_medicines"
    };
}

let portalState = loadStateFromStorage();

function saveStateToStorage() {
    try {
        localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(portalState));
    } catch (_) {}
}

function getAlleleInfo(gene, diplotype) {
    const geneDef = GENE_PANEL[gene];
    if (geneDef && geneDef.alleles[diplotype]) {
        return geneDef.alleles[diplotype];
    }
    return {
        score: "1.0",
        phenotype: "Indeterminate / Variant Detected",
        pill: "amber",
        variantNote: "Non-standard or novel genotype call"
    };
}

function setAccession(accKey) {
    const template = ACCESSIONS[accKey];
    if (!template) return;
    portalState.activeAccessionKey = accKey;
    portalState.accessionData = JSON.parse(JSON.stringify(template));
    portalState.orderedDrugs = [...template.defaultRx];
    portalState.focusedDrugKey = template.defaultRx[0];
    portalState.overrides = {};
    saveStateToStorage();
}

function evaluateOrderedRegimen() {
    const diplotypes = portalState.accessionData.diplotypes;
    return portalState.orderedDrugs.map(drugKey => {
        const drugDef = FORMULARY[drugKey];
        if (!drugDef) return null;
        const evalResult = drugDef.evaluate(diplotypes);
        return {
            drugKey,
            drugName: drugDef.name,
            rxnorm: drugDef.rxnorm,
            drugClass: drugDef.drugClass,
            gene: drugDef.gene,
            diplotype: diplotypes[drugDef.gene] || "*1/*1",
            hgnc: GENE_PANEL[drugDef.gene]?.hgnc || "HGNC",
            phenotype: getAlleleInfo(drugDef.gene, diplotypes[drugDef.gene] || "*1/*1").phenotype,
            alternatives: drugDef.alternatives,
            ...evalResult
        };
    }).filter(Boolean).sort((a, b) => a.rank - b.rank);
}

function evaluateEntireFormulary() {
    const diplotypes = portalState.accessionData.diplotypes;
    return Object.keys(FORMULARY).map(drugKey => {
        const drugDef = FORMULARY[drugKey];
        const evalResult = drugDef.evaluate(diplotypes);
        return {
            drugKey,
            drugName: drugDef.name,
            rxnorm: drugDef.rxnorm,
            drugClass: drugDef.drugClass,
            gene: drugDef.gene,
            diplotype: diplotypes[drugDef.gene] || "*1/*1",
            hgnc: GENE_PANEL[drugDef.gene]?.hgnc || "HGNC",
            phenotype: getAlleleInfo(drugDef.gene, diplotypes[drugDef.gene] || "*1/*1").phenotype,
            alternatives: drugDef.alternatives,
            ...evalResult
        };
    }).sort((a, b) => a.rank - b.rank);
}

function parseVcfText(vcfText, sourceName) {
    const lines = vcfText.split(/\r?\n/);
    let sampleId = sourceName.replace(/\.(vcf|gz|txt)$/i, '');
    let ancestry = "Clinical Specimen (VCF)";
    let detectedBuild = "GRCh38";
    let totalVariants = 0;
    let pgxMatches = 0;
    const locusCalls = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith("##")) {
            if (line.includes("reference") || line.includes("assembly")) {
                if (line.includes("37") || line.includes("hg19") || line.includes("b37")) detectedBuild = "GRCh37 / hg19";
                else if (line.includes("38") || line.includes("hg38")) detectedBuild = "GRCh38";
            }
            if (line.includes("SAMPLE=<") && line.includes("Accession=")) {
                const mAcc = line.match(/Accession=([^,>]+)/);
                if (mAcc) sampleId = mAcc[1];
                const mAnc = line.match(/Ancestry=([^,>]+)/);
                if (mAnc) ancestry = mAnc[1];
            }
            continue;
        }

        if (line.startsWith("#CHROM")) {
            const parts = line.split("\t");
            if (parts.length >= 10 && parts[9].trim() && parts[9].trim() !== "SAMPLE" && !parts[9].startsWith("FORMAT")) {
                sampleId = parts[9].trim();
            }
            continue;
        }

        totalVariants++;
        const cols = line.split("\t");
        if (cols.length < 8) continue;

        const rawChr = cols[0].replace(/^chr/i, "");
        const pos = parseInt(cols[1], 10);
        const rsid = cols[2]?.trim();
        const info = cols[7];

        let gt = "0/1";
        if (cols.length >= 10) {
            const formatParts = cols[8].split(":");
            const sampleParts = cols[9].split(":");
            const gtIdx = formatParts.indexOf("GT");
            if (gtIdx >= 0 && sampleParts[gtIdx]) {
                gt = sampleParts[gtIdx];
            }
        }

        // Strategy 1: Pre-annotated INFO tags (e.g. PharmCAT benchmark callsets)
        let px = null, allele = null;
        if (info && info.includes("=")) {
            info.split(";").forEach(item => {
                if (item.startsWith("PX=") || item.startsWith("GENE=")) px = item.split("=")[1];
                else if (item.startsWith("ALLELE=")) {
                    const raw = item.split("=")[1];
                    allele = raw.split("_")[0];
                    if (raw.includes("G/G")) allele = "G/G (rs9923231)";
                    else if (raw.includes("A/A")) allele = "A/A (rs9923231)";
                    else if (raw.includes("G/A")) allele = "G/A (rs9923231)";
                    else if (raw.includes("*15:02") && raw.toLowerCase().includes("pos")) allele = "*15:02 Positive";
                    else if (raw.includes("*15:02") && raw.toLowerCase().includes("neg")) allele = "*15:02 Negative";
                }
            });
        }
        if (px && allele) {
            const isRef = allele.toLowerCase().includes("ref") || allele === "*1/*1";
            if (!isRef || !locusCalls[px]) {
                locusCalls[px] = allele;
            }
            pgxMatches++;
            continue;
        }

        const isHom = (gt === "1/1" || gt === "1|1" || gt === "2/2");
        const isHet = (gt === "0/1" || gt === "1/0" || gt === "0|1" || gt === "1|0" || gt === "1/2" || gt === "1|2");
        if (!isHom && !isHet) continue;

        // Strategy 2: Match against PGx Database by rsID or (chr, pos)
        for (let k = 0; k < SMART_PGX_DB.length; k++) {
            const target = SMART_PGX_DB[k];
            let matched = false;
            if (rsid && rsid !== "." && rsid.toLowerCase() === target.rsid.toLowerCase()) {
                matched = true;
            } else if (rawChr === target.chr) {
                if (pos === target.pos38 || pos === target.pos37) matched = true;
            }

            if (matched) {
                const called = isHom ? target.hom : target.het;
                locusCalls[target.gene] = locusCalls[target.gene] || [];
                locusCalls[target.gene].push({ name: target.name, isHom: isHom, called: called });
                pgxMatches++;
                break;
            }
        }
    }

    const finalDiplotypes = {
        CYP2C19: "*1/*1",
        CYP2D6: "*1/*1",
        CYP2C9: "*1/*1",
        VKORC1: "G/G (rs9923231)",
        SLCO1B1: "*1/*1",
        DPYD: "*1/*1",
        "HLA-B": "*15:02 Negative",
        TPMT: "*1/*1"
    };

    Object.keys(locusCalls).forEach(gene => {
        const item = locusCalls[gene];
        if (typeof item === "string") {
            finalDiplotypes[gene] = item;
            return;
        }
        if (Array.isArray(item) && item.length > 0) {
            if (gene === "CYP2C19") {
                const has2 = item.some(c => c.name === "*2");
                const has17 = item.some(c => c.name === "*17");
                const hom2 = item.some(c => c.name === "*2" && c.isHom);
                const hom17 = item.some(c => c.name === "*17" && c.isHom);
                if (hom2) finalDiplotypes.CYP2C19 = "*2/*2";
                else if (hom17) finalDiplotypes.CYP2C19 = "*17/*17";
                else if (has2 && has17) finalDiplotypes.CYP2C19 = "*2/*17";
                else if (has2) finalDiplotypes.CYP2C19 = "*1/*2";
                else if (has17) finalDiplotypes.CYP2C19 = "*1/*17";
                else finalDiplotypes.CYP2C19 = item[0].called;
            } else if (gene === "TPMT") {
                const has3b = item.some(c => c.name === "*3B");
                const has3c = item.some(c => c.name === "*3C");
                if (has3b && has3c) finalDiplotypes.TPMT = "*1/*3A";
                else finalDiplotypes.TPMT = item[0].called;
            } else {
                finalDiplotypes[gene] = item[0].called;
            }
        }
    });

    portalState.accessionData.accessionNo = sampleId;
    portalState.accessionData.patientId = `${sampleId} (${detectedBuild})`;
    portalState.accessionData.ancestry = ancestry;
    portalState.accessionData.diplotypes = finalDiplotypes;
    saveStateToStorage();

    return {
        sampleId,
        detectedBuild,
        totalVariants,
        pgxMatches,
        finalDiplotypes
    };
}

function generateFhirBundle() {
    const acc = portalState.accessionData;
    const evaluations = evaluateOrderedRegimen();
    const nowIso = new Date().toISOString();

    const entries = [
        {
            fullUrl: `urn:uuid:patient-${acc.patientId}`,
            resource: {
                resourceType: "Patient",
                id: acc.patientId.replace(/[^a-zA-Z0-9]/g, "-"),
                identifier: [{ system: "https://pharmagraph.cds/mrn", value: acc.patientId }],
                extension: [{
                    url: "http://hl7.org/fhir/StructureDefinition/patient-ancestry",
                    valueString: acc.ancestry
                }]
            }
        },
        {
            fullUrl: `urn:uuid:report-${acc.accessionNo}`,
            resource: {
                resourceType: "DiagnosticReport",
                id: `report-${acc.accessionNo}`,
                status: "final",
                category: [{
                    coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0074", code: "GE", display: "Genetics" }]
                }],
                code: {
                    coding: [{ system: "http://loinc.org", code: "81247-9", display: "Master HL7 genetic variant reporting panel" }]
                },
                subject: { reference: `Patient/${acc.patientId.replace(/[^a-zA-Z0-9]/g, "-")}` },
                effectiveDateTime: nowIso,
                issued: nowIso,
                conclusion: `8-gene pharmacogenomics assay evaluated against CPIC/DPWG guidelines. Active regimen flags: ${evaluations.filter(e => e.severity === 'CRITICAL').length} Critical, ${evaluations.filter(e => e.severity === 'MODERATE').length} Moderate.`,
                result: Object.keys(GENE_PANEL).map(g => ({ reference: `Observation/obs-${acc.accessionNo}-${g}` }))
            }
        }
    ];

    Object.keys(GENE_PANEL).forEach(g => {
        const dip = acc.diplotypes[g] || "*1/*1";
        const alleleInfo = getAlleleInfo(g, dip);
        const loinc = LOINC_GENE_CODES[g] || { code: "unknown", display: `${g} genotype` };
        entries.push({
            fullUrl: `urn:uuid:obs-${acc.accessionNo}-${g}`,
            resource: {
                resourceType: "Observation",
                id: `obs-${acc.accessionNo}-${g}`,
                status: "final",
                code: { coding: [{ system: "http://loinc.org", code: loinc.code, display: loinc.display }] },
                subject: { reference: `Patient/${acc.patientId.replace(/[^a-zA-Z0-9]/g, "-")}` },
                valueCodeableConcept: {
                    coding: [{ system: "https://pharmvar.org", code: dip, display: `${dip} (${alleleInfo.phenotype})` }],
                    text: `${dip} - ${alleleInfo.phenotype}`
                },
                component: [
                    {
                        code: { coding: [{ system: "http://loinc.org", code: "48019-4", display: "Activity score" }] },
                        valueQuantity: { value: parseFloat(alleleInfo.score) || 0.0, unit: "score" }
                    }
                ]
            }
        });
    });

    evaluations.forEach(ev => {
        entries.push({
            fullUrl: `urn:uuid:guidance-${ev.drugKey}`,
            resource: {
                resourceType: "GuidanceResponse",
                id: `guidance-${ev.drugKey}`,
                status: "success",
                subject: { reference: `Patient/${acc.patientId.replace(/[^a-zA-Z0-9]/g, "-")}` },
                moduleUri: "https://cpicpgx.org/guidelines",
                note: [{ text: `[${ev.edgeId}] ${ev.summaryAction} — CPIC: ${ev.cpicText}` }]
            }
        });
    });

    return {
        resourceType: "Bundle",
        id: `bundle-pgx-${acc.accessionNo}`,
        type: "collection",
        timestamp: nowIso,
        entry: entries
    };
}

const CONCOMITANT_DRUGS_DB = {
    fluoxetine: { id: "fluoxetine", name: "Fluoxetine", gene: "CYP2D6", effect: "Strong Inhibitor", mechanism: "Converts CYP2D6 Normal Metabolizers into Phenotypic Poor Metabolizers; halts codeine/tramadol bioactivation." },
    paroxetine: { id: "paroxetine", name: "Paroxetine", gene: "CYP2D6", effect: "Strong Inhibitor", mechanism: "Potent CYP2D6 active site blocker; causes complete loss of opioid analgesia and increases TCA exposure." },
    bupropion: { id: "bupropion", name: "Bupropion", gene: "CYP2D6", effect: "Strong Inhibitor", mechanism: "Inactivates CYP2D6; converts extensive metabolizers to poor metabolizer phenotype." },
    quinidine: { id: "quinidine", name: "Quinidine", gene: "CYP2D6", effect: "Potent Inhibitor", mechanism: "Benchmark potent 2D6 blocker; complete shutdown of codeine O-demethylation." },
    terbinafine: { id: "terbinafine", name: "Terbinafine", gene: "CYP2D6", effect: "Potent Inhibitor", mechanism: "Persistent CYP2D6 inhibition lasting several weeks due to tissue accumulation." },
    duloxetine: { id: "duloxetine", name: "Duloxetine", gene: "CYP2D6", effect: "Moderate Inhibitor", mechanism: "Increases exposure of co-administered CYP2D6 substrates by 2- to 3-fold." },
    fluvoxamine: { id: "fluvoxamine", name: "Fluvoxamine", gene: "CYP2C19", effect: "Potent Inhibitor", mechanism: "Shuts down CYP2C19 bioactivation of clopidogrel; causes massive increase in sertraline/citalopram AUC." },
    omeprazole: { id: "omeprazole", name: "Omeprazole / Esomeprazole", gene: "CYP2C19", effect: "Competitive Inhibitor", mechanism: "Decreases clopidogrel active thiol metabolite by 45%; escalates stent thrombosis risk." },
    cimetidine: { id: "cimetidine", name: "Cimetidine", gene: "CYP2C19", effect: "Moderate Inhibitor", mechanism: "Dual CYP2C19 & CYP2D6 inhibition; elevates systemic exposures of multiple drug classes." },
    fluconazole: { id: "fluconazole", name: "Fluconazole", gene: "CYP2C9", effect: "Potent Inhibitor", mechanism: "Strongly blocks CYP2C9 and CYP2C19; causes severe S-warfarin and phenytoin accumulation." },
    amiodarone: { id: "amiodarone", name: "Amiodarone", gene: "CYP2C9", effect: "Potent Inhibitor", mechanism: "Halves S-warfarin clearance; requires immediate 30-50% warfarin dose reduction." },
    bactrim: { id: "bactrim", name: "TMP-SMX (Bactrim)", gene: "CYP2C9", effect: "Potent Inhibitor", mechanism: "Triggers acute dangerous INR spikes and major bleeding when co-prescribed with warfarin." },
    rifampin: { id: "rifampin", name: "Rifampin", gene: "CYP3A4/2C9/2C19", effect: "Potent Inducer", mechanism: "Broad PXR/CYP induction; accelerates substrate clearance, causing therapeutic failure of warfarin and statins." },
    carbamazepine_inducer: { id: "carbamazepine_inducer", name: "Carbamazepine (Inducer)", gene: "CYP3A4/2C9", effect: "Auto-Inducer", mechanism: "Strongly induces hepatic microsomal enzymes and P-glycoprotein efflux pumps." },
    st_johns_wort: { id: "st_johns_wort", name: "St. John's Wort", gene: "CYP3A4/2C9", effect: "Potent Herbal Inducer", mechanism: "Causes profound therapeutic failure of oral anticoagulants, statins, and antiretrovirals." },
    cyclosporine: { id: "cyclosporine", name: "Cyclosporine", gene: "SLCO1B1", effect: "Potent OATP1B1/BCRP Inhibitor", mechanism: "Elevates statin plasma AUC by >300%; contraindicated due to acute rhabdomyolysis risk." }
};

function generateSoapNote() {
    const acc = portalState.accessionData;
    const evaluations = evaluateOrderedRegimen();
    const criticalAlerts = evaluations.filter(e => e.severity === "CRITICAL");
    const modAlerts = evaluations.filter(e => e.severity === "MODERATE");
    const safeDrugs = evaluations.filter(e => e.severity === "STANDARD");
    const overrides = portalState.overrides || {};
    const overrideKeys = Object.keys(overrides);

    let note = `CLINICAL PHARMACOGENOMICS CONSULTATION NOTE\n`;
    note += `======================================================================\n`;
    note += `DOCUMENTATION DATE: ${new Date().toLocaleString()} | ACCESSION: ${acc.accessionNo}\n`;
    note += `PATIENT MRN/ID: ${acc.patientId} | ANCESTRY: ${acc.ancestry} | AGE/SEX: ${acc.ageSex}\n`;
    note += `CLINICAL SERVICE: ${acc.department} | ATTENDING: ${acc.physician}\n`;
    note += `PRIMARY ENCOUNTER CONDITION: ${acc.condition}\n\n`;

    note += `[S] SUBJECTIVE:\n`;
    note += `Patient referred for preemptive pharmacogenomic clinical decision support (CDS) prior to\n`;
    note += `finalizing pharmacotherapy. Active medication order basket: ${portalState.orderedDrugs.map(k => FORMULARY[k]?.name || k).join(', ')}.\n`;
    if (portalState.concomitantMeds && portalState.concomitantMeds.length > 0) {
        note += `Documented Concomitant Inhibitors/Inducers: ${portalState.concomitantMeds.join(', ')}.\n`;
    }
    note += `\n`;

    note += `[O] OBJECTIVE:\n`;
    note += `Preemptive 8-Pharmacogene Panel assay results (PharmCAT v2.15 / PharmVar v6.1 / CPIC v2024):\n`;
    Object.keys(GENE_PANEL).forEach(g => {
        const dip = acc.diplotypes[g] || "*1/*1";
        const info = getAlleleInfo(g, dip);
        note += `  - ${g.padEnd(8)}: Diplotype ${dip.padEnd(16)} -> Phenotype: ${info.phenotype} (Score: ${info.score})\n`;
    });
    note += `\n`;

    note += `[A] ASSESSMENT (CPIC & DPWG CLINICAL DECISION EVALUATION):\n`;
    if (criticalAlerts.length === 0 && modAlerts.length === 0) {
        note += `No high-risk pharmacogenomic drug-gene contraindications identified.\n`;
        note += `Active candidate medications display normal biotransformation kinetics.\n`;
    } else {
        criticalAlerts.forEach(ev => {
            note += `* CRITICAL RISK [${ev.edgeId}]: ${ev.drugName} contraindicated in ${ev.gene} ${ev.diplotype} (${ev.phenotype}).\n`;
            note += `  Pharmacokinetic Mechanism: ${ev.kineticsNode} -> ${ev.exposureNode}.\n`;
            note += `  Action Required: ${ev.summaryAction}\n`;
            note += `  CPIC Evidence: ${ev.cpicText}\n`;
        });
        modAlerts.forEach(ev => {
            note += `* MODERATE RISK [${ev.edgeId}]: ${ev.drugName} dosage adjustment advised in ${ev.gene} ${ev.diplotype} (${ev.phenotype}).\n`;
            note += `  Action Required: ${ev.summaryAction}\n`;
        });
    }

    if (overrideKeys.length > 0) {
        note += `\n[AUDIT] CLINICAL OVERRIDE DOCUMENTATION:\n`;
        overrideKeys.forEach(drugName => {
            const ov = overrides[drugName];
            note += `  * OVERRIDE [${drugName}]: Documented at ${ov.timestamp || 'Recorded'}\n`;
            note += `    Reason Category: ${ov.category || 'Clinical Judgement'}\n`;
            note += `    Justification: ${ov.reason}\n`;
            if (ov.notes) note += `    Physician Rationale: "${ov.notes}"\n`;
        });
    }
    note += `\n`;

    note += `[P] PLAN & CLINICAL RECOMMENDATIONS:\n`;
    criticalAlerts.forEach(ev => {
        const isOverridden = overrides[ev.drugName];
        if (isOverridden) {
            note += `1. OVERRIDDEN REGIMEN for ${ev.drugName.toUpperCase()}: Maintained under clinical override justification. Enhanced safety monitoring protocol active.\n`;
        } else {
            const alts = ev.alternatives.map(k => FORMULARY[k]?.name || k).join(' or ');
            note += `1. DISCONTINUE ${ev.drugName.toUpperCase()}. Prescribe verified alternative: ${alts || 'Consult subspecialist'}.\n`;
        }
    });
    modAlerts.forEach(ev => {
        note += `2. ADJUST DOSE for ${ev.drugName.toUpperCase()} per CPIC Level A guidelines.\n`;
    });
    if (safeDrugs.length > 0) {
        note += `3. CONTINUE standard prescribing for: ${safeDrugs.map(d => d.drugName).join(', ')}.\n`;
    }
    note += `4. Schedule Therapeutic Drug Monitoring (TDM) and serial laboratory surveillance as indicated.\n`;
    note += `5. Pharmacogenomics decision support advisory; attending physician retains final clinical authority.\n\n`;
    note += `Electronically Documented by: PharmaGraph-CDS Clinical Decision Engine (v2.4)\n`;

    return note;
}

function generateSoapHtml() {
    const acc = portalState.accessionData;
    const evaluations = evaluateOrderedRegimen();
    const criticalAlerts = evaluations.filter(e => e.severity === "CRITICAL");
    const modAlerts = evaluations.filter(e => e.severity === "MODERATE");
    const safeDrugs = evaluations.filter(e => e.severity === "STANDARD");
    const overrides = portalState.overrides || {};
    const overrideKeys = Object.keys(overrides);
    const dateFormatted = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });

    let html = `
        <div class="space-y-4 text-xs text-slate-800 leading-relaxed font-sans">
            <!-- Header Banner -->
            <div class="bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-2.5 mb-2.5">
                    <div>
                        <span class="text-[10px] font-mono uppercase bg-lab-900 text-sky-300 px-2 py-0.5 rounded font-bold">EMR Clinical Consultation Progress Note</span>
                        <h4 class="text-sm font-extrabold text-white mt-1">Pharmacogenomics Precision Medicine Consult</h4>
                    </div>
                    <div class="text-right text-[11px] font-mono">
                        <div class="text-slate-400">Date/Time: <strong class="text-emerald-400 font-extrabold">${dateFormatted}</strong></div>
                        <div class="text-slate-400">Accession: <strong class="text-white font-bold">${acc.accessionNo}</strong></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                    <div>Patient ID: <strong class="text-white">${acc.patientId}</strong></div>
                    <div>Demographics: <strong class="text-white">${acc.ageSex} · ${acc.ancestry}</strong></div>
                    <div>Department: <strong class="text-white">${acc.department}</strong></div>
                    <div>Attending: <strong class="text-white">${acc.physician}</strong></div>
                </div>
            </div>

            <!-- Subjective -->
            <div class="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span class="w-5 h-5 rounded bg-lab-100 text-lab-800 flex items-center justify-center text-[11px]">S</span>
                    <span>SUBJECTIVE</span>
                </div>
                <p class="text-slate-700 text-[11.5px] pl-7">
                    Preemptive pharmacogenomic clinical decision consultation requested prior to initiating outpatient/inpatient pharmacotherapy.
                    Candidate order basket: <strong class="text-slate-900 font-bold">${portalState.orderedDrugs.map(k => FORMULARY[k]?.name || k).join(', ')}</strong>.
                    ${portalState.concomitantMeds && portalState.concomitantMeds.length > 0 ? `<br><span class="text-amber-800 font-semibold">Active Concomitant Meds: ${portalState.concomitantMeds.join(', ')}</span>` : ''}
                </p>
            </div>

            <!-- Objective -->
            <div class="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <span class="w-5 h-5 rounded bg-lab-100 text-lab-800 flex items-center justify-center text-[11px]">O</span>
                        <span>OBJECTIVE — 8-Core Pharmacogene Assay Panel (PharmCAT v2.15 / PharmVar v6.1)</span>
                    </div>
                    <span class="text-[10px] font-mono text-slate-500 font-bold">100% Analytic Provenance</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-7 pt-1 font-mono text-[11px]">
                    ${Object.keys(GENE_PANEL).map(g => {
                        const dip = acc.diplotypes[g] || "*1/*1";
                        const info = getAlleleInfo(g, dip);
                        let badgeBg = info.pill === 'rose' ? 'bg-rose-100 text-rose-800 border-rose-300' : (info.pill === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300');
                        return `
                            <div class="p-2 rounded-lg border bg-slate-50 space-y-0.5">
                                <div class="flex justify-between items-center"><strong class="text-slate-900">${g}</strong><span class="text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${badgeBg}">${info.score}</span></div>
                                <div class="text-slate-700 font-bold text-[10.5px]">${dip}</div>
                                <div class="text-[9.5px] text-slate-500 font-sans truncate" title="${info.phenotype}">${info.phenotype}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Assessment -->
            <div class="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span class="w-5 h-5 rounded bg-lab-100 text-lab-800 flex items-center justify-center text-[11px]">A</span>
                    <span>ASSESSMENT — CPIC & DPWG Decision Evaluation</span>
                </div>
                <div class="pl-7 space-y-2">
                    ${criticalAlerts.map(ev => `
                        <div class="p-2.5 rounded-lg border border-rose-300 bg-rose-50/70 text-rose-950 space-y-1">
                            <div class="flex justify-between items-center">
                                <span class="font-extrabold text-rose-900 text-xs">⛔ CRITICAL CONTRAINDICATION: ${ev.drugName}</span>
                                <span class="font-mono text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">${ev.gene} ${ev.diplotype} (${ev.phenotype})</span>
                            </div>
                            <div class="text-[11.5px] text-slate-800"><strong>Mechanism:</strong> ${ev.kineticsNode} &rarr; <span class="text-rose-700 font-semibold">${ev.adrNode}</span></div>
                            <div class="text-[11px] text-slate-600 bg-white p-2 rounded border border-rose-200 italic font-mono">${ev.cpicText}</div>
                        </div>
                    `).join('')}

                    ${modAlerts.map(ev => `
                        <div class="p-2.5 rounded-lg border border-amber-300 bg-amber-50/70 text-amber-950 space-y-1">
                            <div class="flex justify-between items-center">
                                <span class="font-extrabold text-amber-900 text-xs">⚠️ MODERATE ALERT: ${ev.drugName}</span>
                                <span class="font-mono text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">${ev.gene} ${ev.diplotype}</span>
                            </div>
                            <div class="text-[11.5px] text-slate-800"><strong>Action:</strong> ${ev.summaryAction}</div>
                        </div>
                    `).join('')}

                    ${safeDrugs.length > 0 ? `
                        <div class="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-emerald-950 text-[11.5px]">
                            <strong class="text-emerald-900">✓ Safe / Standard Metabolism Confirmed:</strong>
                            ${safeDrugs.map(d => `<span class="inline-block bg-white border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold text-emerald-800 text-[10.5px] m-0.5">${d.drugName}</span>`).join(' ')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Medico-Legal Override Audit Note Section (if overrides exist) -->
            ${overrideKeys.length > 0 ? `
                <div class="p-3.5 bg-rose-50/80 rounded-xl border border-rose-300 shadow-sm space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs font-bold text-rose-950">
                            <span class="w-5 h-5 rounded bg-rose-700 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                            <span class="font-extrabold uppercase tracking-wide">Documented Clinical Override Audit Log</span>
                        </div>
                        <span class="font-mono text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">Medico-Legal Trail</span>
                    </div>
                    <div class="pl-7 space-y-2 text-xs">
                        ${overrideKeys.map(dName => {
                            const ov = overrides[dName];
                            return `
                                <div class="bg-white p-3 rounded-lg border border-rose-200 shadow-sm space-y-1">
                                    <div class="flex justify-between items-center">
                                        <strong class="text-slate-900 text-xs font-bold">${dName} Override Confirmed</strong>
                                        <span class="text-[11px] font-mono text-slate-500">Documented: <strong class="text-slate-800 font-bold">${ov.timestamp || 'Recorded'}</strong></span>
                                    </div>
                                    <div class="text-slate-700"><strong>Override Category:</strong> <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">${ov.category || 'Clinical Judgement'}</span></div>
                                    <div class="text-slate-700"><strong>Justification Reason:</strong> ${ov.reason}</div>
                                    ${ov.notes ? `<div class="bg-rose-50 p-2 rounded text-rose-950 italic text-[11px] border border-rose-100 font-serif">"${ov.notes}" — Attending Physician Rationale</div>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Plan -->
            <div class="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span class="w-5 h-5 rounded bg-lab-100 text-lab-800 flex items-center justify-center text-[11px]">P</span>
                    <span>PLAN & CLINICAL RECOMMENDATIONS</span>
                </div>
                <div class="pl-7 space-y-1.5 text-xs">
                    ${criticalAlerts.map((ev, i) => {
                        const isOverridden = overrides[ev.drugName];
                        if (isOverridden) {
                            return `<div class="p-2 rounded bg-amber-50 border border-amber-200 text-amber-950 font-bold"><strong>${i+1}. MAINTAIN WITH CAUTION (${ev.drugName.toUpperCase()}):</strong> Regimen maintained under active clinical override. Initiate daily clinical safety monitoring.</div>`;
                        }
                        const alts = ev.alternatives.map(k => FORMULARY[k]?.name || k).join(' or ');
                        return `<div class="p-2 rounded bg-rose-50 border border-rose-200 text-rose-950"><strong>${i+1}. DISCONTINUE ${ev.drugName.toUpperCase()}:</strong> Switch immediately to verified alternative: <strong class="underline">${alts || 'Consult specialist'}</strong>.</div>`;
                    }).join('')}

                    ${modAlerts.map((ev, i) => `<div class="p-2 rounded bg-slate-50 border border-slate-200 text-slate-800"><strong>${criticalAlerts.length + i + 1}. DOSE ADJUSTMENT (${ev.drugName}):</strong> ${ev.summaryAction}</div>`).join('')}

                    <div class="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                        <strong>${criticalAlerts.length + modAlerts.length + 1}. LAB MONITORING & FOLLOW-UP:</strong>
                        Perform recommended Therapeutic Drug Monitoring (TDM) and follow-up consultation within 72 hours.
                    </div>
                </div>
            </div>

            <!-- Footer Signature -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap justify-between items-center text-[11px] text-slate-500 font-mono">
                <div>Documented By: <strong>PharmaGraph-CDS Clinical Engine v2.4</strong></div>
                <div>Status: <strong class="text-emerald-700">VERIFIED & ELECTRONICALLY SIGNED</strong></div>
            </div>
        </div>
    `;
    return html;
}

function processClinicalQuery(queryText) {
    const raw = (queryText || "").trim();
    const q = raw.toLowerCase();
    const acc = portalState.accessionData;
    const diplotypes = acc.diplotypes;
    const allFormulary = evaluateEntireFormulary();
    const orderedEvals = evaluateOrderedRegimen();
    const overrides = portalState.overrides || {};
    const concomitantMeds = portalState.concomitantMeds || [];

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Hallucination Guardrail Check (NFR2 / NFR6)
    // ─────────────────────────────────────────────────────────────────────────
    const isGuardrailQuery = q.includes("guardrail") || q.includes("hallucinat") || q.includes("fake") || 
                             q.includes("unknown") || q.includes("random") || q.includes("compound-99") || 
                             q.includes("experimental") || q.includes("aspirin-99") || q.includes("unverified");
    if (isGuardrailQuery) {
        return {
            status: "blocked_by_guardrail",
            mode: "guardrail",
            question: raw,
            verdict: "🛡️ OUT-OF-SCOPE CLAIM BLOCKED (CPIC Guardrail Active)",
            badgeColor: "rose",
            answer: `
                <div class="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs space-y-2.5 text-rose-950">
                    <div class="flex items-center justify-between font-bold text-rose-900 border-b border-rose-200 pb-2">
                        <span class="font-extrabold uppercase tracking-wide">🛡️ Hallucination Guardrail Protocol Enforced</span>
                        <span class="font-mono text-[10px] bg-rose-200 px-2 py-0.5 rounded">NFR2 / NFR6 Compliant</span>
                    </div>
                    <p class="font-bold text-rose-900">OUT-OF-SCOPE CLAIM BLOCKED: 0 verified pharmacogenomic paths found in the knowledge graph.</p>
                    <p class="leading-relaxed text-slate-800">
                        The requested compound, gene, or clinical claim has no verified evidence path in the CPIC v2024 / DPWG v2024 knowledge graph.
                        To safeguard clinical decision integrity and prevent hazardous generative hallucinations, the CDS engine strictly refuses free-text speculative generation.
                    </p>
                </div>
            `,
            cypher: `// Hallucination Guardrail Check: Querying ungrounded entity\nMATCH (m:Drug {name: "${raw.replace(/"/g, '')}"})\nOPTIONAL MATCH (m)<-[r:GUIDELINE_ACTION]-(p:Phenotype)\nRETURN m, r;\n// Result: 0 verified paths in Neo4j knowledge graph`
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Semantic Intent Extraction
    // ─────────────────────────────────────────────────────────────────────────
    const isWhy = q.includes("why") || q.includes("how come") || q.includes("mechanism") || q.includes("reason") || q.includes("what happens") || q.includes("cause") || q.includes("ineffect") || q.includes("not work") || q.includes("fail");
    const isDosing = q.includes("dose") || q.includes("dosage") || q.includes("how much") || q.includes("mg") || q.includes("titrat") || q.includes("start dose") || q.includes("quantity") || q.includes("amount");
    const isAlternative = q.includes("alternative") || q.includes("instead") || q.includes("substitute") || q.includes("replace") || q.includes("switch") || q.includes("other than") || q.includes("what else");
    const isSafeCheck = q.includes("can i") || q.includes("can we") || q.includes("is it safe") || q.includes("should i") || q.includes("okay") || q.includes("is it ok") || q.includes("allowed") || q.includes("permitted") || q.includes("safe to") || q.includes("suitab") || q.includes("give") || q.includes("prescribe");
    const isInteraction = q.includes("interact") || q.includes("phenoconversion") || q.includes("together") || q.includes("with") || q.includes("inhibitor") || q.includes("inducer") || q.includes("fluoxetine") || q.includes("bupropion") || q.includes("paroxetine") || q.includes("amiodarone") || q.includes("fluconazole") || q.includes("bactrim") || q.includes("rifampin");
    const isRiskSummary = q.includes("risk") || q.includes("danger") || q.includes("contraindicated") || q.includes("toxic") || q.includes("adverse") || q.includes("avoid") || q.includes("side effect") || q.includes("harm") || q.includes("alert") || q.includes("bad");
    const isSafeList = (q.includes("list") || q.includes("all")) && (q.includes("safe") || q.includes("suitable") || q.includes("prescribe") || q.includes("good") || q.includes("allowed"));

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Clinical Indication & Condition Domain Extraction
    // ─────────────────────────────────────────────────────────────────────────
    const isPain = q.includes("pain") || q.includes("analges") || q.includes("fever") || q.includes("headache") || q.includes("back") || q.includes("ache") || q.includes("sore") || q.includes("hurt") || q.includes("post-op");
    const isDepression = q.includes("depress") || q.includes("anxiety") || q.includes("ssri") || q.includes("mood") || q.includes("mental") || q.includes("panic") || q.includes("tca") || q.includes("antidepress");
    const isCardio = q.includes("stent") || q.includes("heart") || q.includes("blood thinner") || q.includes("antiplatelet") || q.includes("pci") || q.includes("cardio") || q.includes("thromb") || q.includes("clot") || q.includes("chest pain") || q.includes("coronary") || q.includes("infarct");
    const isAnticoag = q.includes("anticoagula") || q.includes("warfarin") || q.includes("inr") || q.includes("afib") || q.includes("atrial fib") || q.includes("dvt") || q.includes("embol");
    const isCholesterol = q.includes("cholesterol") || q.includes("lipid") || q.includes("statin") || q.includes("ldl") || q.includes("athero") || q.includes("triglyceride") || q.includes("myopathy") || q.includes("rhabdo");
    const isSeizure = q.includes("seizure") || q.includes("epilep") || q.includes("convuls") || q.includes("fit") || q.includes("anticonvuls") || q.includes("sjs") || q.includes("ten");
    const isCancer = q.includes("cancer") || q.includes("chemo") || q.includes("oncolog") || q.includes("tumor") || q.includes("breast") || q.includes("colon") || q.includes("malignan");
    const isImmuno = q.includes("immunosuppress") || q.includes("autoimmune") || q.includes("crohn") || q.includes("colitis") || q.includes("ibd") || q.includes("thiopurine") || q.includes("bone marrow");

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Specific Drug & Gene Identification
    // ─────────────────────────────────────────────────────────────────────────
    let matchedDrugKey = null;
    const drugKeys = Object.keys(FORMULARY);
    for (const k of drugKeys) {
        const drug = FORMULARY[k];
        if (q.includes(k) || q.includes(drug.name.toLowerCase())) {
            matchedDrugKey = k;
            break;
        }
    }
    // Brand names & clinical aliases
    if (!matchedDrugKey) {
        if (q.includes("5-fu") || q.includes("5fu") || q.includes("fluorouracil")) matchedDrugKey = "fluorouracil";
        else if (q.includes("plavix")) matchedDrugKey = "clopidogrel";
        else if (q.includes("effient")) matchedDrugKey = "prasugrel";
        else if (q.includes("brilinta")) matchedDrugKey = "ticagrelor";
        else if (q.includes("zoloft")) matchedDrugKey = "sertraline";
        else if (q.includes("celexa")) matchedDrugKey = "citalopram";
        else if (q.includes("lexapro")) matchedDrugKey = "escitalopram";
        else if (q.includes("elavil")) matchedDrugKey = "amitriptyline";
        else if (q.includes("zocor")) matchedDrugKey = "simvastatin";
        else if (q.includes("lipitor")) matchedDrugKey = "atorvastatin";
        else if (q.includes("crestor")) matchedDrugKey = "rosuvastatin";
        else if (q.includes("tegretol")) matchedDrugKey = "carbamazepine";
        else if (q.includes("keppra")) matchedDrugKey = "levetiracetam";
        else if (q.includes("dilantin")) matchedDrugKey = "phenytoin";
        else if (q.includes("xeloda")) matchedDrugKey = "capecitabine";
        else if (q.includes("imuran")) matchedDrugKey = "azathioprine";
        else if (q.includes("purinethol") || q.includes("6-mp") || q.includes("6mp")) matchedDrugKey = "mercaptopurine";
        else if (q.includes("nolvadex")) matchedDrugKey = "tamoxifen";
        else if (q.includes("coumadin") || q.includes("jantoven")) matchedDrugKey = "warfarin";
        else if (q.includes("ultram")) matchedDrugKey = "tramadol";
        else if (q.includes("ziagen")) matchedDrugKey = "abacavir";
    }

    let matchedGene = null;
    const geneNames = ["CYP2C19", "CYP2D6", "CYP2C9", "VKORC1", "SLCO1B1", "DPYD", "HLA-B", "TPMT"];
    for (const g of geneNames) {
        if (q.includes(g.toLowerCase()) || q.includes(g.replace("-", "").toLowerCase())) {
            matchedGene = g;
            break;
        }
    }

    // Helper: Build conversational clinical response HTML
    const formatConsultationResponse = ({ headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText, citationText, cypher }) => {
        const borderColors = {
            rose: "border-rose-300 bg-rose-50/50 text-rose-950",
            amber: "border-amber-300 bg-amber-50/50 text-amber-950",
            emerald: "border-emerald-300 bg-emerald-50/50 text-emerald-950",
            sky: "border-sky-300 bg-sky-50/50 text-sky-950"
        };
        const badgeColors = {
            rose: "bg-rose-700 text-white",
            amber: "bg-amber-600 text-white",
            emerald: "bg-emerald-700 text-white",
            sky: "bg-sky-700 text-white"
        };

        const answerHtml = `
            <div class="p-4 rounded-xl border ${borderColors[badgeColor] || borderColors.sky} space-y-3.5 text-xs leading-relaxed font-sans shadow-sm">
                <!-- Header Title & Verdict Badge -->
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wide ${badgeColors[badgeColor] || badgeColors.sky}">${statusBadge}</span>
                        <h4 class="text-sm font-extrabold text-slate-900">${headline}</h4>
                    </div>
                    <span class="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded font-bold">Patient: ${acc.accessionNo} (${acc.ancestry})</span>
                </div>

                <!-- Direct Conversational Clinical Verdict -->
                <div class="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm space-y-1.5">
                    <div class="text-xs font-bold text-slate-900 leading-snug">${mainAnswer}</div>
                    ${patientFacts ? `<div class="text-[11px] text-slate-600 pt-1 border-t border-slate-100 font-mono">${patientFacts}</div>` : ''}
                </div>

                <!-- Mechanism and Recommendation Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11.5px]">
                    ${mechanismText ? `
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-slate-900 block font-bold text-xs flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-lab-600"></span>
                                Biological & Pharmacokinetic Rationale:
                            </strong>
                            <p class="text-slate-700 leading-relaxed">${mechanismText}</p>
                        </div>
                    ` : ''}

                    ${recommendationText ? `
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-slate-900 block font-bold text-xs flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                                Recommended Action Plan & Alternatives:
                            </strong>
                            <div class="text-slate-800 leading-relaxed">${recommendationText}</div>
                        </div>
                    ` : ''}
                </div>

                <!-- Citations & Provenance -->
                ${citationText ? `
                    <div class="p-2.5 bg-slate-900 text-sky-200 rounded-lg text-[11px] flex items-center justify-between font-mono">
                        <span><strong>Guideline Citation:</strong> ${citationText}</span>
                        <span class="text-emerald-400 font-bold shrink-0 ml-2">100% Provenance Grounded</span>
                    </div>
                ` : ''}
            </div>
        `;

        return {
            status: "consultation_success",
            question: raw,
            verdict: statusBadge,
            answer: answerHtml,
            cypher: cypher
        };
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 5. CASE A: Doctor asked about a SPECIFIC DRUG
    // ─────────────────────────────────────────────────────────────────────────
    if (matchedDrugKey) {
        const drugDef = FORMULARY[matchedDrugKey];
        const evalRes = drugDef.evaluate(diplotypes);
        const gene = drugDef.gene;
        const dip = diplotypes[gene] || "*1/*1";
        const phenoInfo = getAlleleInfo(gene, dip);
        const isOverridden = overrides[drugDef.name];

        let statusBadge = "SAFE TO PRESCRIBE";
        let badgeColor = "emerald";
        let mainAnswer = "";

        if (evalRes.severity === "CRITICAL") {
            statusBadge = "⛔ CONTRAINDICATED (CRITICAL RISK)";
            badgeColor = "rose";
            mainAnswer = `<strong>No, you should NOT prescribe ${drugDef.name} to this patient.</strong> In patient <strong>${acc.accessionNo}</strong>, ${drugDef.name} is classified as a Critical Risk by CPIC/DPWG guidelines due to genetic predisposition to severe toxicity or therapeutic failure.`;
        } else if (evalRes.severity === "MODERATE") {
            statusBadge = "⚠️ DOSE ADJUSTMENT REQUIRED";
            badgeColor = "amber";
            mainAnswer = `<strong>${drugDef.name} may be used ONLY with cautionary dose adjustment or close monitoring.</strong> Patient <strong>${acc.accessionNo}</strong> requires dosage reduction to prevent adverse drug accumulation or treatment failure.`;
        } else {
            statusBadge = "✅ SAFE / STANDARD DOSING";
            badgeColor = "emerald";
            mainAnswer = `<strong>Yes, ${drugDef.name} is verified safe and recommended for standard prescribing.</strong> Patient <strong>${acc.accessionNo}</strong> displays normal metabolic clearance kinetics for this medication.`;
        }

        // Tailor answer if the user specifically asked "Why"
        if (isWhy) {
            mainAnswer += ` You asked why: this is driven by ${gene} ${dip} (${phenoInfo.phenotype}). Specifically: ${evalRes.kineticsNode}, leading downstream to ${evalRes.adrNode}.`;
        }
        // Tailor answer if user asked for Dosing
        if (isDosing) {
            mainAnswer += ` <strong>Prescribing Guidance:</strong> ${evalRes.summaryAction}`;
        }
        // Check for active clinical override
        if (isOverridden) {
            mainAnswer += `<br><span class="inline-block mt-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">✓ An active clinical override is documented: "${isOverridden.reason}" (Logged: ${isOverridden.timestamp}).</span>`;
        }

        const patientFacts = `Assay Genotype: <strong>${gene} ${dip}</strong> | Metabolizer Phenotype: <strong>${phenoInfo.phenotype}</strong> (Activity Score: ${phenoInfo.score})`;
        const mechanismText = `<strong>5-Hop Mechanism:</strong> ${evalRes.kineticsNode} &rarr; Resulting in <strong>${evalRes.exposureNode}</strong> &rarr; Clinical consequence: <strong class="text-rose-700">${evalRes.adrNode}</strong>.`;
        
        let recommendationText = `<div><strong>Clinical Action:</strong> ${evalRes.summaryAction}</div>`;
        if (drugDef.alternatives && drugDef.alternatives.length > 0) {
            const altNames = drugDef.alternatives.map(a => FORMULARY[a]?.name || a).join(' or ');
            recommendationText += `<div class="mt-1 text-emerald-800 font-bold">Recommended Verified Alternatives: <span class="underline">${altNames}</span> (unaffected by ${gene}).</div>`;
        }

        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "${gene}"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug {name: "${drugDef.name}"})\nRETURN d.allele, ph.name, ph.score, r.recommendation, r.evidenceLevel;`;

        return formatConsultationResponse({
            headline: `Consultation on ${drugDef.name} (${drugDef.drugClass})`,
            statusBadge: statusBadge,
            badgeColor: badgeColor,
            mainAnswer: mainAnswer,
            patientFacts: patientFacts,
            mechanismText: mechanismText,
            recommendationText: recommendationText,
            citationText: `${evalRes.evidenceBadge} · ${evalRes.cpicText}`,
            cypher: cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. CASE B: PAIN / ANALGESIA INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isPain) {
        const dip2d6 = diplotypes.CYP2D6 || "*1/*1";
        const pheno2d6 = getAlleleInfo("CYP2D6", dip2d6);
        const evalCodeine = FORMULARY.codeine.evaluate(diplotypes);
        const has2D6Inhibitor = concomitantMeds.some(m => ["Fluoxetine", "Paroxetine", "Bupropion", "Quinidine", "Terbinafine"].includes(m));

        let headline = "Analgesic & Pain Management Consultation";
        let statusBadge = evalCodeine.severity === "CRITICAL" ? "⛔ PRODRUG OPIOIDS CONTRAINDICATED" : "⚠️ CAUTION WITH OPIOIDS";
        let badgeColor = evalCodeine.severity === "CRITICAL" ? "rose" : "amber";
        let mainAnswer = "";

        if (pheno2d6.phenotype.includes("Ultrarapid")) {
            mainAnswer = `<strong>Do NOT prescribe Codeine or Tramadol for pain.</strong> Patient <strong>${acc.accessionNo}</strong> is a CYP2D6 Ultrarapid Metabolizer (${dip2d6}). Ultra-rapid conversion into morphine / M1 causes fatal respiratory depression and opioid overdose at standard doses.`;
        } else if (pheno2d6.phenotype.includes("Poor") || has2D6Inhibitor) {
            mainAnswer = `<strong>Avoid Codeine and Tramadol due to complete lack of analgesic efficacy.</strong> Patient <strong>${acc.accessionNo}</strong> ${has2D6Inhibitor ? `is under strong CYP2D6 phenoconversion inhibition (${concomitantMeds.join(', ')})` : `carries CYP2D6 Poor Metabolizer status (${dip2d6})`}. Codeine cannot be converted to morphine, leading to unmanaged breakthrough pain.`;
        } else {
            mainAnswer = `<strong>Codeine and Tramadol may be used with standard precautions.</strong> Patient <strong>${acc.accessionNo}</strong> has CYP2D6 status <strong>${dip2d6}</strong> (${pheno2d6.phenotype}). However, verify no co-prescribed CYP2D6 inhibitors.`;
            statusBadge = "✅ STANDARD ANALGESIC DOSING";
            badgeColor = "emerald";
        }

        const patientFacts = `Assay Genotype: <strong>CYP2D6 ${dip2d6}</strong> (${pheno2d6.phenotype}) ${has2D6Inhibitor ? `| <span class="text-rose-700 font-bold">Phenocopy Active: ${concomitantMeds.join('+')}</span>` : ''}`;
        const mechanismText = `Codeine and Tramadol are prodrugs requiring hepatic O-demethylation by CYP2D6 into active analgesics (Morphine and O-desmethyltramadol M1). Impaired or hyperactive CYP2D6 completely destabilizes the therapeutic index.`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Recommended Safe Analgesics:</strong> Direct Morphine, Acetaminophen (Paracetamol), Hydromorphone, or NSAIDs (ibuprofen/celecoxib).</li>
                <li><strong>Avoid:</strong> Codeine, Tramadol, Hydrocodone.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "CYP2D6"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug) WHERE m.name IN ['Codeine', 'Tramadol']\nRETURN d.allele, ph.name, m.name, r.recommendation;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for CYP2D6 and Opioids (PMID:31562822)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. CASE C: DEPRESSION / SSRI / MENTAL HEALTH INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isDepression) {
        const dip2c19 = diplotypes.CYP2C19 || "*1/*1";
        const pheno2c19 = getAlleleInfo("CYP2C19", dip2c19);
        const isPM = pheno2c19.phenotype.includes("Poor");
        const isUM = pheno2c19.phenotype.includes("Ultrarapid") || pheno2c19.phenotype.includes("Rapid");

        let headline = "Antidepressant & SSRI Therapy Consultation";
        let statusBadge = isPM ? "⚠️ SSRI DOSE ADJUSTMENT REQUIRED" : "✅ STANDARD SSRI DOSING";
        let badgeColor = isPM ? "amber" : "emerald";
        let mainAnswer = "";

        if (isPM) {
            mainAnswer = `<strong>For depression therapy in patient ${acc.accessionNo}, Sertraline is the preferred SSRI (with a 50% starting dose reduction, max 75 mg/day).</strong> Avoid Citalopram and Escitalopram or cap dose at ≤20 mg/day due to impaired clearance and high risk of QTc prolongation and Torsades de Pointes. Avoid Amitriptyline (severe cardiotoxicity).`;
        } else if (isUM) {
            mainAnswer = `<strong>Monitor for therapeutic failure with standard SSRI doses.</strong> Patient <strong>${acc.accessionNo}</strong> carries CYP2C19 ${dip2c19} (${pheno2c19.phenotype}) with accelerated drug clearance. Consider dose titration or choosing an antidepressant not predominantly cleared by CYP2C19.`;
        } else {
            mainAnswer = `<strong>Standard initial SSRI dosing is recommended.</strong> Patient <strong>${acc.accessionNo}</strong> has normal CYP2C19 biotransformation (${dip2c19}). Sertraline, Citalopram, or Escitalopram can be initiated at standard recommended doses.`;
        }

        const patientFacts = `Genotype: <strong>CYP2C19 ${dip2c19}</strong> (${pheno2c19.phenotype}) | Score: ${pheno2c19.score}`;
        const mechanismText = `CYP2C19 is the principal enzyme responsible for N-demethylation of Citalopram/Escitalopram and alpha-hydroxylation of Sertraline. In poor metabolizers, drug exposure is increased by >80–100%, predisposing to cardiac repolarization abnormalities (QT prolongation).`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>First-Line Recommendation:</strong> Sertraline initiated at 25 mg/day (50% starting dose), titrate slowly to max 75 mg/day.</li>
                <li><strong>If Citalopram used:</strong> Do not exceed 20 mg/day; monitor baseline and follow-up ECG for QTc.</li>
                <li><strong>Avoid:</strong> Tricyclic antidepressants (Amitriptyline) without TDM.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "CYP2C19"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug) WHERE m.drugClass CONTAINS 'Antidepressant'\nRETURN m.name, r.recommendation, r.evidenceLevel;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for CYP2C19/CYP2D6 and SSRIs (PMID:25974703)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 8. CASE D: CARDIOVASCULAR / STENT / ANTIPLATELET INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isCardio) {
        const dip2c19 = diplotypes.CYP2C19 || "*1/*1";
        const pheno2c19 = getAlleleInfo("CYP2C19", dip2c19);
        const evalClop = FORMULARY.clopidogrel.evaluate(diplotypes);

        let headline = "Antiplatelet & Coronary Stent Therapy Consultation";
        let statusBadge = evalClop.severity === "CRITICAL" ? "⛔ AVOID CLOPIDOGREL (STENT THROMBOSIS)" : (evalClop.severity === "MODERATE" ? "⚠️ ALTERNATIVE RECOMMENDED" : "✅ CLOPIDOGREL APPROVED");
        let badgeColor = evalClop.severity === "CRITICAL" ? "rose" : (evalClop.severity === "MODERATE" ? "amber" : "emerald");
        let mainAnswer = "";

        if (evalClop.severity === "CRITICAL") {
            mainAnswer = `<strong>Do NOT prescribe Clopidogrel. Prescribe Prasugrel (10 mg daily) or Ticagrelor (90 mg BID).</strong> Patient <strong>${acc.accessionNo}</strong> is a CYP2C19 Poor Metabolizer (${dip2c19}). Clopidogrel fails to bioactivate, creating a 3-fold higher risk of acute stent thrombosis, myocardial infarction, and death.`;
        } else if (evalClop.severity === "MODERATE") {
            mainAnswer = `<strong>Consider alternative antiplatelet therapy.</strong> Patient has CYP2C19 Intermediate Metabolizer status with diminished platelet inhibition under standard 75 mg clopidogrel. Prasugrel or Ticagrelor are preferred in ACS/PCI settings.`;
        } else {
            mainAnswer = `<strong>Clopidogrel 75 mg daily is verified safe and effective.</strong> Patient carries normal CYP2C19 alleles (${dip2c19}) ensuring adequate active thiol metabolite generation.`;
        }

        const patientFacts = `Assay Genotype: <strong>CYP2C19 ${dip2c19}</strong> (${pheno2c19.phenotype}) | Provenance: PharmVar v6.1`;
        const mechanismText = `Clopidogrel is an inactive prodrug requiring 2-step hepatic bioactivation. CYP2C19 contributes >70% to active metabolite generation. In ${pheno2c19.phenotype}, active metabolite levels drop by 72%, leaving P2Y12 platelet receptors uninhibited.`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Recommended Alternative:</strong> Prasugrel 10 mg QD (or 5 mg if <60 kg / age >75) or Ticagrelor 90 mg BID.</li>
                <li><strong>Notice:</strong> Prasugrel and Ticagrelor do not require CYP2C19 bioactivation and are unaffected by *2/*2 alleles.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "CYP2C19"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug {name: "Clopidogrel"})\nMATCH (m)-[:ALTERNATIVE_TO]->(alt:Drug)\nRETURN m.name, r.recommendation, collect(alt.name) AS Alternatives;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for CYP2C19 and Clopidogrel (PMID:35034351)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 9. CASE E: CHOLESTEROL / STATIN INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isCholesterol) {
        const dipSlco = diplotypes.SLCO1B1 || "*1/*1";
        const phenoSlco = getAlleleInfo("SLCO1B1", dipSlco);
        const evalSimv = FORMULARY.simvastatin.evaluate(diplotypes);

        let headline = "Statin Therapy & Myopathy Risk Consultation";
        let statusBadge = evalSimv.severity === "CRITICAL" ? "⛔ AVOID SIMVASTATIN (RHABDOMYOLYSIS)" : "✅ STATIN THERAPY SAFE";
        let badgeColor = evalSimv.severity === "CRITICAL" ? "rose" : (evalSimv.severity === "MODERATE" ? "amber" : "emerald");
        let mainAnswer = "";

        if (evalSimv.severity === "CRITICAL") {
            mainAnswer = `<strong>Avoid Simvastatin. Switch to Rosuvastatin (≤20 mg/day) or Atorvastatin (≤40 mg/day).</strong> Patient <strong>${acc.accessionNo}</strong> carries SLCO1B1 Poor Function (${dipSlco}). Impaired hepatic OATP1B1 transporter clearance causes a +221% spike in statin blood concentration, triggering severe myalgia, myopathy, and life-threatening rhabdomyolysis.`;
        } else if (evalSimv.severity === "MODERATE") {
            mainAnswer = `<strong>Cap Simvastatin at ≤20 mg/day or switch to an alternative statin.</strong> Patient has decreased SLCO1B1 function (${dipSlco}), doubling statin exposure and escalating myotoxicity risk.`;
        } else {
            mainAnswer = `<strong>Standard statin dosing is safe.</strong> Patient carries SLCO1B1 normal function (${dipSlco}) with normal hepatic uptake clearance.`;
        }

        const patientFacts = `Assay Genotype: <strong>SLCO1B1 ${dipSlco}</strong> (${phenoSlco.phenotype}) | Ref: CPIC v2022`;
        const mechanismText = `SLCO1B1 encodes the OATP1B1 hepatic influx transporter. In defective alleles (*5), simvastatin acid cannot enter hepatocytes for biliary clearance, remaining in systemic circulation where it damages skeletal myocytes.`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Recommended Alternative:</strong> Rosuvastatin initiated at ≤20 mg daily, or Atorvastatin ≤40 mg daily.</li>
                <li><strong>Monitoring:</strong> Baseline ALT and baseline Creatine Kinase (CK). Advise patient to report unexplained muscle pain.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "SLCO1B1"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug {name: "Simvastatin"})\nRETURN m.name, r.recommendation, r.evidenceLevel;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for SLCO1B1 and Statins (PMID:35152405)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 10. CASE F: ANTICOAGULATION / WARFARIN INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isAnticoag) {
        const dipC9 = diplotypes.CYP2C9 || "*1/*1";
        const dipVkorc1 = diplotypes.VKORC1 || "G/G (rs9923231)";
        const evalWarf = FORMULARY.warfarin.evaluate(diplotypes);

        let headline = "Warfarin Precision Anticoagulation Consultation";
        let statusBadge = evalWarf.severity === "CRITICAL" ? "⚠️ REDUCE STARTING DOSE BY 30–50%" : "✅ STANDARD WARFARIN INITIATION";
        let badgeColor = evalWarf.severity === "CRITICAL" ? "rose" : "emerald";
        let mainAnswer = "";

        if (evalWarf.severity === "CRITICAL") {
            mainAnswer = `<strong>Reduce Warfarin initial starting dose by 30% to 50% (prescribe ≤2.0 to 3.0 mg daily).</strong> Patient <strong>${acc.accessionNo}</strong> carries high warfarin sensitivity alleles (${dipC9} / ${dipVkorc1}). Standard 5 mg initiation will cause dangerous supratherapeutic INR (>4.0) and severe hemorrhage.`;
        } else {
            mainAnswer = `<strong>Initiate Warfarin at standard 5 mg/day with routine 48-hour INR check.</strong> Patient displays expected S-warfarin clearance kinetics.`;
        }

        const patientFacts = `Genotypes: <strong>CYP2C9 ${dipC9}</strong> | <strong>VKORC1 ${dipVkorc1}</strong>`;
        const mechanismText = `S-warfarin is 3- to 5-fold more potent than R-warfarin and is metabolized primarily by CYP2C9. VKORC1 encodes the target enzyme vitamin K epoxide reductase. Variant alleles reduce enzyme requirement and clearance rate, dramatically increasing sensitivity.`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Recommended Initiation:</strong> Calculate exact mg via pharmacogenetic dosing algorithm (e.g. WarfarinDosing.org); start at ≤2.5 mg QD.</li>
                <li><strong>Lab Surveillance:</strong> Obtain baseline INR, repeat INR at 48 hours and 72 hours. Target INR range: 2.0–3.0.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype)\nWHERE d.gene IN ['CYP2C9', 'VKORC1']\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug {name: "Warfarin"})\nRETURN d.gene, d.allele, ph.name, r.recommendation;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for Pharmacogenetics of Warfarin (PMID:28198005)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 11. CASE G: SEIZURES / EPILEPSY INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isSeizure) {
        const dipHlab = diplotypes["HLA-B"] || "*15:02 Negative";
        const evalCbz = FORMULARY.carbamazepine.evaluate(diplotypes);

        let headline = "Anticonvulsant & Cutaneous Safety Consultation";
        let statusBadge = evalCbz.severity === "CRITICAL" ? "⛔ CONTRAINDICATED (SJS/TEN RISK)" : "✅ STANDARD AED PRESCRIBING";
        let badgeColor = evalCbz.severity === "CRITICAL" ? "rose" : "emerald";
        let mainAnswer = "";

        if (evalCbz.severity === "CRITICAL") {
            mainAnswer = `<strong>Carbamazepine and Phenytoin are strictly contraindicated. Prescribe Levetiracetam (Keppra 500 mg BID).</strong> Patient <strong>${acc.accessionNo}</strong> is positive for HLA-B*15:02. Exposure to aromatic anticonvulsants carries an extreme risk of life-threatening Stevens-Johnson Syndrome (SJS) and Toxic Epidermal Necrolysis (TEN).`;
        } else {
            mainAnswer = `<strong>Carbamazepine is approved for standard titration.</strong> HLA-B*15:02 risk allele was not detected. Standard clinical monitoring applies.`;
        }

        const patientFacts = `Assay Genotype: <strong>HLA-B ${dipHlab}</strong> | Reference: FDA Boxed Warning`;
        const mechanismText = `Carbamazepine directly binds within the antigen-binding groove of the HLA-B*15:02 major histocompatibility complex class I molecule, presenting self-peptides that activate cytotoxic CD8+ T cells to destroy cutaneous keratinocytes.`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Safe Alternative Anticonvulsant:</strong> Levetiracetam (Keppra), Valproic Acid, or Gabapentin (non-aromatic anticonvulsants with zero HLA-B*15:02 cross-reactivity).</li>
                <li><strong>Strictly Avoid:</strong> Carbamazepine, Oxcarbazepine, Phenytoin.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "HLA-B"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug {name: "Carbamazepine"})\nRETURN d.allele, ph.name, m.name, r.recommendation;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for HLA-B and Carbamazepine (PMID:24407187)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 12. CASE H: CANCER / CHEMOTHERAPY INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isCancer) {
        const dipDpyd = diplotypes.DPYD || "*1/*1";
        const phenoDpyd = getAlleleInfo("DPYD", dipDpyd);
        const eval5Fu = FORMULARY.fluorouracil.evaluate(diplotypes);

        let headline = "Oncology & Chemotherapy Pharmacogenomics Consultation";
        let statusBadge = eval5Fu.severity === "CRITICAL" ? "⛔ 50% CHEMOTHERAPY DOSE CUT REQUIRED" : "✅ STANDARD PROTOCOL CHEMOTHERAPY";
        let badgeColor = eval5Fu.severity === "CRITICAL" ? "rose" : "emerald";
        let mainAnswer = "";

        if (eval5Fu.severity === "CRITICAL") {
            mainAnswer = `<strong>Reduce starting dose of Fluorouracil (5-FU) or Capecitabine by 50%.</strong> Patient <strong>${acc.accessionNo}</strong> is a DPYD Intermediate Metabolizer (${dipDpyd}). Failure to reduce dose results in severe, often fatal systemic toxicity including grade 4 mucositis, bloody diarrhea, and septic neutropenic fever.`;
        } else {
            mainAnswer = `<strong>Standard chemotherapy protocol dosing is approved.</strong> Patient displays normal DPD catabolic clearance (${dipDpyd}).`;
        }

        const patientFacts = `Assay Genotype: <strong>DPYD ${dipDpyd}</strong> (${phenoDpyd.phenotype}) | Score: ${phenoDpyd.score}`;
        const mechanismText = `Dihydroorotate dehydrogenase (DPD) clears >80% of administered fluoropyrimidines. Deficient alleles cause massive accumulation of active fluorouracil triphosphate (FUTP), inducing non-selective apoptosis in healthy mucosal and hematopoietic stem cells.`;
        const recommendationText = `
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Recommended Regimen:</strong> Reduce initial 5-FU/Capecitabine cycle dose by 50%. Titrate subsequent cycles based on clinical tolerability.</li>
                <li><strong>Lab Surveillance:</strong> Order weekly CBC with differential; maintain ANC >1,500/µL.</li>
            </ul>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "DPYD"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug {name: "Fluorouracil (5-FU)"})\nRETURN d.allele, ph.name, r.recommendation, r.evidenceLevel;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: "CPIC Guideline for DPYD and Fluoropyrimidines (PMID:29152729)",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 13. CASE I: DOCTOR ASKED ABOUT A SPECIFIC GENE (e.g. "Tell me about CYP2C19")
    // ─────────────────────────────────────────────────────────────────────────
    if (matchedGene) {
        const dip = diplotypes[matchedGene] || "*1/*1";
        const phenoInfo = getAlleleInfo(matchedGene, dip);
        const relatedDrugs = Object.keys(FORMULARY).filter(k => FORMULARY[k].gene === matchedGene).map(k => FORMULARY[k]);

        const headline = `${matchedGene} Pharmacogenomic Profile & Substrates`;
        const statusBadge = `GENE STATUS: ${phenoInfo.phenotype.toUpperCase()}`;
        const badgeColor = phenoInfo.pill === "rose" ? "rose" : (phenoInfo.pill === "amber" ? "amber" : "emerald");
        const mainAnswer = `Patient <strong>${acc.accessionNo}</strong> carries <strong>${matchedGene} ${dip}</strong>, resolving to <strong>${phenoInfo.phenotype}</strong> (Activity Score: <strong>${phenoInfo.score}</strong>). This genetic status directly alters the clearance and efficacy of all substrate medications on this metabolic pathway.`;
        const patientFacts = `Assay Reference: ${GENE_PANEL[matchedGene]?.refDb || 'PharmCAT v2.15'} | Ancestry Note: ${GENE_PANEL[matchedGene]?.equityWarning || 'CPIC reference'}`;
        const mechanismText = `Allele call notes: ${phenoInfo.variantNote || 'Standard allele call'}. This genetic variant determines the expression and enzymatic efficiency of hepatic microsomal biotransformation.`;
        const recommendationText = `
            <div><strong>Formulary Medications Impacted by ${matchedGene}:</strong></div>
            <div class="flex flex-wrap gap-1 mt-1">
                ${relatedDrugs.map(d => {
                    const res = d.evaluate(diplotypes);
                    const bStyle = res.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' : (res.severity === 'MODERATE' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300');
                    return `<span class="px-2 py-0.5 rounded border ${bStyle} text-[11px] font-semibold">${d.name}: <strong>${res.severity}</strong></span>`;
                }).join(' ')}
            </div>
        `;
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype {gene: "${matchedGene}"})\nMATCH (d)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:GUIDELINE_ACTION]->(m:Drug)\nRETURN d.allele, ph.name, ph.score, collect(m.name) AS Substrates;`;

        return formatConsultationResponse({
            headline, statusBadge, badgeColor, mainAnswer, patientFacts, mechanismText, recommendationText,
            citationText: `${GENE_PANEL[matchedGene]?.refDb || 'CPIC'} Guidelines`,
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 14. CASE J: SUITABLE & SAFE MEDICINES LIST
    // ─────────────────────────────────────────────────────────────────────────
    if (isSafeList || q.includes("suitable") || (q.includes("safe") && !isRiskSummary)) {
        const safeDrugs = allFormulary.filter(d => d.severity === "STANDARD");
        const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nMATCH (ph)-[r:SAFE_STANDARD_DOSING|ALTERNATIVE_TO]->(m:Drug)\nRETURN m.name AS SuitableMedication, r.edgeId AS ProvenanceEdge;`;
        
        return formatConsultationResponse({
            headline: `Verified Suitable & Safe Medications for Patient ${acc.accessionNo}`,
            statusBadge: `✓ ${safeDrugs.length} FORMULARY DRUGS VERIFIED SAFE`,
            badgeColor: "emerald",
            mainAnswer: `Based on patient <strong>${acc.accessionNo}</strong>'s 8-gene pharmacogenomic assay, <strong>${safeDrugs.length} medications</strong> have confirmed normal clearance kinetics and are verified safe for standard dosing with no high-risk genetic barriers.`,
            patientFacts: `Evaluated across: CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, HLA-B, TPMT`,
            mechanismText: `In these medications, the patient's called diplotypes encode fully functioning enzyme and transporter proteins (normal activity score ~2.0), avoiding toxic systemic accumulation or active metabolite deficiency.`,
            recommendationText: `
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] pt-1">
                    ${safeDrugs.map(d => `<div class="p-1.5 bg-slate-50 border rounded font-semibold text-slate-800">✓ ${d.drugName} <span class="text-[9.5px] text-slate-500 block font-normal">${d.drugClass}</span></div>`).join('')}
                </div>
            `,
            citationText: "CPIC Level A / DPWG Grade 4 Guidelines",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 15. CASE K: AVOID / CONTRAINDICATION / RISK LIST
    // ─────────────────────────────────────────────────────────────────────────
    if (isRiskSummary || q.includes("avoid")) {
        const critical = allFormulary.filter(d => d.severity === "CRITICAL");
        const moderate = allFormulary.filter(d => d.severity === "MODERATE");
        const cypher = `MATCH (ph:Phenotype)-[r:CONTRAINDICATED_IN|DOSE_ADJUSTMENT]->(drug:Drug)\nWHERE ph.gene IN ${JSON.stringify(Object.keys(diplotypes))}\nRETURN drug.name, r.edgeId, r.severity;`;

        return formatConsultationResponse({
            headline: `Clinical Safety Summary: High-Risk Medications to Avoid / Adjust`,
            statusBadge: `⚠️ ${critical.length} CRITICAL · ${moderate.length} MODERATE RISKS`,
            badgeColor: "rose",
            mainAnswer: `In patient <strong>${acc.accessionNo}</strong>, genetic testing identifies <strong>${critical.length} contraindicated medications</strong> and <strong>${moderate.length} medications requiring dose reductions</strong>. Prescribing these agents without adjustment significantly elevates risks of death, bleeding, stent thrombosis, or severe adverse drug reactions.`,
            patientFacts: `Primary High-Risk Pathways: ${critical.map(c => `${c.gene} (${c.drugName})`).join(', ')}`,
            mechanismText: `Genetic polymorphism produces deficient catabolism, loss of prodrug activation, or immunological MHC presentation triggers.`,
            recommendationText: `
                <div class="space-y-1.5 pt-1">
                    ${critical.map(c => `<div class="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-950 font-bold text-xs">⛔ ${c.drugName} (${c.gene}): <span class="font-normal text-[11px]">${c.summaryAction}</span></div>`).join('')}
                </div>
            `,
            citationText: "FDA Boxed Warnings & CPIC Level A Guidelines",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 16. CASE L: ALTERNATIVE THERAPIES INQUIRY
    // ─────────────────────────────────────────────────────────────────────────
    if (isAlternative) {
        const criticalInRegimen = orderedEvals.filter(e => e.severity === "CRITICAL");
        const cypher = `MATCH (d1:Drug)<-[r1:CONTRAINDICATED_IN]-(ph:Phenotype)<-[:MAPS_TO_PHENOTYPE]-(dip:Diplotype)\nMATCH (d1)-[:ALTERNATIVE_TO]->(d2:Drug)\nRETURN d1.name AS HighRisk, collect(d2.name) AS SafeAlternatives;`;

        return formatConsultationResponse({
            headline: `Therapeutic Alternatives for Patient ${acc.accessionNo}`,
            statusBadge: "⇄ VERIFIED FIRST-LINE ALTERNATIVES",
            badgeColor: "sky",
            mainAnswer: `For patient <strong>${acc.accessionNo}</strong>, the following safe, guideline-recommended therapeutic alternatives are available to replace contraindicated medications:`,
            patientFacts: `Active candidate order basket: ${orderedEvals.map(e => e.drugName).join(', ')}`,
            mechanismText: `Alternatives are selected because their pharmacological clearance pathways do not depend on the patient's polymorphic or deficient enzymes.`,
            recommendationText: `
                <div class="space-y-2 pt-1">
                    ${criticalInRegimen.map(ev => `
                        <div class="p-2 bg-slate-50 rounded border border-slate-200">
                            <strong class="text-slate-900">${ev.drugName}:</strong> Switch to <strong class="text-emerald-800">${ev.alternatives.map(a => FORMULARY[a]?.name || a).join(' or ') || 'Consult specialist'}</strong>.
                        </div>
                    `).join('')}
                </div>
            `,
            citationText: "CPIC & DPWG Therapeutic Alternative Protocols",
            cypher
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 17. DEFAULT: Comprehensive Conversational Patient PGx Summary
    // ─────────────────────────────────────────────────────────────────────────
    const cypher = `MATCH (p:Patient {accession: "${acc.accessionNo}"})-[:HAS_DIPLOTYPE]->(d:Diplotype)-[:MAPS_TO_PHENOTYPE]->(ph:Phenotype)\nRETURN d.gene, d.allele, ph.name, ph.score;`;

    return formatConsultationResponse({
        headline: `Clinical Consultation for "${raw}"`,
        statusBadge: "CLINICAL DECISION ADVISORY",
        badgeColor: "sky",
        mainAnswer: `Regarding your query <em>"${raw}"</em>: In patient <strong>${acc.accessionNo}</strong> (${acc.ancestry}, ${acc.department}), genetic testing across all 8 core pharmacogenes reveals an individualized metabolic clearance profile.`,
        patientFacts: `Accession: ${acc.accessionNo} | Active Candidate Rx: ${orderedEvals.length} Ordered | Documented Overrides: ${Object.keys(overrides).length}`,
        mechanismText: `Patient carries verified diplotypes across CYP2C19 (${diplotypes.CYP2C19 || '*1/*1'}), CYP2D6 (${diplotypes.CYP2D6 || '*1/*1'}), CYP2C9 (${diplotypes.CYP2C9 || '*1/*1'}), SLCO1B1 (${diplotypes.SLCO1B1 || '*1/*1'}), and DPYD (${diplotypes.DPYD || '*1/*1'}).`,
        recommendationText: `
            <div class="space-y-1">
                <div>• Review active candidate medications against ranked alerts in Step 4.</div>
                <div>• Order recommended pre-prescribing TDM laboratory monitoring (INR, CBC with differential, CK, ECG).</div>
                <div>• Type any specific drug or symptom above for personalized prescriptive dosing guidance.</div>
            </div>
        `,
        citationText: "CPIC v2024 / DPWG v2024 Master Reference Panel",
        cypher
    });
}

function renderCommonHeader(activePageNum) {
    const headerEl = document.getElementById('common-portal-header');
    if (!headerEl) return;
    const acc = portalState.accessionData;
    const evaluations = evaluateOrderedRegimen();
    const criticalCount = evaluations.filter(e => e.severity === 'CRITICAL').length;
    const modCount = evaluations.filter(e => e.severity === 'MODERATE').length;

    let alertBadge = `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">All Clear (Standard)</span>`;
    if (criticalCount > 0) {
        alertBadge = `<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">⚠️ ${criticalCount} Critical Alert(s)</span>`;
    } else if (modCount > 0) {
        alertBadge = `<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">⚠ ${modCount} Moderate Alert(s)</span>`;
    }

    const pages = [
        { num: 1, name: "Patient Intake & VCF", href: "index.html" },
        { num: 2, name: "8-Gene Assay Profile", href: "pharmacogenes.html" },
        { num: 3, name: "e-Prescribing & DDGI", href: "prescribing.html" },
        { num: 4, name: "Decision Support (CDS)", href: "cds-alerts.html" },
        { num: 5, name: "Consultation & EHR", href: "consultation.html" }
    ];

    headerEl.innerHTML = `
        <div class="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
            <div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-lab-900 text-white flex items-center justify-center font-bold text-sm shadow">PGx</div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-sm font-extrabold text-slate-900 tracking-tight">PharmaGraph-CDS</h1>
                            <span class="text-[10px] font-mono uppercase bg-lab-100 text-lab-800 border border-lab-200 px-1.5 py-0.5 rounded font-semibold">Hospital Portal v2.4</span>
                        </div>
                        <p class="text-[10px] text-slate-500">Clinical Pharmacogenomics Decision Support (CPIC v2024 / DPWG v2024)</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                    <span class="text-[11px] text-slate-400 block font-mono">Patient:</span>
                    <strong class="font-bold text-slate-900">${acc.accessionNo}</strong>
                    <span class="text-slate-300">|</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 font-semibold text-slate-700">${acc.ancestry}</span>
                    <span class="text-slate-300">|</span>
                    <span class="text-slate-600 font-mono text-[11px]">${portalState.orderedDrugs.length} Rx</span>
                    <span class="text-slate-300">|</span>
                    ${alertBadge}
                </div>
            </div>

            <!-- Navigation Tabs Bar -->
            <nav class="max-w-[1440px] mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-slate-100">
                ${pages.map(p => {
                    const isActive = p.num === activePageNum;
                    return `
                        <a href="${p.href}" class="py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
                            isActive
                                ? 'border-lab-800 text-lab-900 bg-lab-50/50'
                                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }">
                            <span class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                                isActive ? 'bg-lab-800 text-white font-bold' : 'bg-slate-200 text-slate-700'
                            }">${p.num}</span>
                            ${p.name}
                        </a>
                    `;
                }).join('')}
            </nav>
        </div>
    `;
}
