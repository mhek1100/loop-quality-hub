import { validateQuestionnaire, getValidationSummary } from "@/lib/questionnaire";
import { QI_QUESTIONNAIRE, getQuestionCountBySection } from "@/lib/questionnaire/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

const QuestionnaireValidation = () => {
  const result = validateQuestionnaire();
  const questionCounts = getQuestionCountBySection();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QI Questionnaire Validation</h1>
        <p className="text-muted-foreground">Development tool to verify questionnaire definitions match the specification</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.isValid ? (
              <><CheckCircle className="h-5 w-5 text-green-500" /> Validation Passed</>
            ) : (
              <><XCircle className="h-5 w-5 text-red-500" /> Validation Failed</>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{result.totalSections}</div>
              <div className="text-sm text-muted-foreground">Sections</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{result.totalSubSections}</div>
              <div className="text-sm text-muted-foreground">SubSections</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{result.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
          </div>
          {result.issues.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Issues ({result.issues.length})</h3>
              <ul className="space-y-1 text-sm">
                {result.issues.map((issue, idx) => (
                  <li key={idx} className="text-red-600">
                    [{issue.type}] {issue.level}: {issue.linkId} - {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {QI_QUESTIONNAIRE.sections.map(section => (
              <div key={section.code} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{section.text}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <Badge variant="outline">{questionCounts[section.code]} questions</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  SubSections: {section.subSections.map(ss => ss.linkId).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw Validation Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto whitespace-pre-wrap">
            {getValidationSummary()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireValidation;
