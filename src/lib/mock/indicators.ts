import { IndicatorCode, IndicatorDefinition, QuestionAnswer } from "../types";

export const INDICATORS: IndicatorDefinition[] = [
  {
    code: "PI",
    name: "Pressure Injuries",
    shortName: "Pressure Injuries",
    category: "Clinical",
    description: "Data on pressure injuries acquired at the service"
  },
  {
    code: "RP",
    name: "Restrictive Practices",
    shortName: "Restrictive Practices",
    category: "Clinical",
    description: "Use of restrictive practices on care recipients"
  },
  {
    code: "UPWL",
    name: "Unplanned Weight Loss",
    shortName: "Weight Loss",
    category: "Clinical",
    description: "Significant and consecutive unplanned weight loss"
  },
  {
    code: "FALL",
    name: "Falls and Major Injury",
    shortName: "Falls",
    category: "Clinical",
    description: "Falls experienced by care recipients and resulting injuries"
  },
  {
    code: "MM",
    name: "Medication Management",
    shortName: "Medication",
    category: "Clinical",
    description: "Polypharmacy and antipsychotic medication use"
  },
  {
    code: "ADL",
    name: "Activities of Daily Living",
    shortName: "ADL",
    category: "Clinical",
    description: "Decline in activities of daily living"
  },
  {
    code: "IC",
    name: "Incontinence Care",
    shortName: "Incontinence",
    category: "Clinical",
    description: "Incontinence associated dermatitis"
  },
  {
    code: "HP",
    name: "Hospitalisation",
    shortName: "Hospitalisation",
    category: "Clinical",
    description: "Emergency department presentations and unplanned hospitalisations"
  },
  {
    code: "WF",
    name: "Workforce",
    shortName: "Workforce",
    category: "Workforce",
    description: "Staff numbers and turnover"
  },
  {
    code: "CE",
    name: "Consumer Experience",
    shortName: "Experience",
    category: "Experience",
    description: "Consumer experience assessment results"
  },
  {
    code: "QOL",
    name: "Quality of Life",
    shortName: "Quality of Life",
    category: "Experience",
    description: "Quality of life assessment results"
  },
  {
    code: "AH",
    name: "Allied Health",
    shortName: "Allied Health",
    category: "Workforce",
    description: "Allied health services received"
  },
  {
    code: "EN",
    name: "Enrolled Nursing",
    shortName: "Enrolled Nursing",
    category: "Workforce",
    description: "Enrolled nurse hours and ratios"
  },
  {
    code: "LO",
    name: "Lifestyle Officers",
    shortName: "Lifestyle",
    category: "Workforce",
    description: "Lifestyle officer hours and activities"
  }
];

export const getIndicatorByCode = (code: IndicatorCode): IndicatorDefinition | undefined => {
  return INDICATORS.find(i => i.code === code);
};

