import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Signin from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Toaster } from "./components/ui/toaster";

export default function ModeToggle() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<Signin />} />
        <Route path="sign-up" element={<Signup />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster/>
    </>
  );
}
