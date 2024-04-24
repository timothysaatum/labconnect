import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useFetchRequests =  () => {
  const user = useSelector(selectCurrentUser)
  const url =
    user?.account_type === "Clinician"
      ? "/hospital/sample/list/"
      : "/laboratory/samples-list/";
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ["Requests"],
    queryFn: async ()=> await axiosPrivate.get(url),
    refetchOnWindowFocus: false,
  });
};
