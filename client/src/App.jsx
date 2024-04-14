import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/persistLogin";
import Layout from "./components/Layout";

export default function ModeToggle() {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<Layout />}>
            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />} />
              <Route path="sign-in" element={<Signin />} />
              <Route path="sign-up" element={<Signup />} />

              {/* protected routes */}
              <Route element={<RequireAuth />}>
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
