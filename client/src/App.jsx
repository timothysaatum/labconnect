import "react-day-picker/dist/style.css";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "@/pages/Signup";
import RequireAuth, {
  BlockGettingStarted,
  CanGetStarted,
} from "./components/RequireAuth";
import PersistLogin from "./components/persistLogin";
import Layout from "./components/Layout";
import VerifyEmail from "./pages/verify-email";
import ConfirmForgotPassword from "./pages/password-reset-confirm";
import React from "react";
import Notfound from "./components/notfound";
import DashboardOverview from "@/components/dashboard/Overview.dashboard";
import SettingProfile from "./components/dashboard/Profile";
import Loading from "./components/loading";
import Analytics from "./components/laboratoryanalytics";
import SampleDetails from "./components/sampleDetails";
import MyLaboratory from "./components/dashboard/MyLaboratory";
import CreateHospital from "./components/createHospital/createHospital";
import SendSample from "./components/dashboard/sendSample";
import CreateLaboratory from "./pages/labgettingstarted";
const ForgotPassword = React.lazy(() => import("./pages/forgotpassword"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const BranchManagerInviteAccept = React.lazy(
  () => import("@/pages/branchManagerInviteAccept")
);
const BranchDetails = React.lazy(
  () => import("@/components/dashboard/branchDetails")
);
const DashboardSettings = React.lazy(
  () => import("@/components/dashboard/settings")
);
const Tracking = React.lazy(() => import("@/pages/tracking"));

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Notfound />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-up" element={<Signup />} />
            <Route path="verify-email" element={<VerifyEmail />} />

            <Route
              path="forgot-password"
              element={
                <React.Suspense fallback={null}>
                  <ForgotPassword />
                </React.Suspense>
              }
            />
            <Route
              path="accept-invite/:uidb64/:token"
              element={
                <React.Suspense fallback={<div>...</div>}>
                  <BranchManagerInviteAccept />
                </React.Suspense>
              }
            />
            <Route
              path="/password-reset-confirm/:uidb64/:token/"
              element={<ConfirmForgotPassword />}
            />

            {/* protected routes */}
            <Route element={<RequireAuth />}>
              <Route path="create-laboratory" element={<CreateLaboratory />} />
              <Route path="create-hospital" element={<CreateHospital />} />
              <Route element={<BlockGettingStarted />}>
                <Route
                  path="dashboard"
                  element={
                    <React.Suspense fallback={<Loading />}>
                      <Dashboard />
                    </React.Suspense>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="overview" element={<DashboardOverview />} />
                  <Route
                    path="/dashboard/overview/samples/received/:branchId/:sampleId"
                    element={<SampleDetails />}
                  />
                  <Route path="send-sample" element={<SendSample />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route
                    path="settings"
                    element={
                      <React.Suspense fallback={<Loading />}>
                        <DashboardSettings />
                      </React.Suspense>
                    }
                  >
                    <Route index element={<SettingProfile />} />
                    <Route path="profile" element={<SettingProfile />} />
                    <Route path="*" element={<div>not found</div>} />
                  </Route>
                  <Route
                    path="tracking"
                    element={
                      <React.Suspense fallback={<Loading />}>
                        <Tracking />
                      </React.Suspense>
                    }
                  />
                  <Route path="my-laboratory" element={<MyLaboratory />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
