import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import axios from "./axios";

export const useFetchLabRequests = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Requests"],
    queryFn: async () => await axiosPrivate.get("/laboratory/samples-list/"),
    staleTime: 1000 * 60 * 5,
  });
};
export const useFetchClinicianRequests = () => {
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
export const useFetchAllLabs = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["All labs"],
    queryFn: async () => await axiosPrivate.get("/laboratory/laboratory/all/"),
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
    queryFn: async () => await axiosPrivate.get(`/laboratory/list/`),
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