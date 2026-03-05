# Data Gotchas & Known Issues

> Extracted from previous engineer's inline comments. Read before touching any query.

---

## "Assessed" Metrics — Occupancy-Based, Not Form-Based (2026-03-03)

**Confirmed by Ian:** For all "assessed" metrics (PI-01, FMI-01, ADL-01, IAD-01, PR-02, UPWL-01, UPWL-08), the count should come from occupancy data (all active residents in period), not from counting how many residents had a specific assessment form completed.

**Why:** The NQIP manual states "all individuals must be assessed" for every relevant category. The assessed count = total residents − exclusions. Since we have no reliable exclusion data, assessed = `TotalResidentsInPeriod`.

**Implementation:** In `03_final_aggregation.sql`, these 7 columns use `MAX(TotalResidentsInPeriod)` instead of `SUM(form_flag)`.

**Occupancy table discovered:** `rockpool_snapshot.cm_dw_th.fact_occupancyresidentfacilitylocal`
- Schema: `DateId` (YYYYMMDD), `FacilityId`, `FacilityLocationId`, `CareReceiverId`, `DateIdCareReceiverId`
- Uses **chart facility IDs** (1,2,3,4) — needs `facility_map` join, same as `dw_fact_chartobservation`
- Daily granularity: one row per resident per day (daily census)
- Date range: 2019-09-30 to present
- For facility 1001 (chart ID 2), Q1 2025: 162 distinct residents — matches `residency` table count
- **Use in future** for "absent from facility for entire period" exclusions (IAD-02, ADL-03, FMI-02, etc.)

---

## Facility ID Mapping

**Problem:** Clinical Manager's data warehouse uses two different facility ID systems interchangeably — `FacilityID` in forms tables vs `FacilityId` in chart tables. They are NOT always the same value.

**Current workaround:** `facility_map` CTE uses `row_number()` ordering to join them. This is fragile — if facilities are added or reordered, the mapping silently breaks.

**Action required:** Confirm with Ian whether a proper lookup table exists. Add a row-count assertion to detect drift.

---

## Falls Classification

**Problem:** Falls in the database are classified differently than in the API. The `Fall - With Major Injury` label may differ from what the API expects.

**Current state:** Using these `FormAnswer` values for FMI-03: `'Fall'`, `'Fall - With Major Injury'`, `'Fall - Without Injury'`, `'Fall - Near Miss'`, `'Fall - With Major Injury (Fracture, dislocation or closed head injury)'`, `'Fall - With Injury'`

**Action required:** Double-check with Ian after access to new SQL server / new CM platform.

---

## Pressure Injury — Form Name Changes

**Problem:** The government form 'Skin Integrity Assessment Form' does not exist in the DB. The assumed equivalent is `'Skin, Hair and Nails Assessment'`.

**Problem:** `'Comprehensive Wound Assessment'` appears as `'Complex Wound Assessment'` in DB, and the question `'Type of wound'` appears as `'Wound Type'`.

**Current workaround:** Using the DB names in all queries. If CM renames forms, queries will silently return zero results.

---

## Incontinence — Toileting Form Name

**Problem:** `'Toileting Assessment Form'` does not exist in DB. Two alternatives exist:
- `'Toileting and Continence Care Assessment'`
- `'Toileting Care Needs Assessment - Complex'`

**Current state:** IAD-01 uses both alternatives. Needs validation.

---

## Restrictive Practice (RP)

**Investigated 2026-03-03.** Two data sources exist:

**Form 174 — "Restrictive Practice Authorisation (New 2025)"** (252 submissions, 127 residents, 2025-Q2 to Q3)
- Key question for PR-04: `'Select each of the Restrictive Practice(s) being implemented'`
  - Answers: `'Chemical restraint is being implemented'` (164), `'Envionmental restraint is being implemented'` (119, **note typo — missing 'r'**), `'Mechanical restraint is being implemented'` (29)
  - A single form submission can have multiple practice type rows (e.g. environmental + chemical simultaneously).
- Key question for PR-05: `'Select the form of restraint being authorised'`
  - Answers: `'Regular Medication'`, `'Retreat Environment'` (= secured area), `'PRN Medication'`, `'Low Low Bed'`, `'Location activated bracelet or pendant'`, `'Bed rail(s)'`
- **Implementation**: RP pivot subquery in `02_qi_events.sql` pivots both questions per `ClinicalAssessmentFormId` into boolean flags before joining to `base`. Same pattern as the wound chart pivot.

**Restrictive Practice Chart** (5,971 observations, 294 residents, 2025-Q1 to Q2)
- Questions: `Behaviours observed`, `Duration`, `Triggers`, `Additional information`
- This is a **behaviour monitoring chart**, not an authorisation record. Not suitable for NQIP RP metrics.

**Legacy Form 54 — "Restrictive Practices -Authorisation Form"** (21 submissions, 2021 only). Ignored — too old, too few records.

**Open questions for Ian:**
1. PR-02 "assessed": does having an authorisation form = assessed? Or are ALL residents assessed (form only appears when RP is authorised)?
2. PR-05 "secured area": is `Retreat Environment` the correct mapping? Should `Location activated bracelet or pendant` also count?

**Status:** PR-02, PR-04, PR-05 implemented from form 174 (2025-Q2+). PR-03 (excluded/absent) remains NULL.

---

## End-of-Life / Palliative Care

**Problem:** In the API, end-of-life/palliative care is retrieved via the `residentDetails` endpoint. In the DB, it's only in `rockpool_snapshot.cm_dw_th.resident` in the `specialNeeds` column — which is a free-text manually typed comment.

**Impact:** UPWL-03, UPWL-10, ADL-02 (end-of-life exclusions) cannot be computed reliably.

