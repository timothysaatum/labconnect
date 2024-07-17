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
  const [activation, setActivation] = useState(false);

  return useMutation({
    mutationFn: async (data) => {
      if (data === true) {
        setActivation(false);
      } else {
        setActivation(true);
      }
      await axiosPrivate.patch(
        `laboratory/update/test-for-branch/${activeBranch}/${id}/`,
        {
          is_deactivated: data,
        }
      );
    },
    onError: () => {
      console.log(activation);
      if (activation === false) {
        toast.info("An error occured, Could not deactivate test for branch");
      } else {
        toast.info("An error occured, Could not activate test for branch");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      if (activation === false) {
        toast.message("Test Deactivated", {
          description:"test will be unavailable for selection in this branch",
        });
      } else {
        toast.message("Test Activated", {
          description:"test will be available for selection in this branch",
        });
      }
    },
  });
};
export const useDeactivateTestMutation = (id) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (data) => {
      await axiosPrivate.patch(`laboratory/test/update/${id}/`, {
        is_deactivated: data,
      });
    },
    onError: () => {
      toast.info("unable to deactivate test");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      if (data) {
        toast.info("Test Deactivated");
      }
    },
  });
};
