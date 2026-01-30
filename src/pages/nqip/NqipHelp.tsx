import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, HelpCircle, Info } from "lucide-react";

const NqipHelp = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5" />About NQIP</CardTitle></CardHeader>
        <CardContent className="prose prose-sm text-muted-foreground">
          <p>The National Aged Care Mandatory Quality Indicator Program (NQIP) requires quarterly reporting against 14 quality indicators covering clinical care, consumer experience, and workforce metrics.</p>
          <p>Data must be submitted by the 21st day of the month following each quarter.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Status Definitions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { status: "Not Started", desc: "No data entered yet" },
            { status: "In Progress", desc: "Data entry or review underway" },
            { status: "Submitted", desc: "Successfully submitted before due date" },
            { status: "Late Submission", desc: "Submitted after due date" },
            { status: "Submitted - Updated", desc: "Modified after initial submission" },
          ].map(item => (
            <div key={item.status} className="flex items-center gap-3 text-sm">
              <span className="font-medium w-40">{item.status}</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-lg">External Resources</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" />QI Program Manual</Button>
        <Button variant="outline"><FileText className="mr-2 h-4 w-4" />FHIR API Documentation</Button>
        <Button variant="outline"><HelpCircle className="mr-2 h-4 w-4" />Contact Support</Button>
      </CardContent>
    </Card>
  </div>
);

export default NqipHelp;
