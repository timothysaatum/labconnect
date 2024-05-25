import { setCredentials } from "@/redux/auth/authSlice";
import axios from "./../api/axios";
import { useDispatch } from "react-redux";
import {logOut } from "@/redux/auth/authSlice";



const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axios.get("/user/refresh/token/", {
        withCredentials: true,
      });
      const accessToken = response?.data?.access_token;
      dispatch(setCredentials({ data:response.data.data, accessToken: accessToken }));
      return accessToken;
    } catch (error) {
      dispatch(logOut());
      // toast.error("Session expired, Please login again");
    }
  };
  return refresh;
};

export default useRefreshToken;
