import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const usedeleteTestMutation = (id) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosPrivate.delete(`laboratory/test/delete/${id}/`);
    },
    onError: () => {
      toast.error("An error occured, Could not delete test");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tests", id]);
      toast.info("Test Deleted");
    },
  });
};

export const usedeleteBranchMutation = (id) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async () => {
      await axiosPrivate.delete(`laboratory/branch/delete/${id}/`);
    },
    onError: () => {
      toast.error("An error occured, Could not delete Branch");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userbranches"]);
      toast.info("Branch Deleted", {
        duration: 5000,
      });
    },
  });
};

export const useDeactivateTestForBranchMutation = (id) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const activeBranch = useSelector(selectActiveBranch);
  const [activation, setActivation] = useState();

  return useMutation({
    mutationFn: async (data) => {
      if (data === "inactive") {
        setActivation(false);
      } else {
        setActivation(true);
      }
      await axiosPrivate.patch(
        `laboratory/update/test-for-branch/${activeBranch}/${id}/`,
        {
          test_status: data,
        }
      );
    },
    onError: () => {
      if (activation === false) {
        toast.info("An error occured, Could not deactivate test for branch");
      } else {
        toast.info("An error occured, Could not activate test for branch");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tests", activeBranch]);
      if (activation === false) {
        toast.message("Test Deactivated", {
          description: "test will be unavailable for selection in this branch",
        });
      } else {
        toast.message("Test Activated", {
          description: "test will be available for selection in this branch",
        });
      }
    },
  });
};
export const useDeactivateTestMutation = (id) => {
  const [activation, setActivation] = useState(false);
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (data) => {
      if (data === "inactive") {
        setActivation(false);
      } else {
        setActivation(true);
      }
      await axiosPrivate.patch(`laboratory/test/update/${id}/`, {
        test_status: data,
      });
    },
    onError: () => {
      if (activation === false) {
        toast.info("An error occured, Could not deactivate test");
      } else {
        toast.info("An error occured, Could not activate test");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      if (activation === false) {
        toast.message("Test Deactivated", {
          description:
            "test will be unavailable for selection for all user branches",
        });
      } else {
        toast.success("Test Activated", {
          description:
            "test will be available for selection for all user branches",
        });
      }
    },
  });
};

export const useUpdateNotificationMutation = () => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  return useMutation({
    mutationFn: async () => {
      await axiosPrivate.patch(`sample/update-notification/`, {
        is_read: true,
      });
    },
    onError: () => {
      toast.error("Could not mark as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Notifications"]);
    },
  });
};
