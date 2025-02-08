import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrenttoken } from "@/redux/auth/authSlice";
import { toast } from "sonner";
import { useFetchUserLab } from "@/api/queries";
import { useFetchUserHospital } from "../api/queries";
import Loading from "./loading";
import { useEffect, useState } from "react";

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
    isFetching: labLoading,
  } = useFetchUserLab();
  const {
    isError: hospitalError,
    data: userhospital,
    isFetching: hospitalLoading,
  } = useFetchUserHospital();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [proceed, setProceed] = useState(false); // Always initialize the state hook

  // Ensure hooks are always called in the same order by restructuring the logic
  useEffect(() => {
    if (user?.account_type === "Hospital") {
      // Check if hospital data has been loaded
      if (!hospitalLoading && userhospital?.data?.length === 0) {
        setProceed(false);
        navigate("/getting-started-hospital", {
          state: { from: location },
          replace: true,
        });
      } else {
        setProceed(true);
      }
    } else if (user?.account_type === "Laboratory") {
      if (!labLoading && user?.is_branch_manager) {
        setProceed(true);
      } else if (!labLoading && userlab?.data?.length === 0) {
        setProceed(false);
        navigate("/create-laboratory", {
          state: { from: location },
          replace: true,
        });
      } else {
        setProceed(true);
      }
    }
  }, [
    user,
    userlab,
    userhospital,
    labLoading,
    hospitalLoading,
    location,
    navigate,
  ]);

  // Handle loading states for both lab and hospital
  if (user?.account_type === "Hospital" && hospitalLoading) {
    return <Loading />;
  }
  if (user?.account_type === "Laboratory" && labLoading) {
    return <Loading />;
  }

  // Handle errors
  if (labError) {
    toast.error("An error has occurred while fetching lab data");
    return null;
  }
  if (hospitalError) {
    toast.error("An error has occurred while fetching hospital data");
    return null;
  }

  // If proceed is true, allow access
  return proceed ? <Outlet /> : null;
};
