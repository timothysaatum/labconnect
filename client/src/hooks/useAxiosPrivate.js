import { axiosPrivate } from "@/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { setAccess } from "@/redux/auth/authSlice";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },(error)=>Promise.reject(error)
        )
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => {
              return response;
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest.sent){
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    dispatch(setAccess(newAccessToken));
                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                } 
                return Promise.reject(error);
            }
        );

        return ()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    },[accessToken,refresh])


    return axiosPrivate;
}

export default useAxiosPrivate;