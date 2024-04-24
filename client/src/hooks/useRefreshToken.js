import { setCredentials } from "@/redux/auth/authSlice";
import axios from "./../api/axios";
import { useDispatch } from "react-redux";
import {logOut } from "@/redux/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";



const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axios.get("/user/refresh/token/", {
        withCredentials: true,
      });
      console.log(response)
      const accessToken = response?.data?.access_token;
      dispatch(setCredentials({ data:response.data.user, accessToken: accessToken }));
      return accessToken;
    } catch (error) {
      dispatch(logOut());
      toast.error("Session expired, Please login again");
    }
  };
  return refresh;
};

export default useRefreshToken;
