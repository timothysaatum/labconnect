import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { useFetchUserDetails, useFetchUserLab } from "@/api/queries";
import Loading from "./loadingone";

export default function RequireAuth() {
  const token = useSelector(selectCurrenttoken);
  const location = useLocation();

  if (!token) {
    toast.error("Session expired, Please login again");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return <Outlet />;
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

export const HasLaboratory = () => {
  const user = useSelector(selectCurrentUser);

  if (user.account_type === "Hospital") {
    return;
  }
  const { isError, data: userlab, isPending } = useFetchUserLab();
  const location = useLocation();
  if (isPending ) return;
  if (isError) {
    return toast.error("An error has occured");
  }
  if (!user?.is_branch_manager) {
    return <Outlet />;
  }
  return user?.is_admin && userlab?.data.length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/getting-started" state={{ from: location }} replace />
  );
};
