import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

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
    queryFn: async () =>
      await axiosPrivate.get("/laboratory/laboratories/all/"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
export const useFetchLabTests = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Lab Tests", id],
    queryFn: async () => await axiosPrivate.get(`/laboratory/test/list/${id}/`),
    refetchOnWindowFocus: false,
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};
export const useFetchLabDepartments = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => await axiosPrivate.get(`/laboratory/department/list/`),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
export const useFetchUserLab = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["userlabs"],
    queryFn: async () => await axiosPrivate.get(`/laboratory/list/`),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
