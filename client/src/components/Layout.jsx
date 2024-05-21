import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { useFetchUserLab } from "@/api/queries";
import { setlab } from "@/redux/lab/userLabSlice";

const Layout = () => {
  const token = useSelector(selectCurrenttoken);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { data: userlab } = useFetchUserLab(token);

  useEffect(() => {
    if (user?.account_type === "Laboratory" && userlab?.data.length > 0) {
      dispatch(setlab(userlab?.data));
    }
  }, [token, user]);
  return (
    <>
      <Header />
      {<Outlet />}
    </>
  );
};

export default Layout;
