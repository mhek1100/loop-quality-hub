import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserProvider } from "@/contexts/UserContext";
import { SubmissionsStoreProvider } from "@/contexts/SubmissionsStoreContext";

// Pages
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Workspace from "./pages/Workspace";
import KpiDashboard from "./pages/KpiDashboard";
import IndicatorDashboard from "./pages/IndicatorDashboard";
import Submissions from "./pages/Submissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import QuestionnaireEditor from "./pages/QuestionnaireEditor";
import AuditLog from "./pages/AuditLog";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import QuestionnaireValidation from "./pages/QuestionnaireValidation";

// Care minutes pages
import CareMinutesOverview from "./pages/care-minutes/Overview";
import CareMinutesFacilities from "./pages/care-minutes/Facilities";
import CareMinutesSubmission from "./pages/care-minutes/Submission";
import CareMinutesPastReports from "./pages/care-minutes/PastReports";

// NQIP pages
import NqipHelp from "./pages/nqip/NqipHelp";

// RN24/7 pages
import RN247Overview from "./pages/rn247/Overview";
import RN247Reports from "./pages/rn247/Reports";

// Annual leave pages
import AnnualLeaveOverview from "./pages/annual-leave/Overview";
import AnnualLeaveRequests from "./pages/annual-leave/Requests";
import AnnualLeaveCalendar from "./pages/annual-leave/Calendar";

// Settings pages
import SettingsLayout from "./pages/settings/SettingsLayout";
import ApiVariables from "./pages/settings/ApiVariables";
import SettingsPipeline from "./pages/settings/SettingsPipeline";
import SettingsUsers from "./pages/settings/SettingsUsers";
import SettingsConformance from "./pages/settings/SettingsConformance";

const queryClient = new QueryClient();

const App = () => {
  const base = import.meta.env.BASE_URL || "/";
  const basename = base === "/" ? undefined : base.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SubmissionsStoreProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={basename}>
              <Routes>
              <Route element={<DashboardLayout />}>
                {/* Default redirect to Marketplace */}
                <Route path="/" element={<Navigate to="/marketplace" replace />} />
                
                {/* Primary nav */}
                <Route path="/home" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/help" element={<Help />} />
                
                {/* Care minutes */}
                <Route path="/care-minutes/overview" element={<CareMinutesOverview />} />
                <Route path="/care-minutes/facilities" element={<CareMinutesFacilities />} />
                <Route path="/care-minutes/submission" element={<CareMinutesSubmission />} />
                <Route path="/care-minutes/past-reports" element={<CareMinutesPastReports />} />
                
                {/* NQIP - existing pages moved here */}
                <Route path="/nqip/submissions" element={<Submissions />} />
                <Route path="/nqip/kpi" element={<KpiDashboard />} />
                <Route path="/nqip/kpi/indicator/:indicatorCode" element={<IndicatorDashboard />} />
                <Route path="/nqip/submissions/:id" element={<SubmissionDetail />} />
                <Route path="/nqip/submissions/:id/indicator/:indicatorCode" element={<QuestionnaireEditor />} />
                <Route path="/nqip/help" element={<NqipHelp />} />
                
                {/* RN24/7 */}
                <Route path="/rn247/overview" element={<RN247Overview />} />
                <Route path="/rn247/reports" element={<RN247Reports />} />
                
                {/* Annual leave */}
                <Route path="/annual-leave/overview" element={<AnnualLeaveOverview />} />
                <Route path="/annual-leave/requests" element={<AnnualLeaveRequests />} />
                <Route path="/annual-leave/calendar" element={<AnnualLeaveCalendar />} />
                
                {/* Audit log */}
                <Route path="/audit" element={<AuditLog />} />
                
                {/* Dev routes */}
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
};

export default App;
