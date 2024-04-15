import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrenttoken } from "@/redux/auth/authSlice";

export default function RequireAuth() {
  const token = useSelector(selectCurrenttoken);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location}} replace/>
  );
}
