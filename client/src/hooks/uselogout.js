import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import useAxiosPrivate from "./useAxiosPrivate";
import { logOut } from "@/redux/auth/authSlice";

const useLogout = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const logout = async () => {
    try {
      await axiosPrivate.post("/user/logout/", {
        withCredentials: true,
      });
      dispatch(logOut());
      queryClient.removeQueries(); // this will clear the cache
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;
