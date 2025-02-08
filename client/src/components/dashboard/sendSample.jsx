import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import HospitalSendSample from "./hospitalSendSample";
import LaboratorySendSample from "./LaboratorysendSample";

const SendSample = () => {
  const user = useSelector(selectCurrentUser);

  if (user?.account_type === "Hospital") return <HospitalSendSample />;
  return <LaboratorySendSample />;
};

export default SendSample;
