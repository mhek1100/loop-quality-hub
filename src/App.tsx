import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserProvider } from "@/contexts/UserContext";
import { SubmissionsStoreProvider } from "@/contexts/SubmissionsStoreContext";
import KpiDashboard from "./pages/KpiDashboard";
import Submissions from "./pages/Submissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import QuestionnaireEditor from "./pages/QuestionnaireEditor";
import AuditLog from "./pages/AuditLog";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import QuestionnaireValidation from "./pages/QuestionnaireValidation";

// Settings pages
import SettingsLayout from "./pages/settings/SettingsLayout";
import ApiVariables from "./pages/settings/ApiVariables";
import SettingsPipeline from "./pages/settings/SettingsPipeline";
import SettingsUsers from "./pages/settings/SettingsUsers";
import SettingsConformance from "./pages/settings/SettingsConformance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <SubmissionsStoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Submissions />} />
                <Route path="/kpi" element={<KpiDashboard />} />
                <Route path="/submissions/:id" element={<SubmissionDetail />} />
                <Route path="/submissions/:id/indicator/:indicatorCode" element={<QuestionnaireEditor />} />
                <Route path="/audit" element={<AuditLog />} />
                <Route path="/help" element={<Help />} />
                <Route path="/dev/validation" element={<QuestionnaireValidation />} />
                
                {/* Settings routes */}
                <Route path="/settings" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="/settings/api-variables" replace />} />
                  <Route path="api-variables" element={<ApiVariables />} />
                  <Route path="pipeline" element={<SettingsPipeline />} />
                  <Route path="users" element={<SettingsUsers />} />
                  <Route path="conformance" element={<SettingsConformance />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubmissionsStoreProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
