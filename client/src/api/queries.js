import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useFetchRequests =  () => {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
    queryKey: ["Requests"],
    queryFn: async ()=> await axiosPrivate.get("/hospital/sample/list/"),
    refetchOnWindowFocus: false,
  });
};
