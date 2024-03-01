import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Permissions from "./utils/permissions";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
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
import ServiceWidget from "./widgets/ServiceWidget";
import RolesWidget from "./widgets/RolesWidget";
import UsersWidget from "./widgets/UsersWidget";
import UserProfileWidget from "./widgets/UserProfileWidget";
import BioDataWidget from "./widgets/BioDataWidget";
import ChangePasswordWidget from "./widgets/ChangePasswordWidget";
import ProfilePictureWidget from "./widgets/ProfilePictureWidget";
import ReferralDetailWidget from "./widgets/ReferralDetailWidget";
import TreatmentsWidget from "./widgets/TreatmentsWidget";
import TreatmentDetailWidget from "./widgets/TreatmentDetailWidget";
import NodeWidget from "./widgets/NodeWidget";
import ReportsWidget from "./widgets/ReportsWidget";
import ApkWidget from "./widgets/ApkWidget";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute permissions={[Permissions.VIEW_DASHBOARD]}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="" element={<DashboardWidget />} />
          <Route path="/dashboard/patients" element={<PatientsWidget />} />
          <Route path="/dashboard/patients/:pid/summary" element={<SummaryFlagWidget />} />
          <Route path="/dashboard/patients/:pid/summary/referrals" element={<AdolescentReferralsWidget />} />
          <Route path="/dashboard/referrals" element={<ReferralsWidget />} />
          <Route path="/dashboard/treatments" element={<TreatmentsWidget />} />
          <Route path="/dashboard/reports" element={<ReportsWidget />} />
          <Route path="/dashboard/treatments/:referralId/details" element={<TreatmentDetailWidget />} />
          <Route path="/dashboard/referrals/:referralId/details" element={<ReferralDetailWidget />} />

          <Route path="/dashboard/users" element={<UsersWidget />} />

          <Route path="/dashboard/setup" element={
            <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
              <SetupWidget />
            </ProtectedRoute>
          }>
            <Route path="" element={<FacilitiesWidget />} />
            <Route path="facilities" element={<FacilitiesWidget />} />
            <Route path="services" element={<ServiceWidget />} />
            <Route path="roles" element={<RolesWidget />} />
            <Route path="apk" element={<ApkWidget />} />
            <Route path="nodes" element={<NodeWidget />} />
          </Route>

          <Route path="/dashboard/user/profile" element={
            <ProtectedRoute>
              <UserProfileWidget />
            </ProtectedRoute>
          }>
            <Route path="" element={<BioDataWidget />} />
            <Route path="bio/data" element={<BioDataWidget />} />
            <Route path="change/password" element={<ChangePasswordWidget />} />
            <Route path="picture" element={<ProfilePictureWidget />} />
          </Route>
        </Route>
        <Route path="*" element={<Error404Screen />} />
      </Routes>
    </Router>
  );
}

export default App;
