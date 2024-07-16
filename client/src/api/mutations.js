import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      toast.message("Branch Deleted", {
        duration: 5000,
      });
    },
  });
};

export const useDeactivateTestMutation = (id) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      await axiosPrivate.patch(`laboratory/branch/update/${id}/`);
    },
    onError: () => {
      toast.info("unable to deactivate test");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      toast.message("Test deactivated");
    },
  });
};
