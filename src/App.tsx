import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserProvider } from "@/contexts/UserContext";
import Dashboard from "./pages/Dashboard";
import KpiDashboard from "./pages/KpiDashboard";
import Submissions from "./pages/Submissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import QuestionnaireEditor from "./pages/QuestionnaireEditor";
import Questionnaires from "./pages/Questionnaires";
import Pipeline from "./pages/Pipeline";
import Users from "./pages/Users";
import AuditLog from "./pages/AuditLog";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import QuestionnaireValidation from "./pages/QuestionnaireValidation";
import Conformance from "./pages/Conformance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kpi" element={<KpiDashboard />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/submissions/:id" element={<SubmissionDetail />} />
              <Route path="/submissions/:id/indicator/:indicatorCode" element={<QuestionnaireEditor />} />
              <Route path="/questionnaires" element={<Questionnaires />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/users" element={<Users />} />
              <Route path="/audit" element={<AuditLog />} />
              <Route path="/help" element={<Help />} />
              <Route path="/conformance" element={<Conformance />} />
              <Route path="/dev/validation" element={<QuestionnaireValidation />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
