import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import LaboratoryDashboardOverview from "./laboratory.overview.dashboard";
import HospitalDashboardOverview from "./hospital.overview.dashboard";

const DashboardOverview = () => {
  const user = useSelector(selectCurrentUser);

  if (user?.account_type === "Laboratory") {
    return <LaboratoryDashboardOverview />;
  } else if (user?.account_type === "Hospital") {
    return <HospitalDashboardOverview />;
  }

  return <div>error</div>;
};

export default DashboardOverview;
