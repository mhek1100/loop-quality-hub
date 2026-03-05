# QI Definitions & Formulas

> Reference: National Aged Care Quality Indicator Program Manual (Part A)
> Each section maps output column names to their NQIP definition, data source, and formula.

## ⚠️ 12 Total Categories (not 8)
The API requires 12 QI categories. The previous engineer implemented 8. Categories 9–12 below are not yet started.
See `docs/api-output-format.md` for the full API field mapping.

## How to use this doc
- Column names match the gold table output (e.g., `pi_01_assessed`, `fmi_03_with_fall`)
- "Numerator" = what is counted; "Denominator" = `TotalResidentsInPeriod` unless noted
- Metrics marked **[NULL - no data source]** return NULL in the pipeline with a SQL comment

---

## 1. Pressure Injury (PI)

| Column | NQIP # | Definition | Data Source |
|--------|--------|------------|-------------|
| `pi_01_assessed` | PI-01 | Individuals assessed for pressure injuries during the period | **Occupancy-based** — `TotalResidentsInPeriod` (all active residents). Manual: "identify a date to assess each individual residing at the aged care home." |
| `pi_04_with_pressure_injury` | PI-04 | Individuals with ≥1 pressure injury recorded during the period | `dw_fact_chartobservation` — Wound Chart, pi_classification ≠ null |
| `pi_05_stage1_count` | PI-05 | Count of Stage 1 pressure injuries | Wound Chart, pi_classification LIKE 'stage 1%' |
| `pi_06_stage2_count` | PI-06 | Count of Stage 2 pressure injuries | Wound Chart, pi_classification LIKE 'stage 2%' |
| `pi_07_stage3_count` | PI-07 | Count of Stage 3 pressure injuries | Wound Chart, pi_classification LIKE 'stage 3%' |
| `pi_08_stage4_count` | PI-08 | Count of Stage 4 pressure injuries | Wound Chart, pi_classification LIKE 'stage 4%' |
| `pi_09_unstageable_count` | PI-09 | Count of unstageable pressure injuries | Wound Chart, pi_classification LIKE 'unstageable%' |
| `pi_10_suspected_dti_count` | PI-10 | Count of suspected deep tissue injuries | Wound Chart, pi_classification LIKE 'suspected deep tissue%' |
| `pi_11_acquired_offsite` | PI-11 | Individuals with ≥1 pressure injury acquired outside facility | Wound Chart, acquired_where = 'Acquired outside facility' |
| `pi_12_stage1_offsite` through `pi_17_suspected_dti_offsite` | PI-12 to PI-17 | Per-stage count of offsite-acquired injuries | Wound Chart, stage + offsite filter |

**Notes:**
- PI-02, PI-03: exclusions (withheld consent, absent from services) — **[NULL - awaiting clarity]**

---

## 2. Restrictive Practice (RP)

| Column | NQIP # | Definition | Data Source |
|--------|--------|------------|-------------|
| `rp_02_assessed` | PR-02 | Individuals assessed for RP (excl. chemical restraint) | **Occupancy-based** — `TotalResidentsInPeriod`. Manual: "all individuals must be assessed." No longer equals `rp_04`. |
| `rp_03_excluded_absence` | PR-03 | Excluded — absent from funded care | **[NULL - no data source]** |
| `rp_04_subjected` | PR-04 | Individuals subjected to RP (excl. chemical restraint) | Same as PR-02 (authorisation form = subjection record) |
| `rp_05_subjected_secured_area` | PR-05 | Subjected — only in a secured area | Form 174: Environmental + Retreat Environment + no Mechanical |

**Notes:** Data available 2025-Q2 onwards only. PR-02 ≠ PR-04 (confirmed 2026-03-03: PR-02 = all residents assessed, PR-04 = residents actually subjected to RP). DB typo: `'Envionmental'` (missing 'r') — SQL matches exact typo. See `docs/data-gotchas.md`.

---

## 3. Unplanned Weight Loss (UPWL)

Weight collection dates: previous month end (-1), starting month end (0), middle month end (1), finishing month end (2) relative to quarter start.

