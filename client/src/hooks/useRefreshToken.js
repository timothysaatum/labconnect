import { setCredentials } from "@/redux/auth/authSlice";
import axios from "./../api/axios";
import { useDispatch } from "react-redux";
import {logOut } from "@/redux/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";



const useRefreshToken = () => {
  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = async () => {
    try {
      const response = await axios.get("/user/refresh/token/", {
        withCredentials: true,
      });
      const accessToken = response?.data?.access_token;
      dispatch(setCredentials({ data:response.data.user, accessToken: accessToken }));
      return accessToken;
    } catch (error) {
      dispatch(logOut());
      navigate("/sign-in",{state :{from:location},replace:true});
    }
  };
  return refresh;
};

export default useRefreshToken;
