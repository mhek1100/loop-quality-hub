import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Facilities
const facilities = ["Johnsonchester", "New Ashleychester", "North Ryan", "Rileyville"];

// Quarters with date ranges
const quarters = [
  { id: "Q1", label: "Q1 (1 July 2025 - 30 September 2025)" },
  { id: "Q2", label: "Q2 (1 October 2025 - 31 December 2025)" },
  { id: "Q3", label: "Q3 (1 January 2026 - 31 March 2026)" },
  { id: "Q4", label: "Q4 (1 April 2026 - 30 June 2026)" },
];

// Labor Cost data (percentages)
const laborCostData: Record<string, Record<string, { total: number; enpc: number; rn: number }>> = {
  Q1: {
    Johnsonchester: { total: 89, enpc: 93, rn: 77 },
    "New Ashleychester": { total: 82, enpc: 82, rn: 84 },
    "North Ryan": { total: 77, enpc: 79, rn: 70 },
    Rileyville: { total: 86, enpc: 88, rn: 77 },
  },
  Q2: {
    Johnsonchester: { total: 0, enpc: 0, rn: 0 },
    "New Ashleychester": { total: 0, enpc: 0, rn: 0 },
    "North Ryan": { total: 0, enpc: 0, rn: 0 },
    Rileyville: { total: 0, enpc: 0, rn: 0 },
  },
  Q3: {
    Johnsonchester: { total: 101, enpc: 104, rn: 91 },
    "New Ashleychester": { total: 97, enpc: 94, rn: 105 },
    "North Ryan": { total: 88, enpc: 89, rn: 83 },
    Rileyville: { total: 97, enpc: 98, rn: 91 },
  },
  Q4: {
    Johnsonchester: { total: 98, enpc: 104, rn: 76 },
    "New Ashleychester": { total: 91, enpc: 94, rn: 81 },
    "North Ryan": { total: 84, enpc: 88, rn: 70 },
    Rileyville: { total: 93, enpc: 97, rn: 79 },
  },
};

// Labor Hours data
const laborHoursData: Record<string, Record<string, { total: number; enpc: number; rn: number }>> = {
  Q1: {
    Johnsonchester: { total: 44135, enpc: 35849, rn: 8286 },
    "New Ashleychester": { total: 25734, enpc: 19788, rn: 5946 },
    "North Ryan": { total: 39025, enpc: 31298, rn: 7727 },
    Rileyville: { total: 42743, enpc: 34368, rn: 8375 },
  },
  Q2: {
    Johnsonchester: { total: 0, enpc: 0, rn: 0 },
    "New Ashleychester": { total: 0, enpc: 0, rn: 0 },
    "North Ryan": { total: 0, enpc: 0, rn: 0 },
    Rileyville: { total: 0, enpc: 0, rn: 0 },
  },
  Q3: {
    Johnsonchester: { total: 48788, enpc: 39419, rn: 9369 },
    "New Ashleychester": { total: 26846, enpc: 20321, rn: 6525 },
    "North Ryan": { total: 43130, enpc: 34326, rn: 8804 },
    Rileyville: { total: 47006, enpc: 37507, rn: 9498 },
  },
  Q4: {
    Johnsonchester: { total: 48135, enpc: 39696, rn: 8439 },
    "New Ashleychester": { total: 26862, enpc: 21132, rn: 5730 },
    "North Ryan": { total: 42307, enpc: 34367, rn: 7941 },
    Rileyville: { total: 46287, enpc: 37504, rn: 8783 },
  },
};

// Calculate grand totals for cost (average)
const calculateCostGrandTotal = (quarterId: string, field: "total" | "enpc" | "rn") => {
  const values = facilities.map((f) => laborCostData[quarterId][f][field]);
  const nonZeroValues = values.filter((v) => v > 0);
  if (nonZeroValues.length === 0) return 0;
  return Math.round(nonZeroValues.reduce((a, b) => a + b, 0) / nonZeroValues.length);
};

// Calculate grand totals for hours (sum)
const calculateHoursGrandTotal = (quarterId: string, field: "total" | "enpc" | "rn") => {
  return facilities.reduce((sum, f) => sum + laborHoursData[quarterId][f][field], 0);
};

