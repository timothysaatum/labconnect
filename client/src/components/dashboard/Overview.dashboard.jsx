import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import HealthWorkerDashboardOverview from "./healthworker.overview.dashboard";
import LaboratoryDashboardOverview from "./laboratory.overview.dashboard";

const DashboardOverview = () => {
  const user = useSelector(selectCurrentUser);

  if (user?.account_type === "Laboratory") {
    return <LaboratoryDashboardOverview />;
  } else if (user?.account_type === "Health Worker") {
    return <HealthWorkerDashboardOverview />;
  }

  return <div>error</div>;
};

export default DashboardOverview;
