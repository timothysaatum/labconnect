import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import ClinicationDashboard from "./pages/ClinicationDashboard";
import SignIn from "./pages/signIn";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/privateRoute";
import NotFound from "./components/clinician/not-found";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<Signup />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<ClinicationDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
