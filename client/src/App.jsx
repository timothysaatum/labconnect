import "react-day-picker/dist/style.css";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "@/pages/Signup";
import RequireAuth, {
  HasLaboratory,
  LabRoutes,
} from "./components/RequireAuth";
import PersistLogin from "./components/persistLogin";
import Layout from "./components/Layout";
import VerifyEmail from "./pages/verify-email";
import ConfirmForgotPassword from "./pages/password-reset-confirm";
import React from "react";
import Notfound from "./components/notfound";
import DashboardOverview from "@/components/dashboard/Overview.dashboard";
import SettingProfile from "./components/dashboard/Profile";
import Loading from "./components/loadingone";
import Labgettingstarted from "./pages/labgettingstarted";
import MyLab from "@/components/mylab";
import SendSample from "./components/dashboard/sendSample";
const ForgotPassword = React.lazy(() => import("./pages/forgotpassword"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const BranchManagerInviteAccept = React.lazy(() =>
  import("@/pages/branchManagerInviteAccept")
);
const BranchDetails = React.lazy(() =>
  import("@/components/dashboard/branchDetails")
);
const DashboardSettings = React.lazy(() =>
  import("@/components/dashboard/settings")
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
              <Route path="getting-started" element={<Labgettingstarted />} />
              <Route element={<HasLaboratory />}>
                <Route
                  path="dashboard"
                  element={
                    <React.Suspense fallback={null}>
                      <Dashboard />
                    </React.Suspense>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="overview" element={<DashboardOverview />} />
                  <Route path="send-sample" element={<SendSample />} />
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
                  {/* laboratory routes */}
                  <Route element={<LabRoutes />}>
                    <Route path="my-laboratory" element={<MyLab />} />
                    <Route
                      path="/dashboard/my-laboratory/branches/:branch_Id/"
                      element={
                        <React.Suspense fallback={<Loading />}>
                          <BranchDetails />
                        </React.Suspense>
                      }
                    />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
