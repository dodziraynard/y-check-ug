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
import ServiceWidget from "./widgets/ServiceWidget";
import RolesWidget from "./widgets/RolesWidget";
import UsersWidget from "./widgets/UsersWidget";
import UserProfileWidget from "./widgets/UserProfileWidget";
import BioDataWidget from "./widgets/BioDataWidget";
import ChangePasswordWidget from "./widgets/ChangePasswordWidget";
import ProfilePictureWidget from "./widgets/ProfilePictureWidget";
import ReferralDetailWidget from "./widgets/ReferralDetailWidget";
import TreatmentsWidget from "./widgets/TreatmentsWidget";
import OnSpotTreatmentsWidget from "./widgets/OnSpotTreatmentWidget";
import TreatmentDetailWidget from "./widgets/TreatmentDetailWidget";
import CounselingWidget from "./widgets/CounselingWidget";
import NodeWidget from "./widgets/NodeWidget";
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
          <Route path="/treatments" element={<TreatmentsWidget />} />
          <Route path="/on-spot-treatments" element={<OnSpotTreatmentsWidget />} />
          <Route path="/counseling" element={<CounselingWidget />} />
          <Route path="/treatments/:referralId/details" element={<TreatmentDetailWidget />} />
          <Route path="/referrals/:referralId/details" element={<ReferralDetailWidget />} />

          <Route path="/users" element={<UsersWidget />} />

          <Route path="/setup" element={
            <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
              <SetupWidget />
            </ProtectedRoute>
          }>
            <Route path="" element={<FacilitiesWidget />} />
            <Route path="facilities" element={<FacilitiesWidget />} />
            <Route path="services" element={<ServiceWidget />} />
            <Route path="roles" element={<RolesWidget />} />
            <Route path="nodes" element={<NodeWidget />} />
          </Route>

          <Route path="/user/profile" element={
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
