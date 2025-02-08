import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios from "./axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";

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

export const useFetchLabRequestsReceived = (id, querys) => {
  if (
    querys?.status === "All" ||
    querys.status === undefined ||
    querys.status === ""
  ) {
    const { status, ...rest } = querys;
    querys = rest;
  }
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["RequestsReceived", id, querys],
    queryFn: async () =>
      await axiosPrivate.get(`/laboratory/samples-list/${id}/`, {
        params: querys,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    placeholderData: keepPreviousData,
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
export const useFetchLabCardCount = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["SampleCounts", id],
    queryFn: async () =>
      await axiosPrivate.get(
        `/sample/get-sample-counts-for-facility/${id}/`
      ),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
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
export const useFetchSampleTracking = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["tracking", id],
    queryFn: async () =>
      await axiosPrivate.get(`/sample/get-tracker-details/${id}/`),
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
export const useFetchAllLabsBranches = (query) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["All labs", query],
    queryFn: async () =>
      await axiosPrivate.get("/laboratory/branch/all/", {
        params: query,
      }),
    refetchOnWindowFocus: false,
    staleTime: 100000 * 60 * 60,
  });
};
export const useFetchLabTests = (id, querys) => {
  if (
    querys?.test_status === "All" ||
    querys?.test_status === undefined ||
    querys?.test_status === ""
  ) {
    const { test_status, ...rest } = querys;
    querys = rest;
  }
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["tests", id, querys],
    queryFn: async () =>
      await axiosPrivate.get(`/laboratory/test/list/${id}/`, {
        params: querys,
      }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!id,
    staleTime: 10000 * 60 * 60,
  });
};
export const useFetchInfiniteLabTests = (id, querys, cursorOptions) => {
  if (
    querys?.test_status === "All" ||
    querys?.test_status === undefined ||
    querys?.test_status === ""
  ) {
    const { test_status, ...rest } = querys;
    querys = rest;
  }
  const axiosPrivate = useAxiosPrivate();
  return useInfiniteQuery({
    queryKey: ["infinitetests", id, querys],
    queryFn: async ({ pageParam }) =>
      await axiosPrivate.get(`/laboratory/test/list/${id}/`, {
        params: { ...querys, cursor: pageParam },
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      console.log(cursorOptions);
      console.log("next cursor", cursorOptions.next);
      return cursorOptions.next;
    },
    enabled: !!id,
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
    staleTime: Infinity,
  });
};

export const useFetchUserBranches = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["userbranches"],
    queryFn: async () => await axiosPrivate.get(`/laboratory/branch/list/`),
    staleTime: Infinity,
  });
};
export const useFetchLabManagers = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["labmanagers"],
    queryFn: async () =>
      await axiosPrivate.get(`/user/fetch-lab-managers/${id}/`),
    staleTime: Infinity,
    enabled: !!id,
  });
};
export const useFetchBranchNotifications = (id) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Notifications"],
    queryFn: async () => await axiosPrivate.get(`/sample/notifications/${id}/`),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60,
    enabled: !!id,
  });
};

//hospitals
export const useFetchUserHospital = () => {
  const user = useSelector(selectCurrentUser);

  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Hospital"],
    queryFn: async () => await axiosPrivate.get("/hospital/get-user-hospital/"),
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: user?.account_type === "Hospital",
  });
};

export const useFetchAllHospitals = () => {
  return useQuery({
    queryKey: ["All hospitals"],
    queryFn: async () => await axios.get("/hospital/list/"),
    staleTime: 1000 * 60 * 60,
  });
};

export const useFetchHospitalRequests = (querys) => {
  if (
    querys?.status === "All" ||
    querys.status === undefined ||
    querys.status === ""
  ) {
    const { status, ...rest } = querys;
    querys = rest;
  }
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["Requests", querys],
    queryFn: async () =>
      await axiosPrivate.get("/hospital/health-worker/sample/list/", {
        params: querys,
      }),
    staleTime: 1000 * 60 * 5,
  });
};