| Column | NQIP # | Definition |
|--------|--------|------------|
| `upwl_01_assessed` | UPWL-01 | Individuals assessed for significant unplanned weight loss | **Occupancy-based** — `TotalResidentsInPeriod`. Manual: "all individuals must be assessed." |
| `upwl_02_refused_finishing` | UPWL-02 | Individuals who withheld consent on finishing weight date |
| `upwl_04_missing_prev_finish` | UPWL-04 | Individuals where previous or finishing weight not recorded (excl. refusals) |
| `upwl_05_5pct_loss` | UPWL-05 | Individuals with ≥5% weight decrease (previous → finishing) |
| `upwl_08_assessed_consecutive` | UPWL-08 | Individuals assessed for consecutive weight loss | **Occupancy-based** — `TotalResidentsInPeriod`. Manual: "all individuals must be assessed." |
| `upwl_09_refused_any` | UPWL-09 | Individuals who withheld consent on any weight date |
| `upwl_11_missing_any_required` | UPWL-11 | Individuals where any of the 4 required weights missing (excl. refusals) |
| `upwl_12_any_decrease` | UPWL-12 | Individuals with any consecutive decrease across the 4 weights |

**Notes:**
- UPWL-03, UPWL-10: end-of-life exclusions — **[NULL - specialNeeds column not reliable, confirm with Ian]**
- UPWL-06, UPWL-07: intentional weight loss exclusions — **[NULL - no structured data source]**

---

## 4. Falls & Major Injury (FMI)

| Column | NQIP # | Definition | Data Source |
|--------|--------|------------|-------------|
| `fmi_01_assessed` | FMI-01 | Individuals assessed for falls risk | **Occupancy-based** — `TotalResidentsInPeriod`. Manual: "all individuals must be assessed for falls and major injury." |
| `fmi_03_with_fall` | FMI-03 | Individuals with ≥1 fall | `fact_assessmentformresponse` — 'Accident / Incident Report', Type of incident IN ('Fall', 'Fall - With Major Injury', ...) |
| `fmi_04_with_major_injury` | FMI-04 | Individuals with ≥1 fall causing major injury | Incident Report — Type IN ('Fall - With Major Injury', 'Fall - With Major Injury (Fracture...)') |

**Notes:**
- FMI-02: withheld consent — **[NULL - awaiting clarity]**
- Falls classification in DB may differ from API (check double-entry for Major Injury)

---

## 5. Activities of Daily Living (ADL)

| Column | NQIP # | Definition | Data Source |
|--------|--------|------------|-------------|
| `adl_01_assessed` | ADL-01 | Individuals assessed for ADL function | **Occupancy-based** — `TotalResidentsInPeriod`. Manual: "all individuals must be assessed for ADL function." |

**Notes:**
- ADL-02: end-of-life exclusions — **[NULL - confirm with Ian]**
- ADL-04/05/06: decline comparison — **[NULL - needs previous quarter Barthel scores; implementation pending]**

---

## 6. Incontinence Care (IAD)

| Column | NQIP # | Definition | Data Source |
|--------|--------|------------|-------------|
| `iad_01_assessed` | IAD-01 | Individuals assessed for incontinence care | **Occupancy-based** — `TotalResidentsInPeriod`. Manual: "all individuals must be assessed for incontinence care." |

**Notes:**
- IAD-03: excluded (no incontinence) — **[NULL - pending]**
- IAD-04: individuals with incontinence — **[NULL - needs Urinary/Bowel chart analysis, pending]**
- IAD-05 through IAD-09: IAD grading (1A/1B/2A/2B) — **[NULL - needs Wound Chart + incontinence correlation]**

---

## 7. Hospitalisation (HSP)

| Column | NQIP # | Definition | Data Source |
|--------|--------|------------|-------------|
| All HSP metrics | HP-01 to HP-04 | ED presentations and hospital admissions | **[NULL - not confirmed in Telstra Health warehouse; check new CM platform with Ian]** |

---

## 8. Workforce (WF)

Data source: `rockpool_snapshot.humanforce_silver.silver_hf_payrun`

| Column | NQIP # | Definition |
|--------|--------|------------|
| `wf_01_sm_any_hrs` | WF-01 | Service Managers who worked any hours in the quarter |
| `wf_02_rn_any_hrs` | WF-02 | Registered Nurses who worked any hours |
| `wf_03_en_any_hrs` | WF-03 | Enrolled Nurses who worked any hours |
| `wf_04_pcw_any_hrs` | WF-04 | Personal Care Workers who worked any hours |
| `wf_05_sm_120hrs` | WF-05 | Service Managers with ≥120 hours in the previous quarter |
| `wf_06_rn_120hrs` | WF-06 | RNs with ≥120 hours in the previous quarter |
| `wf_07_en_120hrs` | WF-07 | ENs with ≥120 hours in the previous quarter |
| `wf_08_pcw_120hrs` | WF-08 | PCWs with ≥120 hours in the previous quarter |
| `wf_09_sm_no_60days` | WF-09 | Service Managers (eligible) with no ≥60-day gap in current quarter |
| `wf_10_rn_no_60days` | WF-10 | RNs (eligible) with no ≥60-day gap |
| `wf_11_en_no_60days` | WF-11 | ENs (eligible) with no ≥60-day gap |
| `wf_12_pcw_no_60days` | WF-12 | PCWs (eligible) with no ≥60-day gap |