**Status:** NULL. Confirm with Ian.

---

## Hospitalisation / ED Presentations

**Problem:** No suitable table found for ED presentations. Possibly in new CM platform, but not in Telstra Health's shared warehouse.

**Status:** All HSP metrics return NULL. Confirm with Ian.

---

## Unplanned Weight Loss (UPWL) — Testing

**Warning:** The UPWL logic was not fully tested before the previous engineer left. Results were looking weird for some residents. Review carefully before using.

**Specific concern:** The 4-weight consecutive logic (UPWL-08 through UPWL-12) uses month-end weights from the previous month, all 3 months of the quarter. Verify with a manual calculation for a known resident.

---

## Unplanned Weight Loss — 'Refused Monthly Weigh'

**Note:** Observed answer `'Refused Monthly Weigh'` (count of 1) in the DB. Unclear if this is a dropdown option or free text. The refusal detection logic uses LIKE patterns (`%refus%`, `%withhold%`, `%consent%`) which should catch it, but verify.

---

## Intentional Weight Loss

**From NQIP manual:** "If an individual has a written record from a medical doctor or dietitian, which includes intentional weight loss (for example, body fat or fluid), this weight loss will not be counted as unplanned weight loss."

**Status:** No structured data source for this exclusion. Currently not implemented.

---

## Archived / Deleted Forms

**Uncertainty:** `IsArchived` and `DeletedDateTimeFacilityLocal` filters are currently commented out in the base query. Many records appear to be archived after quarter end.

**Risk:** Including archived forms may inflate counts.

**Action required:** Ask Ian: should archived/deleted forms be excluded? What is the archiving policy?

---

## Resident on Leave

**Note:** No clear table exists for decoding whether a resident was on leave during the period. The `dim_dischargereason` table has values like: `To Hospital`, `To Hostel`, `To Other Aged Care Facility`, `Deceased`, `Wait Return To Family`, `Other`.

**Action required:** Ask Ian how leave was assessed in Rockpool.

---

## Medication Management (MM) — Data in Medisphere, Not CM DW

**Investigated 2026-02-28:** Ran `SELECT DISTINCT Name FROM dw_dim_charttemplate` — no medication chart exists in the warehouse. The medication administration record (MAR) lives in **Medisphere** (a separate system). One form answer explicitly referenced it: *"Please refer to 'Medication Note' in Resident details administration page in Medisphere"*.

**Available forms** (CM DW only):
- `Medication Administration Assessment Form` — care planning, how staff help with meds, whether resident is on psychotropics. NOT a medication list.
- `Psychotropic Medication Self-Assessment Record` — free-text fields listing psychotropic med names + reason for prescribing. Could theoretically identify antipsychotics, but it's free text and not point-in-time.

**Status:** ALL MM fields return NULL. Cannot implement MM-04 (≥9 medications) at all. MM-10/11 (antipsychotics) may be partially implementable from `Psychotropic Medication Self-Assessment Record` if Ian confirms this as the right source and the API field structure is confirmed.

**Action required:** Ask Ian whether a Medisphere extract can be added to Databricks, OR confirm the Psychotropic Medication Self-Assessment Record as the source for antipsychotic metrics.

---

## Allied Health (AH) — Referral Forms Available, Received Not Confirmed

**Investigated 2026-02-28:** Allied health referral forms exist in CM DW:
- `Allied Health Referral - General` — has `Type of Referral Requested` with values: 'Physiotherapy' (1322), 'Dietician' (790), 'Speech Therapy' (676), 'Podiatrist' (102), 'Occupational Therapy' (13), 'Dental', 'Optometry', 'Audiology', 'Other'
- `Allied Health Referral - Physiotherapy` — has `Date of Referral`, `Reason for Referral`
- `Physiotherapy Assessment Form` — completed by physio when they see the resident; likely = "received"
- `Podiatry Assessment Form` + `Podiatry Assessment` — completed by podiatrist; likely = "received"

**What can be implemented (with Ian confirmation):**
- AH-03 physio recommended: `Allied Health Referral - Physiotherapy` OR `Allied Health Referral - General` where Type = 'Physiotherapy'
- AH-04 OT recommended: `Allied Health Referral - General` where Type IN ('Occupational Therapy', 'Occupational Therapist')
- AH-05 speech recommended: `Allied Health Referral - General` where Type = 'Speech Therapy'
- AH-06 dietetics recommended: `Allied Health Referral - General` where Type = 'Dietician'
- AH-07 podiatry recommended: `Allied Health Referral - General` where Type = 'Podiatrist' OR Podiatry Assessment form completed
- AH-08 physio received: `Physiotherapy Assessment Form` completed in quarter
- AH-?? podiatry received: `Podiatry Assessment Form` completed in quarter
- OT, speech, dietetics received: **NO data source found**

**Blocker:** The exact API field breakdown (which discipline maps to AH-03 through AH-17) is unconfirmed — must validate against the live API spec. The AH-08 to AH-17 range may not map cleanly to the 5 disciplines we have data for.

**Action required:** Confirm with Ian: (1) are referral forms the right source for "recommended in care plan"? (2) confirm AH discipline field mapping against live API spec. (3) how to handle "received" for OT, speech, dietetics where no assessment form exists.

---

## Numerator vs Percentage Reporting

**From NQIP manual:** "For each of the quality indicators, excluding the workforce, enrolled nursing, allied health and lifestyle officers quality indicators, the percentage value is derived using the following formula..."

**Current state:** Pipeline reports raw counts/numbers, not percentages.

**Action required:** Confirm with Ian whether we submit numbers or percentages. (Formula change is straightforward — just divide by `TotalResidentsInPeriod`.)
