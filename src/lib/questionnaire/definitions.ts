// QI Questionnaire Definitions - Source of Truth
// All question text, linkIds, response types, and required flags are from QI Questionnaire.docx

import { QuestionnaireDefinition, SectionDefinition } from "../types/questionnaire";

// Pressure Injuries Section
const pressureInjuriesSection: SectionDefinition = {
  code: "PI",
  linkId: "PI",
  text: "Pressure Injuries",
  category: "Clinical",
  description: "Data on pressure injuries acquired at the service",
  subSections: [
    {
      linkId: "PIS-01",
      text: "Pressure Injuries Details",
      questions: [
        { linkId: "PI-01", text: "Number of individuals that were assessed for pressure injuries", responseType: "integer", required: true },
        { linkId: "PI-02", text: "Number of individuals that were excluded because of withholding consent to undergo an observational assessment for pressure injuries throughout the reporting period", responseType: "integer", required: true },
        { linkId: "PI-03", text: "Number of individuals that were excluded because of being away from the aged care home throughout the reporting period", responseType: "integer", required: true },
        { linkId: "PI-04", text: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "PIS-02",
      text: "Number of individuals that have pressure injuries reported against:",
      questions: [
        { linkId: "PI-05", text: "Stage 1", responseType: "integer", required: true },
        { linkId: "PI-06", text: "Stage 2", responseType: "integer", required: true },
        { linkId: "PI-07", text: "Stage 3", responseType: "integer", required: true },
        { linkId: "PI-08", text: "Stage 4", responseType: "integer", required: true },
        { linkId: "PI-09", text: "Unstageable - Unclassified Injury", responseType: "integer", required: true },
        { linkId: "PI-10", text: "Suspected Deep Tissue Injury", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "PIS-03",
      text: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against:",
      questions: [
        { linkId: "PI-11", text: "Number of individuals that have one or more pressure injuries acquired outside the approved residential care home during the reporting period reported against: Stage 1", responseType: "integer", required: true },
        { linkId: "PI-12", text: "Stage 2", responseType: "integer", required: true },
        { linkId: "PI-13", text: "Stage 3", responseType: "integer", required: true },
        { linkId: "PI-14", text: "Stage 4", responseType: "integer", required: true },
        { linkId: "PI-15", text: "Unstageable - Unclassified Injury", responseType: "integer", required: true },
        { linkId: "PI-16", text: "Suspected Deep Tissue Injury", responseType: "integer", required: true },
        { linkId: "PI-17", text: "Suspected Deep Tissue Injury", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "PIS-04",
      text: "Additional Details",
      questions: [
        { linkId: "PI-18", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Restrictive Practices Section
const restrictivePracticesSection: SectionDefinition = {
  code: "RP",
  linkId: "RP",
  text: "Restrictive Practices",
  category: "Clinical",
  description: "Use of restrictive practices on care recipients",
  subSections: [
    {
      linkId: "PRS-01",
      text: "Restrictive Practices Details",
      questions: [
        { linkId: "PR-01", text: "The collection date in the collection period", responseType: "date", required: true },
        { linkId: "PR-02", text: "Number of individuals that were assessed for restrictive practices and other restraint types during the reporting period", responseType: "integer", required: true },
        { linkId: "PR-03", text: "Number of individuals that were excluded because of being absent from the service for the full reporting period", responseType: "integer", required: true },
        { linkId: "PR-04", text: "Number of individuals that were subjected to one or more restrictive practice types during the reporting period", responseType: "integer", required: true },
        { linkId: "PR-05", text: "Number of individuals that were subjected to one or more other restraint types that are not restrictive practices during the reporting period and seclusion", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "PRS-02",
      text: "Additional Details",
      questions: [
        { linkId: "PR-06", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Unplanned Weight Loss Section
const unplannedWeightLossSection: SectionDefinition = {
  code: "UPWL",
  linkId: "UPWL",
  text: "Unplanned Weight Loss",
  category: "Clinical",
  description: "Significant and consecutive unplanned weight loss",
  subSections: [
    {
      linkId: "UPWLS-01",
      text: "Significant unplanned weight loss",
      questions: [
        { linkId: "UPWL-01", text: "Number of individuals that stayed overnight at any time during the reporting period that have had significant unplanned weight loss", responseType: "integer", required: true },
        { linkId: "UPWL-02", text: "Number of individuals that became care recipients on or after the first day of the reporting period (new admissions, re-admissions, or transfers into the service)", responseType: "integer", required: true },
        { linkId: "UPWL-03", text: "Number of individuals that became care recipients before the first day of the reporting period but on or after the first day of the previous reporting period (end of life care)", responseType: "integer", required: true },
        { linkId: "UPWL-04", text: "Number of individuals that were excluded because the previous or finishing weights were not recorded, including comments on why any such weights were not recorded", responseType: "integer", required: true },
        { linkId: "UPWL-05", text: "Number of individuals with significant unplanned weight loss that are receiving end of life care or have a documented weight management plan that was successfully implemented during the previous reporting period", responseType: "integer", required: true },
        { linkId: "UPWL-06", text: "Comments", responseType: "string", required: false },
      ]
    },
    {
      linkId: "UPWLS-02",
      text: "Consecutive unplanned weight loss",
      questions: [
        { linkId: "UPWL-08", text: "Number of individuals that stayed overnight at any time during the reporting period that have had consecutive unplanned weight loss", responseType: "integer", required: true },
        { linkId: "UPWL-09", text: "Number of individuals that became care recipients on or after the first day of the previous reporting period because of consecutive unplanned weight loss", responseType: "integer", required: true },
        { linkId: "UPWL-10", text: "Number of individuals that became care recipients before the first day of the previous reporting period that received end of life care", responseType: "integer", required: true },
        { linkId: "UPWL-11", text: "Number of individuals that were excluded because they do not have a current weight management plan or the weight management plan was not successfully implemented", responseType: "integer", required: true },
        { linkId: "UPWL-12", text: "Number of individuals with consecutive unplanned weight loss where the decrease in weight between consecutive weight measurements is less than 5%", responseType: "integer", required: true },
        { linkId: "UPWL-13", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Falls and Major Injury Section
const fallsAndMajorInjurySection: SectionDefinition = {
  code: "FMI",
  linkId: "FMI",
  text: "Falls and Major Injury",
  category: "Clinical",
  description: "Falls experienced by care recipients and resulting injuries",
  subSections: [
    {
      linkId: "FMIS-01",
      text: "Falls and Major Injury Details",
      questions: [
        { linkId: "FMI-01", text: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true },
        { linkId: "FMI-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "FMI-03", text: "Number of individuals that experienced one or more falls during the reporting period", responseType: "integer", required: true },
        { linkId: "FMI-04", text: "Number of individuals that experienced one or more falls that resulted in a major injury during the reporting period", responseType: "integer", required: true },
        { linkId: "FMI-05", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Medication Management Section
const medicationManagementSection: SectionDefinition = {
  code: "MM",
  linkId: "MM",
  text: "Medication Management",
  category: "Clinical",
  description: "Polypharmacy and antipsychotic medication use",
  subSections: [
    {
      linkId: "MMS-01",
      text: "Polypharmacy",
      questions: [
        { linkId: "MM-01", text: "The collection date in the collection period", responseType: "date", required: true },
        { linkId: "MM-02", text: "Number of individuals that were assessed for polypharmacy during the reporting period", responseType: "integer", required: true },
        { linkId: "MM-03", text: "Number of individuals that were excluded because of being away from the aged care home throughout the collection day", responseType: "integer", required: true },
        { linkId: "MM-04", text: "Number of individuals prescribed 9 or more medications including medicines received via administration, charts, including changes to PRN medicines, and those taken by administration date", responseType: "integer", required: true },
        { linkId: "MM-05", text: "Comments", responseType: "string", required: false },
      ]
    },
    {
      linkId: "MMS-02",
      text: "Antipsychotics",
      questions: [
        { linkId: "MM-07", text: "The collection date in the collection period", responseType: "date", required: true },
        { linkId: "MM-08", text: "Number of individuals that were assessed for antipsychotic medication use during the reporting period", responseType: "integer", required: true },
        { linkId: "MM-09", text: "Number of individuals that were excluded because of being away from the aged care home throughout the collection day", responseType: "integer", required: true },
        { linkId: "MM-10", text: "Number of individuals that were prescribed and administered one or more antipsychotic medications including changes to PRN medicines, and those taken by administration date", responseType: "integer", required: true },
        { linkId: "MM-11", text: "Number of individuals that were prescribed and administered one or more antipsychotic medications, that were continued based on the most recent review, for a condition associated with the medication and the recorded collection date", responseType: "integer", required: true },
        { linkId: "MM-12", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Activities of Daily Living Section
const activitiesOfDailyLivingSection: SectionDefinition = {
  code: "ADL",
  linkId: "ADL",
  text: "Activities of Daily Living (ADLs)",
  category: "Clinical",
  description: "Decline in activities of daily living",
  subSections: [
    {
      linkId: "ADLS-01",
      text: "Activities of Daily Living Details",
      questions: [
        { linkId: "ADL-01", text: "Number of individuals that stayed overnight at any time during the reporting period that had their activities of daily living functional status assessed", responseType: "integer", required: true },
        { linkId: "ADL-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "ADL-03", text: "Number of individuals that had their activities of daily living functional status assessed and reported as being at the end of life", responseType: "integer", required: true },
        { linkId: "ADL-04", text: "Number of individuals that had their activities of daily living functional status assessed and reported as having a progressive, life limiting, or receiving palliative care or medical condition", responseType: "integer", required: true },
        { linkId: "ADL-05", text: "Number of individuals that had a decline in activities of daily living functional status that was successfully addressed with a care or services plan as a result of the assessment", responseType: "integer", required: true },
        { linkId: "ADL-06", text: "Number of individuals with a decline in activities of daily living functional status that was not addressed by the care or services plan", responseType: "integer", required: true },
        { linkId: "ADL-07", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Incontinence Care Section
const incontinenceCareSection: SectionDefinition = {
  code: "IAD",
  linkId: "IAD",
  text: "Incontinence Care",
  category: "Clinical",
  description: "Incontinence associated dermatitis",
  subSections: [
    {
      linkId: "IADS-01",
      text: "Incontinence Care Details",
      questions: [
        { linkId: "IAD-01", text: "Number of individuals that stayed overnight at any time during the reporting period that have urinary or faecal incontinence", responseType: "integer", required: true },
        { linkId: "IAD-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "IAD-03", text: "Number of individuals that have urinary or faecal incontinence during the reporting period", responseType: "integer", required: true },
        { linkId: "IAD-04", text: "Number of individuals that have incontinence and Incontinence Associated Dermatitis", responseType: "integer", required: true },
        { linkId: "IAD-05", text: "Number of individuals that have incontinence and Incontinence Associated Dermatitis with skin breakdown", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "IADS-02",
      text: "Number of individuals that have incontinence and Incontinence Associated Dermatitis reported against one or more of the four Ghent Global Incontinence Associated Dermatitis Categorisation Tool sub-categories:",
      questions: [
        { linkId: "IAD-06", text: "Category 1A - Persistent redness without clinical signs of infection", responseType: "integer", required: true },
        { linkId: "IAD-07", text: "Category 1B - Persistent redness with clinical signs of infection", responseType: "integer", required: true },
        { linkId: "IAD-08", text: "Category 2A - Skin loss without clinical signs of infection", responseType: "integer", required: true },
        { linkId: "IAD-09", text: "Category 2B - Skin loss with clinical signs of infection", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "IADS-03",
      text: "Additional Details",
      questions: [
        { linkId: "IAD-10", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Hospitalisation Section
const hospitalisationSection: SectionDefinition = {
  code: "HP",
  linkId: "HP",
  text: "Hospitalisation",
  category: "Clinical",
  description: "Emergency department presentations and unplanned hospitalisations",
  subSections: [
    {
      linkId: "HPS-01",
      text: "Hospitalisation Details",
      questions: [
        { linkId: "HP-01", text: "Number of individuals that stayed overnight at any time during the reporting period", responseType: "integer", required: true },
        { linkId: "HP-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "HP-03", text: "Number of individuals that presented to an emergency department during the reporting period", responseType: "integer", required: true },
        { linkId: "HP-04", text: "Number of emergency department presentations during the reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "HPS-02",
      text: "Additional Details",
      questions: [
        { linkId: "HP-05", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Workforce Section
const workforceSection: SectionDefinition = {
  code: "WF",
  linkId: "WF",
  text: "Workforce",
  category: "Workforce",
  description: "Staff numbers and turnover",
  subSections: [
    {
      linkId: "WFS-01",
      text: "Staff who worked any hours in previous reporting period",
      questions: [
        { linkId: "WF-01", text: "Number of registered nurses who had worked any hours in direct care, or in a role supporting direct care delivery at the service premises during the previous reporting period", responseType: "integer", required: true },
        { linkId: "WF-02", text: "Number of enrolled nurses who had worked any hours in direct care, or in a role supporting direct care delivery at the service premises during the previous reporting period", responseType: "integer", required: true },
        { linkId: "WF-03", text: "Number of personal care workers who had worked any hours in direct care, or in a role supporting direct care delivery at the service premises during the previous reporting period", responseType: "integer", required: true },
        { linkId: "WF-04", text: "Number of other direct care workers who had worked any hours in direct care, or in a role supporting direct care delivery at the service premises during the previous reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "WFS-02",
      text: "Staff who were employed at the start of the reporting period",
      questions: [
        { linkId: "WF-05", text: "Number of registered nurses who were employed at the start of the reporting period in direct care, or in a role supporting direct care delivery at the service premises who had worked any hours during the reporting period", responseType: "integer", required: true },
        { linkId: "WF-06", text: "Number of enrolled nurses who were employed at the start of the reporting period in direct care, or in a role supporting direct care delivery at the service premises who had worked any hours during the reporting period", responseType: "integer", required: true },
        { linkId: "WF-07", text: "Number of personal care workers who were employed at the start of the reporting period in direct care, or in a role supporting direct care delivery at the service premises who had worked any hours during the reporting period", responseType: "integer", required: true },
        { linkId: "WF-08", text: "Number of other direct care workers who were employed at the start of the reporting period in direct care, or in a role supporting direct care delivery at the service premises who had worked any hours during the reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "WFS-03",
      text: "Staff employed who stopped work during the reporting period",
      questions: [
        { linkId: "WF-09", text: "Number of registered nurses who were employed in direct care, or in a role supporting direct care delivery at the service who stopped working during the reporting period for any reason including contract workers and enrolled nurses", responseType: "integer", required: true },
        { linkId: "WF-10", text: "Number of enrolled nurses who were employed in direct care, or in a role supporting direct care delivery at the service who stopped working during the reporting period for any reason including contract workers", responseType: "integer", required: true },
        { linkId: "WF-11", text: "Number of personal care workers who were employed in direct care, or in a role supporting direct care delivery at the service who stopped working during the reporting period for any reason including contract workers and enrolled nurses", responseType: "integer", required: true },
        { linkId: "WF-12", text: "Number of other direct care workers who were employed in direct care, or in a role supporting direct care delivery at the service who stopped working during the reporting period for any reason including contract workers, personal care workers or other allied health staff", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "WFS-04",
      text: "Additional Details",
      questions: [
        { linkId: "WF-13", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Consumer Experience Section
const consumerExperienceSection: SectionDefinition = {
  code: "CEI",
  linkId: "CEI",
  text: "Consumer Experience",
  category: "Experience",
  description: "Consumer experience assessment results",
  subSections: [
    {
      linkId: "CEIS-01",
      text: "Consumer Experience Details",
      questions: [
        { linkId: "CEI-01", text: "Number of individuals that undertook the Consumer Experience Assessment through self-completion, representative completion, interviewer facilitated completion, or proxy-completion during the reporting period", responseType: "integer", required: true },
        { linkId: "CEI-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "CEI-03", text: "Number of individuals that undertook the Consumer Experience Assessment through self-completion during the reporting period", responseType: "integer", required: true },
        { linkId: "CEI-04", text: "Number of individuals that undertook the Assessment through self-completion during the reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "CEIS-02",
      text: "Number of individuals that undertook the Consumer Experience Assessment through self-completion during the reporting period and reported against",
      questions: [
        { linkId: "CEI-05", text: "Good (individuals who score between 19 and 21)", responseType: "integer", required: true },
        { linkId: "CEI-06", text: "Moderate (individuals who score between 16 and 18)", responseType: "integer", required: true },
        { linkId: "CEI-07", text: "Poor (individuals who score between 13 and 15)", responseType: "integer", required: true },
        { linkId: "CEI-08", text: "Very Poor (individuals who score between 0 and 12)", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "CEIS-03",
      text: "Number of individuals that undertook the Consumer Experience Assessment through interviewer facilitated completion during the reporting period and reported against",
      questions: [
        { linkId: "CEI-09", text: "Excellent (individuals who score between 22 and 24)", responseType: "integer", required: true },
        { linkId: "CEI-10", text: "Good (individuals who score between 19 and 21)", responseType: "integer", required: true },
        { linkId: "CEI-11", text: "Moderate (individuals who score between 16 and 18)", responseType: "integer", required: true },
        { linkId: "CEI-12", text: "Poor (individuals who score between 13 and 15)", responseType: "integer", required: true },
        { linkId: "CEI-13", text: "Very Poor (individuals who score between 0 and 12)", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "CEIS-04",
      text: "Number of individuals that undertook the Consumer Experience Assessment through proxy-completion during the reporting period and reported against",
      questions: [
        { linkId: "CEI-14", text: "Excellent (individuals who score between 22 and 24)", responseType: "integer", required: true },
        { linkId: "CEI-15", text: "Good (individuals who score between 19 and 21)", responseType: "integer", required: true },
        { linkId: "CEI-16", text: "Moderate (individuals who score between 13 and 18)", responseType: "integer", required: true },
        { linkId: "CEI-17", text: "Poor (individuals who score between 7 and 12)", responseType: "integer", required: true },
        { linkId: "CEI-18", text: "Very Poor (individuals who score between 0 and 6)", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "CEIS-05",
      text: "Additional Details",
      questions: [
        { linkId: "CEI-19", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Quality of Life Section
const qualityOfLifeSection: SectionDefinition = {
  code: "QOL",
  linkId: "QOL",
  text: "Quality of life",
  category: "Experience",
  description: "Quality of life assessment results",
  subSections: [
    {
      linkId: "QOLS-01",
      text: "Quality of Life Details",
      questions: [
        { linkId: "QOL-01", text: "Number of individuals that undertook the Quality of Life Assessment through self-completion, representative completion, interviewer facilitated completion, or proxy-completion during the reporting period", responseType: "integer", required: true },
        { linkId: "QOL-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "QOL-03", text: "Number of individuals that were excluded because of being away from the aged care home during the reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "QOLS-02",
      text: "Number of individuals that undertook the Quality of Life Assessment through self-completion during the reporting period and reported against",
      questions: [
        { linkId: "QOL-04", text: "Excellent (individuals who score between 90 and 100)", responseType: "integer", required: true },
        { linkId: "QOL-05", text: "Good (individuals who score between 70 and 89)", responseType: "integer", required: true },
        { linkId: "QOL-06", text: "Moderate (individuals who score between 50 and 69)", responseType: "integer", required: true },
        { linkId: "QOL-07", text: "Poor (individuals who score between 25 and 49)", responseType: "integer", required: true },
        { linkId: "QOL-08", text: "Very Poor (individuals who score between 0 and 24)", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "QOLS-03",
      text: "Number of individuals that undertook the Quality of Life Assessment through interviewer facilitated completion during the reporting period and reported against",
      questions: [
        { linkId: "QOL-09", text: "Excellent (individuals who score between 90 and 100)", responseType: "integer", required: true },
        { linkId: "QOL-10", text: "Good (individuals who score between 70 and 89)", responseType: "integer", required: true },
        { linkId: "QOL-11", text: "Moderate (individuals who score between 50 and 69)", responseType: "integer", required: true },
        { linkId: "QOL-12", text: "Poor (individuals who score between 25 and 49)", responseType: "integer", required: true },
        { linkId: "QOL-13", text: "Very Poor (individuals who score between 0 and 24)", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "QOLS-04",
      text: "Number of individuals that undertook the Quality of Life Assessment through proxy-completion during the reporting period and reported against",
      questions: [
        { linkId: "QOL-14", text: "Excellent (individuals who score between 90 and 100)", responseType: "integer", required: true },
        { linkId: "QOL-15", text: "Good (individuals who score between 70 and 89)", responseType: "integer", required: true },
        { linkId: "QOL-16", text: "Moderate (individuals who score between 50 and 69)", responseType: "integer", required: true },
        { linkId: "QOL-17", text: "Poor (individuals who score between 25 and 49)", responseType: "integer", required: true },
        { linkId: "QOL-18", text: "Very Poor (individuals who score between 0 and 24)", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "QOLS-05",
      text: "Additional Details",
      questions: [
        { linkId: "QOL-19", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Allied Health Section
const alliedHealthSection: SectionDefinition = {
  code: "AH",
  linkId: "AH",
  text: "Allied Health",
  category: "Workforce",
  description: "Allied health services received",
  subSections: [
    {
      linkId: "AHS-01",
      text: "Allied Health Details",
      questions: [
        { linkId: "AH-01", text: "Number of individuals that stayed overnight at any time during the reporting period that received any allied health services delivered by an allied health professional during the reporting period", responseType: "integer", required: true },
        { linkId: "AH-02", text: "Number of individuals that became care recipients from the aged care home during the reporting period", responseType: "integer", required: true },
        { linkId: "AH-03", text: "Number of individuals that received any allied health services delivered by an allied health professional during the reporting period", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "AHS-02",
      text: "Number of allied health services delivered by an allied health professional that were recommended through a care and services plan:",
      questions: [
        { linkId: "AH-04", text: "Physiotherapy", responseType: "integer", required: true },
        { linkId: "AH-05", text: "Number of allied health services that were received - Physiotherapy", responseType: "integer", required: true },
        { linkId: "AH-06", text: "Occupational therapy - were recommended through a care and services plan", responseType: "integer", required: true },
        { linkId: "AH-07", text: "Number of allied health services that were received - Occupational therapy", responseType: "integer", required: true },
        { linkId: "AH-08", text: "Speech pathology - were recommended through a care and services plan", responseType: "integer", required: true },
        { linkId: "AH-09", text: "Number of allied health services that were received - Speech pathology", responseType: "integer", required: true },
        { linkId: "AH-10", text: "Social work - were recommended through a care and services plan", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "AHS-03",
      text: "Number of allied health services delivered by an allied health professional recommended allied health services received:",
      questions: [
        { linkId: "AH-11", text: "Number of allied health services delivered by an allied health professional that were recommended through a care and services plan and were received", responseType: "integer", required: true },
        { linkId: "AH-12", text: "Number of allied health services that were received - Physiotherapy", responseType: "integer", required: true },
        { linkId: "AH-13", text: "Number of allied health services that were received - Occupational therapy", responseType: "integer", required: true },
        { linkId: "AH-14", text: "Number of allied health services that were received - Speech pathology", responseType: "integer", required: true },
        { linkId: "AH-15", text: "Number of allied health services that were received - Podiatry", responseType: "integer", required: true },
        { linkId: "AH-16", text: "Number of allied health services that were received - Dietetics", responseType: "integer", required: true },
        { linkId: "AH-17", text: "Number of allied health services that were received - Mental health or psychology", responseType: "integer", required: true },
        { linkId: "AH-18", text: "Number of allied health services that were received - Other allied health services", responseType: "integer", required: true },
      ]
    },
    {
      linkId: "AHS-04",
      text: "Additional Details",
      questions: [
        { linkId: "AH-19", text: "Comments", responseType: "string", required: false },
      ]
    }
  ]
};

// Main Questionnaire Definition
export const QI_QUESTIONNAIRE: QuestionnaireDefinition = {
  id: "nqip-qi-questionnaire-v1",
  title: "National Aged Care Mandatory Quality Indicator Program (NQIP) Questionnaire",
  version: "1.0.0",
  sections: [
    pressureInjuriesSection,
    restrictivePracticesSection,
    unplannedWeightLossSection,
    fallsAndMajorInjurySection,
    medicationManagementSection,
    activitiesOfDailyLivingSection,
    incontinenceCareSection,
    hospitalisationSection,
    workforceSection,
    consumerExperienceSection,
    qualityOfLifeSection,
    alliedHealthSection,
  ]
};

// Helper functions
export const getSectionByCode = (code: string): SectionDefinition | undefined => {
  return QI_QUESTIONNAIRE.sections.find(s => s.code === code);
};

export const getSubSectionByLinkId = (sectionCode: string, subSectionLinkId: string): { section: SectionDefinition; subSection: any } | undefined => {
  const section = getSectionByCode(sectionCode);
  if (!section) return undefined;
  const subSection = section.subSections.find(ss => ss.linkId === subSectionLinkId);
  if (!subSection) return undefined;
  return { section, subSection };
};

export const getQuestionByLinkId = (linkId: string): { section: SectionDefinition; subSection: any; question: any } | undefined => {
  for (const section of QI_QUESTIONNAIRE.sections) {
    for (const subSection of section.subSections) {
      const question = subSection.questions.find(q => q.linkId === linkId);
      if (question) {
        return { section, subSection, question };
      }
    }
  }
  return undefined;
};

export const getAllQuestions = (): Array<{ section: SectionDefinition; subSection: any; question: any }> => {
  const questions: Array<{ section: SectionDefinition; subSection: any; question: any }> = [];
  for (const section of QI_QUESTIONNAIRE.sections) {
    for (const subSection of section.subSections) {
      for (const question of subSection.questions) {
        questions.push({ section, subSection, question });
      }
    }
  }
  return questions;
};

export const getQuestionCountBySection = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const section of QI_QUESTIONNAIRE.sections) {
    counts[section.code] = section.subSections.reduce((sum, ss) => sum + ss.questions.length, 0);
  }
  return counts;
};