**Role groupings used:**
- `SERVICE_MANAGER`: facility manager, clinical manager, service manager, hospitality manager
- `RN`: registered nurse, rn supervisor, nurse practitioner
- `EN`: enrolled nurse
- `PCW`: personal carer, care worker, nursing assistant, pcw

---

## 9. Medication Management (MM) — NOT YET IMPLEMENTED

Two sub-categories: Polypharmacy and Antipsychotics.

**Polypharmacy (MMS-01):** Individuals prescribed ≥9 medications on the collection date, based on medication chart or administration record review.

**Antipsychotics (MMS-02):** Individuals who received antipsychotic medication on the collection date, and sub-count of those who received it for a medically prescribed psychosis condition.

**Data source:** Likely Clinical Manager medication chart tables. Investigate:
- Chart type: possibly 'Medication Chart' or 'Medication Administration Record'
- Collection date = last day of quarter (confirm with Ian)

| Suggested Column | API Field | Description |
|-----------------|-----------|-------------|
| `mm_02_assessed_polypharmacy` | MM-02 | Assessed for polypharmacy |
| `mm_03_excluded_absence` | MM-03 | Excluded — absent from funded care |
| `mm_04_nine_plus_medications` | MM-04 | Prescribed ≥9 medications on collection date |
| `mm_07_assessed_antipsychotics` | MM-07 | Assessed for antipsychotic use |
| `mm_08_excluded_hospital` | MM-08 | Excluded — hospitalised ≥6 days prior to collection date |
| `mm_09_excluded_absence` | MM-09 | Excluded — absent from funded care |
| `mm_10_received_antipsychotic` | MM-10 | Received antipsychotic on collection date |
| `mm_11_antipsychotic_psychosis` | MM-11 | Received antipsychotic for medically prescribed psychosis |

---

## 10. Consumer Experience (CE) — NOT YET IMPLEMENTED

**Source: External survey platform — NOT in Clinical Manager or Humanforce.**
Residents (and/or proxies) complete a standardised Consumer Experience Assessment (CEA). Results are scored and banded into Excellent / Good / Moderate / Poor / Very Poor.

Three completion modes: self-completion, facilitated (interviewer), proxy.

**Score bands (24-point scale):**
- Excellent: 22–24
- Good: 15–21 (approx)
- Moderate: 10–14 (approx)
- Poor: 8–13 (approx)
- Very Poor: 0–7

**Action required:** Confirm data source with Ian / senior DE. May already exist in a separate system or be manually entered.

See `docs/api-output-format.md` for full CE-01 to CE-19 field list.

---

## 11. Quality of Life (QOL) — NOT YET IMPLEMENTED

**Source: External survey platform — NOT in Clinical Manager or Humanforce.**
Similar to Consumer Experience but measures quality of life (not care experience). Uses the same 24-point scoring scale with the same 5 bands (Excellent / Good / Moderate / Poor / Very Poor).

Three completion modes: self-completion, interviewer-facilitated, proxy.

**Action required:** Same as CE above — confirm data source.

See `docs/api-output-format.md` for full QOL-01 to QOL-18 field list.

---

## 12. Allied Health (AH) — NOT YET IMPLEMENTED

**Source: Likely Clinical Manager care/service plans.**
Measures whether allied health services (physiotherapy, OT, speech, dietetics, podiatry, etc.) recommended in care plans were actually received.

**Logic:** For each discipline: count individuals who had a service recommended in their care/service plan AND received it during the reporting period.

**Data source:** Investigate CM tables:
- Care/service plan forms in `fact_assessmentform` / `fact_assessmentformresponse`
- Allied health visit records — may be a separate chart or form type

| Suggested Column | API Field | Description |
|-----------------|-----------|-------------|
| `ah_02_excluded_absence` | AH-02 | Excluded — absent from funded care |
| `ah_03_physio_recommended` | AH-03 | Physiotherapy recommended in care plan |
| `ah_04_ot_recommended` | AH-04 | Occupational therapy recommended |
| `ah_05_speech_recommended` | AH-05 | Speech pathology recommended |
| `ah_06_dietetics_recommended` | AH-06 | Dietetics recommended |
| `ah_07_podiatry_recommended` | AH-07 | Podiatry (or other) recommended |
| `ah_08_XX_received` (per discipline) | AH-08 to AH-17 | Recommended AND received (one per discipline) |
| `ah_18_other_received` | AH-18 | Other allied health recommended + received |

See `docs/api-output-format.md` for full AH-01 to AH-19 field list.
