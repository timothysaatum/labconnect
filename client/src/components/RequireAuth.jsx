import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { useFetchUserLab } from "@/api/queries";
import { useFetchUserHospital } from "../api/queries";
import Loading from "./loading";
import { useEffect } from "react";

export default function RequireAuth() {
  const token = useSelector(selectCurrenttoken);
  const location = useLocation();

  if (!token) {
    toast.error("Session expired, Please login again");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// export const LabRoutes = () => {
//   const user = useSelector(selectCurrentUser);

//   const location = useLocation();
//   return user?.account_type === "Laboratory" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/sign-in" state={{ from: location }} replace />
//   );
// };

export const CanGetStarted = () => {
  const user = useSelector(selectCurrentUser);
  const {
    isError: labError,
    data: userlab,
    isPending: labLoading,
  } = useFetchUserLab();
  const {
    isError: hospitalError,
    data: userhospital,
    isLoading: hospitalLoading,
  } = useFetchUserHospital();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is of type Hospital
    if (user?.account_type === "Hospital") {
      if (!hospitalLoading && userhospital?.data?.length === 0) {
        navigate("/getting-started-hospital", {
          state: { from: location },
          replace: true,
        });
      }
    }

    // If the user is a laboratory user and not a branch manager
    if (
      !user?.is_branch_manager &&
      !labLoading &&
      userlab?.data?.length === 0
    ) {
      navigate("/getting-started", {
        state: { from: location },
        replace: true,
      });
    }

    // Error handling for both lab and hospital
    if (labError) {
      toast.error("An error has occurred while fetching lab data");
    }
    if (hospitalError) {
      toast.error("An error has occurred while fetching hospital data");
    }
  }, [
    userlab,
    userhospital,
    labError,
    hospitalError,
    labLoading,
    hospitalLoading,
    user,
    navigate,
    location,
  ]);

  // Loading states
  if (labLoading || hospitalLoading) return <Loading />;

  // If everything is fine, allow access to the content
  return <Outlet />;
};


export const BlockGettingStarted = () => {
  const {
    isError: labError,
    data: userlab,
    isLoading: labLoading,
  } = useFetchUserLab();
  const {
    isError: hospitalError,
    data: userhospital,
    isLoading: hospitalLoading,
  } = useFetchUserHospital();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (labLoading || hospitalLoading) return;

    if (labError || hospitalError) {
      toast.error("An error has occurred. You need to sign in again");
      navigate("/sign-in", { state: { from: location }, replace: true });
      return;
    }

    const FacilityCreated =
      userlab?.data.length > 0 || userhospital?.data?.length > 0;

    if (FacilityCreated) {
      toast.info("Unauthorized", {
        description: "You have already created a laboratory",
      });
      navigate("/dashboard");
    }
  }, [
    labLoading,
    hospitalLoading,
    labError,
    hospitalError,
    userlab,
    userhospital,
    navigate,
    location,
  ]);

  if (labLoading || hospitalLoading) return <Loading />;

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};
