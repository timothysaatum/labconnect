import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { useFetchUserLab } from "@/api/queries";
import Loading from "./loading";


export default function RequireAuth() {
  const token = useSelector(selectCurrenttoken);
  const location = useLocation();

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
  const location = useLocation();
  if (user?.account_type !== "Laboratory") return;
  if (isFetching) return <Loading />;
  if (isError) {
    toast.error("Error loading laboratory");
  }
 
  return userlab?.data.length > 0? (
    <Outlet />
  ) : (
    <Navigate to="/getting-started" state={{ from: location }} replace />
  );
};
