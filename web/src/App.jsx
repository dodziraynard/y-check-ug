import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import React, { Suspense } from 'react';

import Permissions from "./utils/permissions";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import PageLoading from "./components/PageLoading";

const ChangeDefaultPassword = React.lazy(() => import("./pages/ChangeDefaultPassword"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const Error404Screen = React.lazy(() => import("./pages/ErrorPages/Error404"));
const DashboardWidget = React.lazy(() => import("./widgets/DashboardWidget"));
const PatientsWidget = React.lazy(() => import("./widgets/PatientsWidget"));
const SummaryFlagWidget = React.lazy(() => import("./widgets/SummaryFlagWidget"));
const AdolescentReferralsWidget = React.lazy(() => import("./widgets/AdolescentReferralsWidget"));
const ReferralsWidget = React.lazy(() => import("./widgets/ReferralsWidget"));
const SetupWidget = React.lazy(() => import("./widgets/SetupWidget"));
const FacilitiesWidget = React.lazy(() => import("./widgets/FacilitiesWidget"));
const ServiceWidget = React.lazy(() => import("./widgets/ServiceWidget"));
const RolesWidget = React.lazy(() => import("./widgets/RolesWidget"));
const UsersWidget = React.lazy(() => import("./widgets/UsersWidget"));
const UserProfileWidget = React.lazy(() => import("./widgets/UserProfileWidget"));
const BioDataWidget = React.lazy(() => import("./widgets/BioDataWidget"));
const ChangePasswordWidget = React.lazy(() => import("./widgets/ChangePasswordWidget"));
const ProfilePictureWidget = React.lazy(() => import("./widgets/ProfilePictureWidget"));
const ReferralDetailWidget = React.lazy(() => import("./widgets/ReferralDetailWidget"));
const TreatmentsWidget = React.lazy(() => import("./widgets/TreatmentsWidget"));
const TreatmentDetailWidget = React.lazy(() => import("./widgets/TreatmentDetailWidget"));
const NodeWidget = React.lazy(() => import("./widgets/NodeWidget"));
const ReportsWidget = React.lazy(() => import("./widgets/ReportsWidget"));
const ApkWidget = React.lazy(() => import("./widgets/ApkWidget"));

const Home = React.lazy(() => import("./pages/HomePage/Home"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Suspense fallback={<PageLoading />}><Home /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<PageLoading />}><LoginPage /></Suspense>} />
        <Route path="/dashboard" element={
          <ProtectedRoute permissions={[Permissions.VIEW_DASHBOARD]}>
            <Suspense fallback={<PageLoading />}><DashboardPage /></Suspense>
          </ProtectedRoute>
        }>
          <Route path="" element={<Suspense fallback={<PageLoading />}><DashboardWidget /></Suspense>} />
          <Route path="/dashboard/password-reset" element={<Suspense fallback={<PageLoading />}><ChangeDefaultPassword /></Suspense>} />
          <Route path="/dashboard/patients" element={<Suspense fallback={<PageLoading />}><PatientsWidget /></Suspense>} />
          <Route path="/dashboard/patients/:pid/summary" element={<Suspense fallback={<PageLoading />}><SummaryFlagWidget /></Suspense>} />
          <Route path="/dashboard/patients/:pid/summary/referrals" element={<Suspense fallback={<PageLoading />}><AdolescentReferralsWidget /></Suspense>} />
          <Route path="/dashboard/referrals" element={<Suspense fallback={<PageLoading />}><ReferralsWidget /></Suspense>} />
          <Route path="/dashboard/treatments" element={<Suspense fallback={<PageLoading />}><TreatmentsWidget /></Suspense>} />
          <Route path="/dashboard/reports" element={<Suspense fallback={<PageLoading />}><ReportsWidget /></Suspense>} />
          <Route path="/dashboard/treatments/:referralId/details" element={<Suspense fallback={<PageLoading />}><TreatmentDetailWidget /></Suspense>} />
          <Route path="/dashboard/referrals/:referralId/details" element={<Suspense fallback={<PageLoading />}><ReferralDetailWidget /></Suspense>} />

          <Route path="/dashboard/users" element={<Suspense fallback={<PageLoading />}><UsersWidget /></Suspense>} />

          <Route path="/dashboard/setup" element={
            <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
              <Suspense fallback={<PageLoading />}><SetupWidget /></Suspense>
            </ProtectedRoute>
          }>
            <Route path="" element={<Suspense fallback={<PageLoading />}><FacilitiesWidget /></Suspense>} />
            <Route path="facilities" element={<Suspense fallback={<PageLoading />}><FacilitiesWidget /></Suspense>} />
            <Route path="services" element={<Suspense fallback={<PageLoading />}><ServiceWidget /></Suspense>} />
            <Route path="roles" element={<Suspense fallback={<PageLoading />}><RolesWidget /></Suspense>} />
            <Route path="apk" element={<Suspense fallback={<PageLoading />}><ApkWidget /></Suspense>} />
            <Route path="nodes" element={<Suspense fallback={<PageLoading />}><NodeWidget /></Suspense>} />
          </Route>

          <Route path="/dashboard/user/profile" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoading />}><UserProfileWidget /></Suspense>
            </ProtectedRoute>
          }>
            <Route path="" element={<Suspense fallback={<PageLoading />}><BioDataWidget /></Suspense>} />
            <Route path="bio/data" element={<Suspense fallback={<PageLoading />}><BioDataWidget /></Suspense>} />
            <Route path="change/password" element={<Suspense fallback={<PageLoading />}><ChangePasswordWidget /></Suspense>} />
            <Route path="picture" element={<Suspense fallback={<PageLoading />}><ProfilePictureWidget /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<Suspense fallback={<PageLoading />}><Error404Screen /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
