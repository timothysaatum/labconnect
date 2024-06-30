import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "./axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { newAbortSignal } from "./abortsignal";

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
export const useFetchLabRequestsReceived = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["RequestsReceived", id],
    queryFn: async () =>
      await axiosPrivate.get(`/laboratory/samples-list/${id}/`),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};
export const useFetchLabRequestsSent = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["RequestsSent", id],
    queryFn: async () =>
      await axiosPrivate.get(`/laboratory/lab-requests/${id}/`),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
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
  const user = useSelector(selectCurrentUser);

  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Laboratory"],
    queryFn: async () => await axiosPrivate.get("/laboratory/user-laboratory/"),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: user?.account_type === "Laboratory",
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
  const controller = new AbortController();
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["tests", id],
    queryFn: async () =>
      await axiosPrivate.get(`/laboratory/test/list/${id}/?limit=2`, {
        signal: newAbortSignal(30000),
      }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};
export const useFetchSampleTypes = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["sample_types", id],
    queryFn: async () =>
      await axiosPrivate.get(`/laboratory/get-test/sample-type/${id}/`),
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
