// QI Questionnaire Types following FHIR structure
// Hierarchy: Questionnaire → Section (Level 1) → SubSection (Level 2) → Question (Level 3)

export type SectionCode = 
  | "PI"   // Pressure Injuries
  | "RP"   // Restrictive Practices
  | "UPWL" // Unplanned Weight Loss
  | "FMI"  // Falls and Major Injury
  | "MM"   // Medication Management
  | "ADL"  // Activities of Daily Living
  | "IAD"  // Incontinence Care (Incontinence Associated Dermatitis)
  | "HP"   // Hospitalisation
  | "WF"   // Workforce
  | "CEI"  // Consumer Experience
  | "QOL"  // Quality of Life
  | "AH";  // Allied Health

export type ResponseType = "integer" | "string" | "date" | "boolean";

export interface QuestionDefinition {
  linkId: string;
  text: string;
  responseType: ResponseType;
  required: boolean;
}

export interface SubSectionDefinition {
  linkId: string;
  text: string;
  questions: QuestionDefinition[];
}

export interface SectionDefinition {
  code: SectionCode;
  linkId: string;
  text: string;
  category: "Clinical" | "Experience" | "Workforce";
  description: string;
  subSections: SubSectionDefinition[];
}

export interface QuestionnaireDefinition {
  id: string;
  title: string;
  version: string;
  sections: SectionDefinition[];
}

// QuestionnaireResponse types
export interface QuestionAnswer {
  linkId: string;
  text: string;
  responseType: ResponseType;
  required: boolean;
  autoValue: string | number | boolean | null;
  userValue: string | number | boolean | null;
  finalValue: string | number | boolean | null;
  isOverridden: boolean;
  warnings: string[];
  errors: string[];
}

export interface SubSectionResponse {
  linkId: string;
  text: string;
  questions: QuestionAnswer[];
}

export interface SectionResponse {
  code: SectionCode;
  linkId: string;
  text: string;
  subSections: SubSectionResponse[];
  status: "Not Started" | "Draft" | "Ready for Review" | "Reviewed" | "Submitted";
  validationStatus: "OK" | "Warnings" | "Errors";
}

export interface QuestionnaireResponseData {
  id: string;
  questionnaireId: string;
  submissionId: string;
  sections: SectionResponse[];
  createdAt: string;
  updatedAt: string;
  comments: string;
}

// Helper type to get flat questions for a section
export interface FlatQuestion extends QuestionDefinition {
  sectionCode: SectionCode;
  sectionText: string;
  subSectionLinkId: string;
  subSectionText: string;
}
