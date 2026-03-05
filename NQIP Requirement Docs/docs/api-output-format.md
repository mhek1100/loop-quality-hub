# API Output Format

> Source: Quality Indicators API v2.0 (PRODUCTION)
> URL: https://developer.health.gov.au/s/communityapi/a01OZ000003SfL8YAK/acmqualityindicatorsapi
>
> The API uses a hierarchical questionnaire structure. Each QI category maps to
> Level 1 → Level 2 sub-section → individual fields (Level 3).
>
> Field naming convention used here: the API field code (e.g. PI-01) is what
> must be submitted. Our gold table uses snake_case column aliases.

---

## ⚠️ Important: 12 Categories, Not 8

The previous engineer's notebooks covered **8 categories**. The API actually requires **12**:

| # | Category | API Prefix | Status in Pipeline |
|---|----------|------------|-------------------|
| 1 | Pressure Injuries | PI | Implemented |
| 2 | Restrictive Practices | PR | NULL — no data source found |
| 3 | Unplanned Weight Loss | UPWL | Implemented (untested) |
| 4 | Falls & Major Injury | FMI | Implemented |
| 5 | Activities of Daily Living | ADL | Partial (ADL-04/05/06 pending) |
| 6 | Incontinence Care | IAD | Partial (IAD-04 to IAD-09 pending) |
| 7 | Hospitalisation | HP | NULL — no data source |
| 8 | Workforce | WF | Implemented |
| 9 | **Medication Management** | MM | **Not started — data likely in CM** |
| 10 | **Consumer Experience** | CE | **Not started — survey data, different source** |
| 11 | **Quality of Life** | QOL | **Not started — survey data, different source** |
| 12 | **Allied Health** | AH | **Not started — data likely in CM care plans** |

---

## API Structure

The API endpoint is a FHIR-based questionnaire. Each submission contains sections and
sub-sections keyed by codes (e.g. `PIS-01`, `UPWLS-02`). All integer fields are counts
of individuals unless noted. `Required: FALSE` fields are optional comments.

---

## 1. Pressure Injuries (PI)

### PIS-01 — Pressure Injuries Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| PI-01 | pi_01_assessed | integer | TRUE | Assessed for pressure injuries |
| PI-02 | pi_02_excluded_consent | integer | TRUE | Excluded — withheld consent |
| PI-03 | pi_03_excluded_absence | integer | TRUE | Excluded — absent from funded care |
| PI-04 | pi_04_with_pressure_injury | integer | TRUE | With ≥1 pressure injury |

### PIS-02 — Pressure Injury Counts (by stage)
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| PI-05 | pi_05_stage1_count | integer | TRUE | Stage 1 pressure injuries |
| PI-06 | pi_06_stage2_count | integer | TRUE | Stage 2 |
| PI-07 | pi_07_stage3_count | integer | TRUE | Stage 3 |
| PI-08 | pi_08_stage4_count | integer | TRUE | Stage 4 |
| PI-09 | pi_09_unstageable_count | integer | TRUE | Unstageable |
| PI-10 | pi_10_suspected_dti_count | integer | TRUE | Suspected deep tissue injury |

### PIS-03 — Acquired Outside Facility
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| PI-11 | pi_11_acquired_offsite | integer | TRUE | With ≥1 PI acquired outside facility |
| PI-12 | pi_12_stage1_offsite | integer | TRUE | Stage 1 offsite |
| PI-13 | pi_13_stage2_offsite | integer | TRUE | Stage 2 offsite |
| PI-14 | pi_14_stage3_offsite | integer | TRUE | Stage 3 offsite |
| PI-15 | pi_15_stage4_offsite | integer | TRUE | Stage 4 offsite |
| PI-16 | pi_16_unstageable_offsite | integer | TRUE | Unstageable offsite |
| PI-17 | pi_17_suspected_dti_offsite | integer | TRUE | Suspected DTI offsite |

### PIS-04 — Additional Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| PI-18 | *(omit)* | string | FALSE | Comments |

---

## 2. Restrictive Practices (PR)

### PRS-01 — Restrictive Practices Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| PR-01 | *(collection date)* | date | TRUE | Collection date in the collection period |
| PR-02 | rp_02_assessed | integer | TRUE | Assessed for restrictive practices (excl. chemical restraint) |
| PR-03 | rp_03_excluded_absence | integer | TRUE | Excluded — absent from funded care |
| PR-04 | rp_04_subjected | integer | TRUE | Subjected to restrictive practices (excl. chemical restraint) |
| PR-05 | rp_05_subjected_secured_area | integer | TRUE | Subjected — only in a secured area |

### PRS-02 — Additional Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| PR-06 | *(omit)* | string | FALSE | Comments |

**Status: ALL NULL — no confirmed data source in Telstra Health warehouse. Check new CM platform.**

