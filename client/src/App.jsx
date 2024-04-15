import { Route, Routes, useLocation } from "react-router-dom";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/persistLogin";
import Layout from "./components/Layout";
import VerifyEmail from "./pages/verify-email";

export default function ModeToggle() {
  const location = useLocation();

  
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="sign-in" element={<Signin />} />
          <Route path="sign-up" element={<Signup />} />
        <Route path="verify-email" element={<VerifyEmail />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
