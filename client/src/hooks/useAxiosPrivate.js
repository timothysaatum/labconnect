import { axiosPrivate } from "@/api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { selectCurrenttoken} from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const token = useSelector(selectCurrenttoken);

    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${token}`;
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
                if (error?.response?.status === 401 && !prevRequest.sent){
                    console.log('new access')
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
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
    },[token,refresh])


    return axiosPrivate;
}

export default useAxiosPrivate;