import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import ClinicianDashboardOverview from "./clinician.overview.dashboard";
import LaboratoryDashboardOverview from "./laboratory.overview.dashboard";

const DashboardOverview = () => {
  const user = useSelector(selectCurrentUser);

  if(user?.account_type==="Clinician"){
    return <ClinicianDashboardOverview/>
  }else if (user?.account_type === "Laboratory"){  
    return <LaboratoryDashboardOverview/>
  } 
  
  return <div>error</div>;
};

export default DashboardOverview;
