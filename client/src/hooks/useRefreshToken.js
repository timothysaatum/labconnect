import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../redux/auth/authSlice";

const useRefreshToken = () => {
  const { auth } = useSelector((state) => state.auth);
  const { refresh_token } = auth;

  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axios.post(
      "/api/user/refresh/token/",
      refresh_token,
      {
        withCredentials: true,

        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
  return <div>useRefreshToken</div>;
};

export default useRefreshToken;
