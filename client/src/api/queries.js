import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useFetchRequests = () => {
  const user = useSelector(selectCurrentUser);
  const url =
    user?.account_type === "Clinician"
      ? "/hospital/sample/list/"
      : "/laboratory/samples-list/";
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Requests"],
    queryFn: async () => await axiosPrivate.get(url),
    refetchOnWindowFocus: false,
  });
};

//deliveries
export const useFetchAllDeliveries = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["All Deliveries"],
    queryFn: async () => await axiosPrivate.get("/delivery/delivery/all/"),
    refetchOnWindowFocus: false,
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
  });
};
export const useFetchLabTests = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Lab Tests",id],
    queryFn: async () => await axiosPrivate.get(`/laboratory/test/list/${id}/`),
    refetchOnWindowFocus: false,
    enabled:!!id
  });
};
export const useFetchLabDepartments = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => await axiosPrivate.get(`/laboratory/department/list/`),
    refetchOnWindowFocus: false,
  });
};
export const useFetchUserLab = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["userlabs"],
    queryFn: async () => await axiosPrivate.get(`/laboratory/list/`),
    refetchOnWindowFocus: false,
  });
};
