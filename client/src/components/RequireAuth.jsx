import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
export default function RequireAuth() {
  const token = useSelector(selectCurrenttoken);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!token) {
    toast.error("Session expired, Please login again");
  }
  return !token ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
}

export const LabRoutes = () => {
  const user = useSelector(selectCurrentUser);

  const location = useLocation();
  return user?.account_type === "Laboratory" ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};
