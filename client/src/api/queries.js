import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import axios from "./axios";

// users
export const useFetchUserDetails = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["User"],
    queryFn: async () => await axiosPrivate.get("/user/fetch-user-data/"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
export const useFetchLabRequests = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Requests"],
    queryFn: async () => await axiosPrivate.get("/laboratory/samples-list/"),
    staleTime: 1000 * 60 * 5,
  });
};
export const useFetchLabRequestsSent = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["RequestsSent"],
    queryFn: async () =>
      await axiosPrivate.get("/laboratory/lab/test-requests/samples/"),
    staleTime: 1000 * 60 * 5,
  });
};
export const useFetchHealthWorkerRequests = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Requests"],
    queryFn: async () => await axiosPrivate.get("/hospital/sample/list/"),
    staleTime: 1000 * 60 * 5,
  });
};

//deliveries
export const useFetchAllDeliveries = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["All Deliveries"],
    queryFn: async () => await axiosPrivate.get("/delivery/delivery/all/"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};

// laboratories
export const useFetchUserLab = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Laboratory"],
    queryFn: async () => await axiosPrivate.get("/laboratory/user-laboratory/"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 600,
  });
};
export const useFetchAllLabsBranches = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["All labs"],
    queryFn: async () => await axiosPrivate.get("/laboratory/branch/all/"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
export const useFetchLabTests = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["tests", id],
    queryFn: async () => await axiosPrivate.get(`/laboratory/test/list/${id}/`),
    refetchOnWindowFocus: false,
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};

export const useFetchUserBranches = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["userbranches"],
    queryFn: async () => await axiosPrivate.get(`/laboratory/branch/list/`),
    staleTime: 1000 * 60 * 60,
  });
};

//hospitals
export const useFetchAllHospitals = () => {
  return useQuery({
    queryKey: ["All hospitals"],
    queryFn: async () => await axios.get("/hospital/list/"),
    staleTime: 1000 * 60 * 60,
  });
};