---

## 3. Unplanned Weight Loss (UPWL)

### UPWLS-01 — Significant Unplanned Weight Loss
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| UPWL-01 | upwl_01_assessed | integer | TRUE | Assessed for significant UPWL |
| UPWL-02 | upwl_02_refused_finishing | integer | TRUE | Excluded — withheld consent on finishing weight date |
| UPWL-03 | upwl_03_eol_excluded | integer | TRUE | Excluded — end-of-life care |
| UPWL-04 | upwl_04_missing_prev_finish | integer | TRUE | Previous or finishing weight not recorded |
| UPWL-05 | upwl_05_5pct_loss | integer | TRUE | ≥5% decrease (previous → finishing weight) |
| UPWL-06 | *(omit)* | string | FALSE | Comments |

### UPWLS-02 — Consecutive Unplanned Weight Loss
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| UPWL-07 | upwl_08_assessed_consecutive | integer | TRUE | Assessed for consecutive UPWL |
| UPWL-08 | upwl_09_refused_any | integer | TRUE | Excluded — withheld consent on any weight date |
| UPWL-09 | upwl_10_eol_excluded | integer | TRUE | Excluded — end-of-life care |
| UPWL-10 | upwl_11_missing_any_required | integer | TRUE | Any required weight not recorded |
| UPWL-11 | upwl_12_any_decrease | integer | TRUE | Any consecutive decrease across 4 weights |
| UPWL-12 | *(omit)* | string | FALSE | Comments |

> **Note:** The notebook column numbering (upwl_08, upwl_09...) does NOT match API field numbers
> (UPWL-07, UPWL-08...) in the consecutive section. The notebook skips some numbers (06, 07, 10)
> matching the NQIP manual section numbering. API fields are renumbered consecutively per section.
> Map carefully when building the API payload.

---

## 4. Falls & Major Injury (FMI)

### FMIS-01 — Falls and Major Injury Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| FMI-01 | fmi_01_assessed | integer | TRUE | Assessed for falls risk (FRAT) |
| FMI-02 | fmi_02_excluded_consent | integer | TRUE | Excluded — withheld consent |
| FMI-03 | fmi_03_fall_count | integer | TRUE | With ≥1 fall |
| FMI-04 | fmi_04_major_injury_count | integer | TRUE | With ≥1 fall causing major injury |
| FMI-05 | *(omit)* | string | FALSE | Comments |

---

## 5. Activities of Daily Living (ADL)

### ADLS-01 — ADL Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| ADL-01 | adl_01_assessed | integer | TRUE | Assessed for ADL function (Barthel Index) |
| ADL-02 | adl_02_eol_excluded | integer | TRUE | Excluded — end-of-life care |
| ADL-03 | adl_03_excluded_absence | integer | TRUE | Excluded — absent from funded care throughout period |
| ADL-04 | adl_04_no_prev_assessment | integer | TRUE | Excluded — no previous period assessment recorded |
| ADL-05 | adl_05_prev_score_zero | integer | TRUE | Excluded — previous ADL total score was zero |
| ADL-06 | adl_06_decline | integer | TRUE | Experienced decline (−1 or more points from previous period) |
| ADL-07 | *(omit)* | string | FALSE | Comments |

---

## 6. Incontinence Care (IAD)

### IADS-01 — Incontinence Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| IAD-01 | iad_01_assessed | integer | TRUE | Assessed for incontinence care |
| IAD-02 | iad_02_excluded_absence | integer | TRUE | Excluded — absent from funded care |
| IAD-03 | iad_03_excluded_no_incontinence | integer | TRUE | Excluded — does not have incontinence |
| IAD-04 | iad_04_has_incontinence | integer | TRUE | Has incontinence |

### IADS-02 — IAD Grading (Ghent Global IAD Categorisation Tool)
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| IAD-05 | iad_05_has_iad | integer | TRUE | Has incontinence AND IAD |
| IAD-06 | iad_06_grade_1a | integer | TRUE | Grade 1A: persistent redness without clinical signs of infection |
| IAD-07 | iad_07_grade_1b | integer | TRUE | Grade 1B: persistent redness with clinical signs of infection |
| IAD-08 | iad_08_grade_2a | integer | TRUE | Grade 2A: skin loss without clinical signs of infection |
| IAD-09 | iad_09_grade_2b | integer | TRUE | Grade 2B: skin loss with clinical signs of infection |
| IAD-10 | *(omit)* | string | FALSE | Comments |

---

## 7. Hospitalisation (HP)

### HPS-01 — Hospitalisation Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| HP-01 | hsp_01_assessed | integer | TRUE | Assessed for hospitalisation |
| HP-02 | hsp_02_excluded_absence | integer | TRUE | Excluded — absent from funded care |
| HP-03 | hsp_03_ed_presentation | integer | TRUE | With ≥1 emergency department presentation |
| HP-04 | hsp_04_ed_or_admission | integer | TRUE | With ≥1 ED presentation OR hospital admission |
| HP-05 | *(omit)* | string | FALSE | Comments |

