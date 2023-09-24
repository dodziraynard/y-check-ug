import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Permissions from "./utils/permissions";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import Error404Screen from "./pages/ErrorPages/Error404";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import DashboardWidget from "./widgets/DashboardWidget";
import PatientsWidget from "./widgets/PatientsWidget";
import SummaryFlagWidget from "./widgets/SummaryFlagWidget";
import AdolescentReferralsWidget from "./widgets/AdolescentReferralsWidget";
import ReferralsWidget from "./widgets/ReferralsWidget";
import SetupWidget from "./widgets/SetupWidget";
import FacilitiesWidget from "./widgets/FacilitiesWidget";
import RolesWidget from "./widgets/RolesWidget";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="" element={
          <ProtectedRoute permissions={[Permissions.VIEW_DASHBOARD]}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="" element={<DashboardWidget />} />
          <Route path="/patients" element={<PatientsWidget />} />
          <Route path="/patients/:pid/summary" element={<SummaryFlagWidget />} />
          <Route path="/patients/:pid/summary/referrals" element={<AdolescentReferralsWidget />} />
          <Route path="/referrals" element={<ReferralsWidget />} />

          <Route path="/setup" element={
            <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
              <SetupWidget />
            </ProtectedRoute>
          }>
            <Route path="facilities" element={<FacilitiesWidget />} />
            <Route path="roles" element={<RolesWidget />} />
          </Route>
        </Route>
        <Route path="*" element={<Error404Screen />} />
      </Routes>
    </Router>
  );
}

export default App;
