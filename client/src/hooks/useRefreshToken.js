import axios from "./../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setAccess } from "../redux/auth/authSlice";

const useRefreshToken = () => {
  const { accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axios.get("/api/user/refresh/token/", {
      withCredentials: true,
    });
    const accessToken = response?.data?.data?.access_token;
    dispatch(setAccess(accessToken));
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken;