**Status: ALL NULL — not in Telstra Health warehouse. Check new CM platform with Ian.**

---

## 8. Workforce (WF)

### WFS-01 to WFS-04 — Workforce Details
| API Field | Gold Table Column | Type | Required | Description |
|-----------|------------------|------|----------|-------------|
| WF-01 | wf_01_sm_any_hrs | integer | TRUE | Service managers — worked any hours in period |
| WF-02 | wf_02_rn_any_hrs | integer | TRUE | Nurse practitioners / RNs — worked any hours |
| WF-03 | wf_03_en_any_hrs | integer | TRUE | Enrolled nurses — worked any hours |
| WF-04 | wf_04_pcw_any_hrs | integer | TRUE | Personal care workers — worked any hours |
| WF-05 | wf_05_sm_120hrs | integer | TRUE | Service managers — employed at start AND ≥120 hrs in previous period |
| WF-06 | wf_06_rn_120hrs | integer | TRUE | Nurse practitioners / RNs — same |
| WF-07 | wf_07_en_120hrs | integer | TRUE | Enrolled nurses — same |
| WF-08 | wf_08_pcw_120hrs | integer | TRUE | Personal care workers — same |
| WF-09 | wf_09_sm_no_60days | integer | TRUE | Service managers (eligible) — did NOT stop work for ≥60 consecutive days |
| WF-10 | wf_10_rn_no_60days | integer | TRUE | Nurse practitioners / RNs — same |
| WF-11 | wf_11_en_no_60days | integer | TRUE | Enrolled nurses — same |
| WF-12 | wf_12_pcw_no_60days | integer | TRUE | Personal care workers — same |
| WF-13 | *(omit)* | string | FALSE | Comments |

---

## 9. Medication Management (MM) — NOT YET IMPLEMENTED

Data likely available in Clinical Manager (medication charts / administration records).

### MMS-01 — Polypharmacy Details
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| MM-01 | *(collection date)* | date | TRUE | Collection date |
| MM-02 | mm_02_assessed_polypharmacy | integer | TRUE | Assessed for polypharmacy |
| MM-03 | mm_03_excluded_absence | integer | TRUE | Excluded — absent from funded care |
| MM-04 | mm_04_nine_plus_medications | integer | TRUE | Prescribed ≥9 medications based on medication chart/admin record on collection date |
| MM-05 | *(omit)* | string | FALSE | Comments |

### MMS-02 — Antipsychotics Details
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| MM-06 | *(collection date)* | date | TRUE | Collection date |
| MM-07 | mm_07_assessed_antipsychotics | integer | TRUE | Assessed for antipsychotic medication use |
| MM-08 | mm_08_excluded_hospital | integer | TRUE | Excluded — admitted to hospital ≥6 days prior to collection date |
| MM-09 | mm_09_excluded_absence | integer | TRUE | Excluded — absent from receiving funded aged care |
| MM-10 | mm_10_received_antipsychotic | integer | TRUE | Received antipsychotic medication (per medication chart/admin record) |
| MM-11 | mm_11_antipsychotic_psychosis | integer | TRUE | Received antipsychotic for medically prescribed condition of psychosis |
| MM-12 | *(omit)* | string | FALSE | Comments |

**Action required:** Investigate Clinical Manager tables for medication chart data. Likely tables:
- `dw_fact_chartobservation` with chart type 'Medication Chart' or similar
- `fact_assessmentformresponse` for medication-related forms

---

## 10. Consumer Experience (CE) — NOT YET IMPLEMENTED

**Source: External survey tool — NOT in Clinical Manager or Humanforce.**
This data comes from consumer experience surveys administered separately.
Confirm with Ian / senior DE what the data source is (likely a separate survey platform or manually entered).

### CES-01 — Consumer Experience Summary
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| CE-01 | ce_01_total_completed | integer | TRUE | Total who completed CEA (self + facilitated + proxy) |
| CE-02 | ce_02_excluded_absence | integer | TRUE | Excluded — absent from funded care |
| CE-03 | ce_03_opted_out | integer | TRUE | Opted out of completing CEA |

### CES-02 — Self-Completion Results (score-banded)
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| CE-04 | ce_04_self_excellent | integer | TRUE | Excellent (score 22–24) |
| CE-05 | ce_05_self_good | integer | TRUE | Good (score 15–21) |
| CE-06 | ce_06_self_moderate | integer | TRUE | Moderate (score 10–14) |
| CE-07 | ce_07_self_poor | integer | TRUE | Poor (score 8–13) |
| CE-08 | ce_08_self_very_poor | integer | TRUE | Very Poor (score 0–7) |

