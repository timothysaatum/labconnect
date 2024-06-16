import "react-day-picker/dist/style.css";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
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
import Loading from "./components/loading";
import Labgettingstarted from "./pages/labgettingstarted";
const ForgotPassword = React.lazy(() => import("./pages/forgotpassword"));
const BranchManagerProfileComplete = React.lazy(() =>
  import("@/components/dashboard/branch-manager-complete-profile")
);
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const MyLab = React.lazy(() => import("@/components/mylab"));
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
            <Route path="*" element={<Notfound />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-up" element={<Signup />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            
            <Route
              path="forgot-password"
              element={
                <React.Suspense fallback={<div>...</div>}>
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
              path="api/user/password-reset-confirm/:uidb64/:token/"
              element={<ConfirmForgotPassword />}
            />

            {/* protected routes */}
            <Route element={<RequireAuth />}>
              <Route path="getting-started" element={<Labgettingstarted />} />
              <Route element={<HasLaboratory />}>
                <Route
                  path="dashboard"
                  element={
                    <React.Suspense fallback={<Loading />}>
                      <Dashboard />
                    </React.Suspense>
                  }
                >
                  <Route index element={<DashboardOverview />} />
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
                    <Route
                      path="my-laboratory"
                      element={
                        <React.Suspense fallback={<Loading />}>
                          <MyLab />
                        </React.Suspense>
                      }
                    />
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
