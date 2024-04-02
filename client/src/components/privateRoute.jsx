import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const location = useLocation();
  const { auth } = useSelector((state) => state.auth);
  return auth?.access_token ? <Outlet /> : <Navigate to="/sign-in" state={{from:location}} replace/>;
}