// Full question sets for each indicator based on NQIP FHIR specification
export const INDICATOR_QUESTIONS: Record<IndicatorCode, Omit<QuestionAnswer, "autoValue" | "userValue" | "finalValue" | "isOverridden" | "warnings" | "errors">[]> = {
  PI: [
    { linkId: "PI-01", promptText: "Number of care days in the reporting period", responseType: "integer", required: true, groupId: "PIS-01", groupName: "Pressure Injuries Details" },
    { linkId: "PI-02", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "PIS-01", groupName: "Pressure Injuries Details" },
    { linkId: "PI-03", promptText: "Number of individuals that were assessed for pressure injuries during the reporting period using a validated pressure injury staging system", responseType: "integer", required: true, groupId: "PIS-01", groupName: "Pressure Injuries Details" },
    { linkId: "PI-04", promptText: "Date of the first day of the previous reporting period", responseType: "date", required: true, groupId: "PIS-01", groupName: "Pressure Injuries Details" },
    { linkId: "PI-05", promptText: "Number of individuals that have pressure injuries reported against Stage 1", responseType: "integer", required: true, groupId: "PIS-02", groupName: "Number of individuals that have pressure injuries reported" },
    { linkId: "PI-06", promptText: "Number of individuals that have pressure injuries reported against Stage 2", responseType: "integer", required: true, groupId: "PIS-02", groupName: "Number of individuals that have pressure injuries reported" },
    { linkId: "PI-07", promptText: "Number of individuals that have pressure injuries reported against Stage 3", responseType: "integer", required: true, groupId: "PIS-02", groupName: "Number of individuals that have pressure injuries reported" },
    { linkId: "PI-08", promptText: "Number of individuals that have pressure injuries reported against Stage 4", responseType: "integer", required: true, groupId: "PIS-02", groupName: "Number of individuals that have pressure injuries reported" },
    { linkId: "PI-09", promptText: "Number of individuals that have pressure injuries reported against Unstageable - Unclassified", responseType: "integer", required: true, groupId: "PIS-02", groupName: "Number of individuals that have pressure injuries reported" },
    { linkId: "PI-10", promptText: "Number of individuals that have pressure injuries reported against Suspected Deep Tissue Injury", responseType: "integer", required: true, groupId: "PIS-02", groupName: "Number of individuals that have pressure injuries reported" },
    { linkId: "PI-11", promptText: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against Stage 1", responseType: "integer", required: true, groupId: "PIS-03", groupName: "Pressure injuries acquired outside the home" },
    { linkId: "PI-12", promptText: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against Stage 2", responseType: "integer", required: true, groupId: "PIS-03", groupName: "Pressure injuries acquired outside the home" },
    { linkId: "PI-13", promptText: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against Stage 3", responseType: "integer", required: true, groupId: "PIS-03", groupName: "Pressure injuries acquired outside the home" },
    { linkId: "PI-14", promptText: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against Stage 4", responseType: "integer", required: true, groupId: "PIS-03", groupName: "Pressure injuries acquired outside the home" },
    { linkId: "PI-15", promptText: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against Unstageable - Unclassified", responseType: "integer", required: true, groupId: "PIS-03", groupName: "Pressure injuries acquired outside the home" },
    { linkId: "PI-16", promptText: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against Suspected Deep Tissue Injury", responseType: "integer", required: true, groupId: "PIS-03", groupName: "Pressure injuries acquired outside the home" },
    { linkId: "PI-17", promptText: "Comments", responseType: "string", required: false, groupId: "PIS-04", groupName: "Additional Details" },
  ],
  RP: [
    { linkId: "PR-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "PRS-01", groupName: "Restrictive Practices Details" },
    { linkId: "PR-02", promptText: "Number of individuals that were subjected to physical restraint during the reporting period", responseType: "integer", required: true, groupId: "PRS-01", groupName: "Restrictive Practices Details" },
    { linkId: "PR-03", promptText: "Number of individuals that were subjected to chemical restraint during the reporting period", responseType: "integer", required: true, groupId: "PRS-01", groupName: "Restrictive Practices Details" },
    { linkId: "PR-04", promptText: "Number of individuals that were subjected to environmental restraint during the reporting period", responseType: "integer", required: true, groupId: "PRS-01", groupName: "Restrictive Practices Details" },
    { linkId: "PR-05", promptText: "Number of individuals that were subjected to seclusion during the reporting period", responseType: "integer", required: true, groupId: "PRS-01", groupName: "Restrictive Practices Details" },
    { linkId: "PR-06", promptText: "Comments", responseType: "string", required: false, groupId: "PRS-02", groupName: "Additional Details" },
  ],
  UPWL: [
    { linkId: "UPWL-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period that have had significant unplanned weight loss", responseType: "integer", required: true, groupId: "UPWLS-01", groupName: "Significant unplanned weight loss" },
    { linkId: "UPWL-02", promptText: "Number of individuals that became care recipients on or after the first day of the reporting period (new admissions and readmissions)", responseType: "integer", required: true, groupId: "UPWLS-01", groupName: "Significant unplanned weight loss" },
    { linkId: "UPWL-03", promptText: "Number of individuals that became care recipients before the first day of the reporting period but on or after the first day of the previous reporting period (end of life care)", responseType: "integer", required: true, groupId: "UPWLS-01", groupName: "Significant unplanned weight loss" },
    { linkId: "UPWL-04", promptText: "Number of individuals that became care recipients before the first day of the previous reporting period that have had significant unplanned weight loss", responseType: "integer", required: true, groupId: "UPWLS-01", groupName: "Significant unplanned weight loss" },
    { linkId: "UPWL-05", promptText: "Number of individuals with significant unplanned weight loss that are receiving end of life care or have a documented weight management plan", responseType: "integer", required: true, groupId: "UPWLS-01", groupName: "Significant unplanned weight loss" },
    { linkId: "UPWL-06", promptText: "Comments for significant unplanned weight loss", responseType: "string", required: false, groupId: "UPWLS-01", groupName: "Significant unplanned weight loss" },
    { linkId: "UPWL-07", promptText: "Number of individuals that stayed overnight at any time during the reporting period that have had consecutive unplanned weight loss", responseType: "integer", required: true, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
    { linkId: "UPWL-08", promptText: "Number of individuals that became care recipients on or after the first day of the previous reporting period (new admissions and readmissions) with consecutive weight loss", responseType: "integer", required: true, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
    { linkId: "UPWL-09", promptText: "Number of individuals with consecutive unplanned weight loss that are receiving end of life care", responseType: "integer", required: true, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
    { linkId: "UPWL-10", promptText: "Number of individuals that became care recipients before the first day of the previous reporting period", responseType: "integer", required: true, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
    { linkId: "UPWL-11", promptText: "Number of individuals requiring a documented weight management plan that do not have a current weight management plan or the weight management plan was not successfully implemented", responseType: "integer", required: true, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
    { linkId: "UPWL-12", promptText: "Number of individuals with consecutive unplanned weight loss where the decrease in weight between consecutive weight measurements is less than 5%", responseType: "integer", required: true, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
    { linkId: "UPWL-13", promptText: "Comments for consecutive unplanned weight loss", responseType: "string", required: false, groupId: "UPWLS-02", groupName: "Consecutive unplanned weight loss" },
  ],
  FALL: [
    { linkId: "FALL-01", promptText: "Number of care days in the reporting period", responseType: "integer", required: true, groupId: "FS-01", groupName: "Falls Details" },
    { linkId: "FALL-02", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "FS-01", groupName: "Falls Details" },
    { linkId: "FALL-03", promptText: "Number of falls that occurred during the reporting period", responseType: "integer", required: true, groupId: "FS-01", groupName: "Falls Details" },
    { linkId: "FALL-04", promptText: "Number of falls resulting in no injury or minor injury", responseType: "integer", required: true, groupId: "FS-02", groupName: "Falls Injury Classification" },
    { linkId: "FALL-05", promptText: "Number of falls resulting in moderate injury", responseType: "integer", required: true, groupId: "FS-02", groupName: "Falls Injury Classification" },
    { linkId: "FALL-06", promptText: "Number of falls resulting in major injury", responseType: "integer", required: true, groupId: "FS-02", groupName: "Falls Injury Classification" },
    { linkId: "FALL-07", promptText: "Number of falls resulting in death", responseType: "integer", required: true, groupId: "FS-02", groupName: "Falls Injury Classification" },
    { linkId: "FALL-08", promptText: "Comments", responseType: "string", required: false, groupId: "FS-03", groupName: "Additional Details" },
  ],
  MM: [
    { linkId: "MM-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "MMS-01", groupName: "Polypharmacy" },
    { linkId: "MM-02", promptText: "Number of individuals prescribed 9 or more medications", responseType: "integer", required: true, groupId: "MMS-01", groupName: "Polypharmacy" },
    { linkId: "MM-03", promptText: "Number of individuals that had a medication review during the reporting period", responseType: "integer", required: true, groupId: "MMS-01", groupName: "Polypharmacy" },
    { linkId: "MM-04", promptText: "Number of individuals that had a medication review as a direct result of a medication-related incident", responseType: "integer", required: true, groupId: "MMS-01", groupName: "Polypharmacy" },
    { linkId: "MM-05", promptText: "Number of individuals prescribed 9 or more medications who had a medication review conducted by a pharmacist", responseType: "integer", required: true, groupId: "MMS-01", groupName: "Polypharmacy" },
    { linkId: "MM-06", promptText: "Comments for Polypharmacy", responseType: "string", required: false, groupId: "MMS-01", groupName: "Polypharmacy" },
    { linkId: "MM-07", promptText: "Number of individuals prescribed antipsychotic medications during the reporting period", responseType: "integer", required: true, groupId: "MMS-02", groupName: "Antipsychotics" },
    { linkId: "MM-08", promptText: "Number of individuals with a diagnosis of psychosis", responseType: "integer", required: true, groupId: "MMS-02", groupName: "Antipsychotics" },
    { linkId: "MM-09", promptText: "Number of individuals without a diagnosis of psychosis prescribed antipsychotics", responseType: "integer", required: true, groupId: "MMS-02", groupName: "Antipsychotics" },
    { linkId: "MM-10", promptText: "Number of individuals prescribed antipsychotics that had their prescription reviewed during the reporting period", responseType: "integer", required: true, groupId: "MMS-02", groupName: "Antipsychotics" },
    { linkId: "MM-11", promptText: "Number of individuals with antipsychotic prescriptions that were continued after review", responseType: "integer", required: true, groupId: "MMS-02", groupName: "Antipsychotics" },
    { linkId: "MM-12", promptText: "Comments for Antipsychotics", responseType: "string", required: false, groupId: "MMS-02", groupName: "Antipsychotics" },
  ],
  ADL: [
    { linkId: "ADL-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "ADLS-01", groupName: "Activities of Daily Living Details" },
    { linkId: "ADL-02", promptText: "Number of individuals that had their ADL status assessed during the reporting period", responseType: "integer", required: true, groupId: "ADLS-01", groupName: "Activities of Daily Living Details" },
    { linkId: "ADL-03", promptText: "Number of individuals that had a decline in ADL independence during the reporting period", responseType: "integer", required: true, groupId: "ADLS-01", groupName: "Activities of Daily Living Details" },
    { linkId: "ADL-04", promptText: "Number of individuals that had a decline in ADL independence that was expected due to end of life or chronic progressive condition", responseType: "integer", required: true, groupId: "ADLS-01", groupName: "Activities of Daily Living Details" },
    { linkId: "ADL-05", promptText: "Number of individuals that had a decline in ADL independence that resulted in a care plan review", responseType: "integer", required: true, groupId: "ADLS-01", groupName: "Activities of Daily Living Details" },
    { linkId: "ADL-06", promptText: "Number of individuals whose decline in ADL independence was reversed or stabilised", responseType: "integer", required: true, groupId: "ADLS-01", groupName: "Activities of Daily Living Details" },
    { linkId: "ADL-07", promptText: "Comments", responseType: "string", required: false, groupId: "ADLS-02", groupName: "Additional Details" },
  ],
  IC: [
    { linkId: "IAD-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "IADS-01", groupName: "Incontinence Care Details" },
    { linkId: "IAD-02", promptText: "Number of individuals that became care recipients from the start of the reporting period", responseType: "integer", required: true, groupId: "IADS-01", groupName: "Incontinence Care Details" },
    { linkId: "IAD-03", promptText: "Number of individuals that have urinary or faecal incontinence during the reporting period", responseType: "integer", required: true, groupId: "IADS-01", groupName: "Incontinence Care Details" },
    { linkId: "IAD-04", promptText: "Number of individuals that have urinary or faecal incontinence and Incontinence Associated Dermatitis", responseType: "integer", required: true, groupId: "IADS-01", groupName: "Incontinence Care Details" },
    { linkId: "IAD-05", promptText: "Number of individuals that have urinary or faecal incontinence and Incontinence Associated Dermatitis with skin breakdown", responseType: "integer", required: true, groupId: "IADS-01", groupName: "Incontinence Care Details" },
    { linkId: "IAD-06", promptText: "Number of individuals with IAD Category 1A - Persistent redness without clinical signs of infection", responseType: "integer", required: true, groupId: "IADS-02", groupName: "IAD Categorisation" },
    { linkId: "IAD-07", promptText: "Number of individuals with IAD Category 1B - Persistent redness with clinical signs of infection", responseType: "integer", required: true, groupId: "IADS-02", groupName: "IAD Categorisation" },
    { linkId: "IAD-08", promptText: "Number of individuals with IAD Category 2A - Skin loss without clinical signs of infection", responseType: "integer", required: true, groupId: "IADS-02", groupName: "IAD Categorisation" },
    { linkId: "IAD-09", promptText: "Number of individuals with IAD Category 2B - Skin loss with clinical signs of infection", responseType: "integer", required: true, groupId: "IADS-02", groupName: "IAD Categorisation" },
    { linkId: "IAD-10", promptText: "Comments", responseType: "string", required: false, groupId: "IADS-03", groupName: "Additional Details" },
  ],
  HP: [
    { linkId: "HP-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "HPS-01", groupName: "Hospitalisation Details" },
    { linkId: "HP-02", promptText: "Number of individuals that became care recipients from the start of the reporting period", responseType: "integer", required: true, groupId: "HPS-01", groupName: "Hospitalisation Details" },
    { linkId: "HP-03", promptText: "Number of individuals that presented to an emergency department during the reporting period", responseType: "integer", required: true, groupId: "HPS-01", groupName: "Hospitalisation Details" },
    { linkId: "HP-04", promptText: "Number of emergency department presentations during the reporting period", responseType: "integer", required: true, groupId: "HPS-01", groupName: "Hospitalisation Details" },
    { linkId: "HP-05", promptText: "Number of individuals with an unplanned hospitalisation during the reporting period", responseType: "integer", required: true, groupId: "HPS-01", groupName: "Hospitalisation Details" },
    { linkId: "HP-06", promptText: "Number of unplanned hospitalisations during the reporting period", responseType: "integer", required: true, groupId: "HPS-01", groupName: "Hospitalisation Details" },
    { linkId: "HP-07", promptText: "Comments", responseType: "string", required: false, groupId: "HPS-02", groupName: "Additional Details" },
  ],
  WF: [
    { linkId: "WF-01", promptText: "Number of registered nurses who worked any hours in the previous reporting period", responseType: "integer", required: true, groupId: "WFS-01", groupName: "Staff who worked any hours" },
    { linkId: "WF-02", promptText: "Number of enrolled nurses who worked any hours in the previous reporting period", responseType: "integer", required: true, groupId: "WFS-01", groupName: "Staff who worked any hours" },
    { linkId: "WF-03", promptText: "Number of personal care workers who worked any hours in the previous reporting period", responseType: "integer", required: true, groupId: "WFS-01", groupName: "Staff who worked any hours" },
    { linkId: "WF-04", promptText: "Number of other direct care staff who worked any hours in the previous reporting period", responseType: "integer", required: true, groupId: "WFS-01", groupName: "Staff who worked any hours" },
    { linkId: "WF-05", promptText: "Number of registered nurses employed at the start of the reporting period", responseType: "integer", required: true, groupId: "WFS-02", groupName: "Staff employed at start of period" },
    { linkId: "WF-06", promptText: "Number of enrolled nurses employed at the start of the reporting period", responseType: "integer", required: true, groupId: "WFS-02", groupName: "Staff employed at start of period" },
    { linkId: "WF-07", promptText: "Number of personal care workers employed at the start of the reporting period", responseType: "integer", required: true, groupId: "WFS-02", groupName: "Staff employed at start of period" },
    { linkId: "WF-08", promptText: "Number of other direct care staff employed at the start of the reporting period", responseType: "integer", required: true, groupId: "WFS-02", groupName: "Staff employed at start of period" },
    { linkId: "WF-09", promptText: "Number of registered nurses who stopped work during the reporting period", responseType: "integer", required: true, groupId: "WFS-03", groupName: "Staff who stopped work" },
    { linkId: "WF-10", promptText: "Number of enrolled nurses who stopped work during the reporting period", responseType: "integer", required: true, groupId: "WFS-03", groupName: "Staff who stopped work" },
    { linkId: "WF-11", promptText: "Number of personal care workers who stopped work during the reporting period", responseType: "integer", required: true, groupId: "WFS-03", groupName: "Staff who stopped work" },
    { linkId: "WF-12", promptText: "Number of other direct care staff who stopped work during the reporting period", responseType: "integer", required: true, groupId: "WFS-03", groupName: "Staff who stopped work" },
    { linkId: "WF-13", promptText: "Comments", responseType: "string", required: false, groupId: "WFS-04", groupName: "Additional Details" },
  ],
  CE: [
    { linkId: "CEI-01", promptText: "Was a Consumer Experience Assessment completed through self-completion, representative completion, or third party interview during the reporting period", responseType: "boolean", required: true, groupId: "CEIS-01", groupName: "Consumer Experience Details" },
    { linkId: "CEI-02", promptText: "Number of individuals that undertook the Consumer Experience Assessment through self-completion during the reporting period", responseType: "integer", required: true, groupId: "CEIS-01", groupName: "Consumer Experience Details" },
    { linkId: "CEI-03", promptText: "Average score - Having a say in what happens", responseType: "integer", required: true, groupId: "CEIS-02", groupName: "Self-completion scores" },
    { linkId: "CEI-04", promptText: "Average score - Staff are helpful and friendly", responseType: "integer", required: true, groupId: "CEIS-02", groupName: "Self-completion scores" },
    { linkId: "CEI-05", promptText: "Average score - Feeling safe", responseType: "integer", required: true, groupId: "CEIS-02", groupName: "Self-completion scores" },
    { linkId: "CEI-06", promptText: "Average score - Staff know what they are doing", responseType: "integer", required: true, groupId: "CEIS-02", groupName: "Self-completion scores" },
    { linkId: "CEI-07", promptText: "Number of individuals that undertook the Consumer Experience Assessment through representative completion during the reporting period", responseType: "integer", required: true, groupId: "CEIS-03", groupName: "Representative completion" },
    { linkId: "CEI-08", promptText: "Number of individuals that undertook the Consumer Experience Assessment through third party interview during the reporting period", responseType: "integer", required: true, groupId: "CEIS-04", groupName: "Third party interview" },
    { linkId: "CEI-09", promptText: "Comments", responseType: "string", required: false, groupId: "CEIS-05", groupName: "Additional Details" },
  ],
  QOL: [
    { linkId: "QOL-01", promptText: "Was a Quality of Life Assessment completed during the reporting period", responseType: "boolean", required: true, groupId: "QOLS-01", groupName: "Quality of Life Details" },
    { linkId: "QOL-02", promptText: "Number of individuals that undertook the Quality of Life Assessment during the reporting period", responseType: "integer", required: true, groupId: "QOLS-01", groupName: "Quality of Life Details" },
    { linkId: "QOL-03", promptText: "Average score - Mobility", responseType: "integer", required: true, groupId: "QOLS-02", groupName: "Quality of Life scores" },
    { linkId: "QOL-04", promptText: "Average score - Self-care", responseType: "integer", required: true, groupId: "QOLS-02", groupName: "Quality of Life scores" },
    { linkId: "QOL-05", promptText: "Average score - Usual activities", responseType: "integer", required: true, groupId: "QOLS-02", groupName: "Quality of Life scores" },
    { linkId: "QOL-06", promptText: "Average score - Pain/Discomfort", responseType: "integer", required: true, groupId: "QOLS-02", groupName: "Quality of Life scores" },
    { linkId: "QOL-07", promptText: "Average score - Anxiety/Depression", responseType: "integer", required: true, groupId: "QOLS-02", groupName: "Quality of Life scores" },
    { linkId: "QOL-08", promptText: "Comments", responseType: "string", required: false, groupId: "QOLS-03", groupName: "Additional Details" },
  ],
  AH: [
    { linkId: "AH-01", promptText: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true, groupId: "AHS-01", groupName: "Allied Health Details" },
    { linkId: "AH-02", promptText: "Number of individuals that received allied health services during the reporting period", responseType: "integer", required: true, groupId: "AHS-01", groupName: "Allied Health Details" },
    { linkId: "AH-03", promptText: "Percentage of recommended allied health services received", responseType: "integer", required: true, groupId: "AHS-01", groupName: "Allied Health Details" },
    { linkId: "AH-04", promptText: "Total allied health care minutes delivered during the reporting period", responseType: "integer", required: true, groupId: "AHS-01", groupName: "Allied Health Details" },
    { linkId: "AH-05", promptText: "Comments", responseType: "string", required: false, groupId: "AHS-02", groupName: "Additional Details" },
  ],
  EN: [
    { linkId: "EN-01", promptText: "Total enrolled nurse hours during the reporting period", responseType: "integer", required: true, groupId: "ENS-01", groupName: "Enrolled Nursing Details" },
    { linkId: "EN-02", promptText: "Number of care days in the reporting period", responseType: "integer", required: true, groupId: "ENS-01", groupName: "Enrolled Nursing Details" },
    { linkId: "EN-03", promptText: "Comments", responseType: "string", required: false, groupId: "ENS-02", groupName: "Additional Details" },
  ],
  LO: [
    { linkId: "LO-01", promptText: "Total lifestyle officer hours during the reporting period", responseType: "integer", required: true, groupId: "LOS-01", groupName: "Lifestyle Officers Details" },
    { linkId: "LO-02", promptText: "Number of care days in the reporting period", responseType: "integer", required: true, groupId: "LOS-01", groupName: "Lifestyle Officers Details" },
    { linkId: "LO-03", promptText: "Number of lifestyle activities conducted during the reporting period", responseType: "integer", required: true, groupId: "LOS-01", groupName: "Lifestyle Officers Details" },
    { linkId: "LO-04", promptText: "Comments", responseType: "string", required: false, groupId: "LOS-02", groupName: "Additional Details" },
  ],
};

export const getIndicatorCategory = (code: IndicatorCode): string => {
  const indicator = INDICATORS.find(i => i.code === code);
  return indicator?.category || "Clinical";
};
