import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Building2, Truck, CreditCard, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiVariable {
  id: string;
  label: string;
  description: string;
  value: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
  icon: React.ElementType;
  category: string;
}

const defaultVariables: ApiVariable[] = [
  {
    id: "registered_provider_id",
    label: "Registered Provider ID",
    description: "Unique identifier for the registered healthcare provider",
    value: "RP-2024-001",
    type: "text",
    icon: Building2,
    category: "Provider",
  },
  {
    id: "registered_provider_name",
    label: "Registered Provider Name",
    description: "Legal name of the registered provider organization",
    value: "Metro Health Services Pty Ltd",
    type: "text",
    icon: Building2,
    category: "Provider",
  },
  {
    id: "service_delivery_entity_id",
    label: "Service Delivery Entity ID",
    description: "Identifier for the entity delivering healthcare services",
    value: "SDE-VIC-0042",
    type: "text",
    icon: Truck,
    category: "Service Delivery",
  },
  {
    id: "service_delivery_entity_name",
    label: "Service Delivery Entity Name",
    description: "Name of the service delivery organization",
    value: "Eastern Region Primary Care Network",
    type: "text",
    icon: Truck,
    category: "Service Delivery",
  },
  {
    id: "program_payment_entity_id",
    label: "Program Payment Entity ID",
    description: "Identifier for the program payment processing entity",
    value: "PPE-FED-0018",
    type: "text",
    icon: CreditCard,
    category: "Payment",
  },
  {
    id: "program_payment_entity_name",
    label: "Program Payment Entity Name",
    description: "Name of the payment processing entity",
    value: "Department of Health Payment Services",
    type: "text",
    icon: CreditCard,
    category: "Payment",
  },
  {
    id: "api_environment",
    label: "API Environment",
    description: "Target environment for government API submissions",
    value: "staging",
    type: "select",
    options: [
      { value: "development", label: "Development" },
      { value: "staging", label: "Staging" },
      { value: "production", label: "Production" },
    ],
    icon: Globe,
    category: "API",
  },
  {
    id: "api_version",
    label: "API Version",
    description: "Government API version to use for submissions",
    value: "v2",
    type: "select",
    options: [
      { value: "v1", label: "v1 (Legacy)" },
      { value: "v2", label: "v2 (Current)" },
      { value: "v3-beta", label: "v3 (Beta)" },
    ],
    icon: Globe,
    category: "API",
  },
];

export default function NqipApiVariables() {
  const [variables, setVariables] = useState<ApiVariable[]>(defaultVariables);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (id: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value } : v))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "API variables have been updated successfully.",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setVariables(defaultVariables);
    setHasChanges(false);
    toast({
      title: "Settings reset",
      description: "API variables have been reset to defaults.",
    });
  };

  const groupedVariables = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, ApiVariable[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">API Variables</h2>
          <p className="text-sm text-muted-foreground">
            Configure variables passed to government APIs during submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {Object.entries(groupedVariables).map(([category, categoryVariables]) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{category}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {categoryVariables.length} variable{categoryVariables.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <CardDescription>
              {category === "Provider" && "Registered provider identification details"}
              {category === "Service Delivery" && "Service delivery entity configuration"}
              {category === "Payment" && "Program payment entity settings"}
              {category === "API" && "Government API connection settings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryVariables.map((variable) => (
              <div key={variable.id} className="grid gap-2">
                <div className="flex items-center gap-2">
                  <variable.icon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor={variable.id} className="font-medium">
                    {variable.label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground -mt-1 ml-6">
                  {variable.description}
                </p>
                {variable.type === "select" ? (
                  <Select
                    value={variable.value}
                    onValueChange={(value) => handleChange(variable.id, value)}
                  >
                    <SelectTrigger className="ml-6 max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {variable.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={variable.id}
                    value={variable.value}
                    onChange={(e) => handleChange(variable.id, e.target.value)}
                    className="ml-6 max-w-md"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
