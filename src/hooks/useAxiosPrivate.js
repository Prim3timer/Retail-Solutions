import { axiosPrivate } from "../app/api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  useEffect(() => {
    // interceptors are like vanilla javascript event listeners
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // if the Authorization header does not exist then we know it's not a retry
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      // if the response is good we just return it
      (response) => response,
      // if access token has expired
      async (error) => {
        const prevRequest = error?.config;
        // if request fail due to expired access token and if sent does
        // not exist (the custom sent property
        // aviods endless loop by making sure retry happens only once)
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          console.log(newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // now we should have a new accessToken with to which to retry the request
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      // clean up the response interceptors
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);
  return axiosPrivate;
};

export default useAxiosPrivate;
