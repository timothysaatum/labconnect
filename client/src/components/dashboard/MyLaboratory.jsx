import { useSelector } from "react-redux";
import MyLab from "../mylab";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import HostpitalLab from "./Hostpital_Lab";

const MyLaboratory = () => {
  const user = useSelector(selectCurrentUser);
  if (user.account_type === "Laboratory") {
    return <MyLab />;
  }
  return <HostpitalLab />;
};

export default MyLaboratory;
