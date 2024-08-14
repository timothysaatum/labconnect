import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { useFetchUserLab } from "@/api/queries";

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

export const CanGetStarted = () => {
  const user = useSelector(selectCurrentUser);

  if (user.account_type === "Hospital") {
    return <Outlet />;
  }
  const { isError, data: userlab, isPending } = useFetchUserLab();
  const location = useLocation();
  if (isPending) return;
  if (isError) {
    return toast.error("An error has occured");
  }
  if (user?.is_branch_manager) {
    return <Outlet />;
  }

  return userlab?.data.length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/getting-started" state={{ from: location }} replace />
  );
};

export const BlockGettingStarted = () => {
  const { isError, data: userlab, isPending } = useFetchUserLab();
  const location = useLocation();

  if (isPending) return;
  if (isError) {
    toast.error("An error has occured. You need to sign in Again");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const labCreated = userlab?.data.length > 0;

  if (labCreated) {
    toast.info("Unauthorized", {
      description: "You have already created a laboratory",
    });
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};
