import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Toaster } from "./components/ui/toaster";
import RequireAuth from "./components/RequireAuth";

export default function ModeToggle() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<Signin />} />
        <Route path="sign-up" element={<Signup />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
