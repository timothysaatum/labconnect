import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { useFetchUserBranches, useFetchUserLab } from "@/api/queries";
import Loading from "./loading";
export default function RequireAuth() {
  const token = useSelector(selectCurrenttoken);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!token) {
    toast.error("Session expired, Please login again");
  }
  return token ? (
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
export const HasLaboratory = () => {
  const user = useSelector(selectCurrentUser);
  const { isError, data: userlab, isFetching } = useFetchUserLab();
  const { isError:brancherror, data: branches, isFetching:branchesfetching } = useFetchUserBranches();
  const location = useLocation();
  if (user?.account_type !== "Laboratory") return;
  if (isFetching || branchesfetching) return <Loading />;
  if (isError) {
    toast.error("Error loading laboratory");
  }
  if (brancherror) { 
    toast.error("Error loading branches");
  }
  return userlab?.data.length > 0 && branches?.data.length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/getting-started" state={{ from: location }} replace />
  );
};
