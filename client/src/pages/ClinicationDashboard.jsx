import { useLocation } from "react-router-dom";
import Dashsidebar from "../components/clinician/sidebar.dashboard";
import { useEffect, useState } from "react";
import Profile from "../components/clinician/dashboard/profile.dashboard";
import NotFound from "../components/clinician/not-found";
import DashboardTabs from "../components/clinician/dashboard/tabs.dashboard";
import Motion from "../components/motion";
import MakeRequest from "../components/clinician/dashboard/makerequest";

export default function ClinicationDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row  mx-4 sm:mx-8 md:mx-0">
      <div className="md:w-56 hidden md:block">
        <Dashsidebar />
      </div>
      <div className="md:w-56 md:hidden">
        <DashboardTabs />
      </div>
      <Motion className="w-full">
        {(tab === null && <Profile />) || (tab === "profile" && <Profile />)}
        {/* {(tab === "requests" && <Requests />)} */}
        {tab === "make-request" && <MakeRequest />}
        {tab !== "profile" &&
          tab !== "make-request" &&
          tab !== "requests" &&
          tab !== null &&
          tab !== "tracking" && <NotFound />}
      </Motion>
    </div>
  );
}