### CES-03 — Facilitated-Completion Results
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| CE-09 | ce_09_fac_excellent | integer | TRUE | Excellent |
| CE-10 | ce_10_fac_good | integer | TRUE | Good |
| CE-11 | ce_11_fac_moderate | integer | TRUE | Moderate |
| CE-12 | ce_12_fac_poor | integer | TRUE | Poor |
| CE-13 | ce_13_fac_very_poor | integer | TRUE | Very Poor |

### CES-04/05 — Proxy-Completion & Additional Details (CE-14 to CE-19)
> Exact sub-field breakdown to be confirmed from live API spec.
> CE-19 = Comments (string, FALSE)

---

## 11. Quality of Life (QOL) — NOT YET IMPLEMENTED

**Source: External survey tool — NOT in Clinical Manager or Humanforce.**
Same data source question as Consumer Experience above.

### QOLS-01 — QOL Summary
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| QOL-01 | qol_01_self_completed | integer | TRUE | Undertook QOL assessment (self-completion) |
| QOL-02 | qol_02_excluded_absence | integer | TRUE | Excluded — absent |
| QOL-03 | qol_03_opted_out | integer | TRUE | Opted out |

### QOLS-02 — Self-Completion Results
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| QOL-04 | qol_04_self_excellent | integer | TRUE | Excellent (score 22–24) |
| QOL-05 | qol_05_self_good | integer | TRUE | Good (score 19–21) |
| QOL-06 | qol_06_self_moderate | integer | TRUE | Moderate (score 14–18) |
| QOL-07 | qol_07_self_poor | integer | TRUE | Poor (score 8–13) |
| QOL-08 | qol_08_self_very_poor | integer | TRUE | Very Poor (score 0–7) |

### QOLS-03 — Interviewer-Facilitated Results
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| QOL-09 | qol_09_int_excellent | integer | TRUE | Excellent |
| QOL-10 | qol_10_int_good | integer | TRUE | Good |
| QOL-11 | qol_11_int_moderate | integer | TRUE | Moderate |
| QOL-12 | qol_12_int_poor | integer | TRUE | Poor |
| QOL-13 | qol_13_int_very_poor | integer | TRUE | Very Poor |

### QOLS-04 — Proxy & Additional Details (QOL-14 to QOL-18)
> QOL-18 = Comments (string, FALSE)
> Exact sub-field breakdown to be confirmed.

---

## 12. Allied Health (AH) — NOT YET IMPLEMENTED

**Source: Likely Clinical Manager care plans.** Data about allied health services
recommended in care/service plans and whether they were received.

### AHS-01 — Allied Health Summary
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| AH-01 | *(collection date)* | date | TRUE | Collection date |
| AH-02 | ah_02_excluded_absence | integer | TRUE | Excluded — absent from funded care |

### AHS-02 — Services Recommended in Care Plans
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| AH-03 | ah_03_physio_recommended | integer | TRUE | Physiotherapy services recommended in care/services plan |
| AH-04 | ah_04_ot_recommended | integer | TRUE | Occupational therapy recommended |
| AH-05 | ah_05_speech_recommended | integer | TRUE | Speech pathology recommended |
| AH-06 | ah_06_dietetics_recommended | integer | TRUE | Dietetics recommended |
| AH-07 | ah_07_podiatry_recommended | integer | TRUE | Podiatry recommended (or other allied health) |

### AHS-03 — Services Received (recommended and received)
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| AH-08 to AH-17 | ah_0X_*_received | integer | TRUE | Per-discipline: recommended via care plan AND received |

### AHS-04 — Additional Details
| API Field | Suggested Column | Type | Required | Description |
|-----------|-----------------|------|----------|-------------|
| AH-18 | ah_18_other_received | integer | TRUE | Other allied health recommended + received |
| AH-19 | *(omit)* | string | FALSE | Comments |

> **Note:** AH-03 to AH-17 exact discipline breakdown (physiotherapist, OT, speech pathologist,
> dietitian, podiatrist, exercise physiologist, etc.) to be confirmed against live API spec.
> The pattern is consistent: each discipline has a "recommended" and a "received" field.

---

## API Payload Notes

- **Authentication:** Confirm OAuth/API key method with senior DE (details in live API portal)
- **Submission unit:** One questionnaire per facility per quarter
- **Collection date:** PR-01, MM-01, MM-06, AH-01 are dates (last day of quarter, or specific collection date — confirm)
- **Percentages vs counts:** The API expects raw **counts** (integers). Percentages are calculated by the government portal using `TotalResidentsInPeriod` as denominator.
- **NULL handling:** Required fields cannot be NULL in the API payload. Where our pipeline returns NULL, the field must either be excluded or submitted as 0 with a comment explaining the exclusion.
