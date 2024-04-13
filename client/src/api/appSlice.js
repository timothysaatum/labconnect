import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setCredentials, LogOut } from "@/redux/auth/authSlice";

const Base_url = "http://localhost:8000/api/";
const baseQuery = fetchBaseQuery({
  baseUrl: Base_url,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    console.log( token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      console.log(`Bearer ${token}`)
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("result", result);

  if (result?.error?.status === 401) {
    console.log("sending refresh token request");

    //send refresh token request to get new access token

    const refreshResult = await baseQuery(
      "/user/refresh/token/",
      api,
      extraOptions
    );
    console.log("refreshResult", refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      //store new token

      api.dispatch(setCredentials({ ...refreshResult.data, user }));

      //re-run the initial request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(LogOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