export default function PerformanceStatementTableau() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Care Minutes Performance Statement 2025-26</h1>
        <p className="text-muted-foreground mt-1">
          Quarterly labor cost and hours breakdown by facility
        </p>
      </div>

      {/* Labor Cost Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Labor Cost: Direct Care (Employee and Agency)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px] bg-muted/30"></TableHead>
                  {facilities.map((facility) => (
                    <TableHead
                      key={facility}
                      className="text-center text-white bg-violet-600 font-medium"
                    >
                      {facility}
                    </TableHead>
                  ))}
                  <TableHead className="text-center text-white bg-zinc-700 font-semibold">
                    Grand Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quarters.map((quarter, qIndex) => (
                  <React.Fragment key={quarter.id}>
                    {/* Quarter Total Row */}
                    <TableRow className={cn(
                      "hover:bg-muted/30",
                      qIndex % 2 === 0 ? "bg-muted/20" : "bg-background"
                    )}>
                      <TableCell className="font-medium">{quarter.label}</TableCell>
                      {facilities.map((facility) => (
                        <TableCell key={facility} className="text-right tabular-nums">
                          {laborCostData[quarter.id][facility].total}%
                        </TableCell>
                      ))}
                      <TableCell className="text-right tabular-nums font-semibold bg-muted/40">
                        {calculateCostGrandTotal(quarter.id, "total")}%
                      </TableCell>
                    </TableRow>
                    {/* Enrolled Nurse/Personal Care Row */}
                    <TableRow className={cn(
                      "hover:bg-muted/30",
                      qIndex % 2 === 0 ? "bg-muted/10" : "bg-background"
                    )}>
                      <TableCell className="pl-8 text-muted-foreground">
                        Enrolled Nurse/Personal Care
                      </TableCell>
                      {facilities.map((facility) => (
                        <TableCell key={facility} className="text-right tabular-nums">
                          {laborCostData[quarter.id][facility].enpc}%
                        </TableCell>
                      ))}
                      <TableCell className="text-right tabular-nums font-semibold bg-muted/40">
                        {calculateCostGrandTotal(quarter.id, "enpc")}%
                      </TableCell>
                    </TableRow>
                    {/* Registered Nurse Row */}
                    <TableRow className={cn(
                      "hover:bg-muted/30",
                      qIndex % 2 === 0 ? "bg-muted/10" : "bg-background"
                    )}>
                      <TableCell className="pl-8 text-muted-foreground">
                        Registered Nurse
                      </TableCell>
                      {facilities.map((facility) => (
                        <TableCell key={facility} className="text-right tabular-nums">
                          {laborCostData[quarter.id][facility].rn}%
                        </TableCell>
                      ))}
                      <TableCell className="text-right tabular-nums font-semibold bg-muted/40">
                        {calculateCostGrandTotal(quarter.id, "rn")}%
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Labor Hours Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Labor Hours: Direct Care (Employee and Agency)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px] bg-muted/30"></TableHead>
                  {facilities.map((facility) => (
                    <TableHead
                      key={facility}
                      className="text-center text-white bg-violet-600 font-medium"
                    >
                      {facility}
                    </TableHead>
                  ))}
                  <TableHead className="text-center text-white bg-zinc-700 font-semibold">
                    Grand Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quarters.map((quarter, qIndex) => (
                  <React.Fragment key={quarter.id}>
                    {/* Quarter Total Row */}
                    <TableRow className={cn(
                      "hover:bg-muted/30",
                      qIndex % 2 === 0 ? "bg-muted/20" : "bg-background"
                    )}>
                      <TableCell className="font-medium">{quarter.label}</TableCell>
                      {facilities.map((facility) => (
                        <TableCell key={facility} className="text-right tabular-nums">
                          {laborHoursData[quarter.id][facility].total.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="text-right tabular-nums font-semibold bg-muted/40">
                        {calculateHoursGrandTotal(quarter.id, "total").toLocaleString()}
                      </TableCell>
                    </TableRow>
                    {/* Enrolled Nurse/Personal Care Row */}
                    <TableRow className={cn(
                      "hover:bg-muted/30",
                      qIndex % 2 === 0 ? "bg-muted/10" : "bg-background"
                    )}>
                      <TableCell className="pl-8 text-muted-foreground">
                        Enrolled Nurse/Personal Care
                      </TableCell>
                      {facilities.map((facility) => (
                        <TableCell key={facility} className="text-right tabular-nums">
                          {laborHoursData[quarter.id][facility].enpc.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="text-right tabular-nums font-semibold bg-muted/40">
                        {calculateHoursGrandTotal(quarter.id, "enpc").toLocaleString()}
                      </TableCell>
                    </TableRow>
                    {/* Registered Nurse Row */}
                    <TableRow className={cn(
                      "hover:bg-muted/30",
                      qIndex % 2 === 0 ? "bg-muted/10" : "bg-background"
                    )}>
                      <TableCell className="pl-8 text-muted-foreground">
                        Registered Nurse
                      </TableCell>
                      {facilities.map((facility) => (
                        <TableCell key={facility} className="text-right tabular-nums">
                          {laborHoursData[quarter.id][facility].rn.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="text-right tabular-nums font-semibold bg-muted/40">
                        {calculateHoursGrandTotal(quarter.id, "rn").toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
