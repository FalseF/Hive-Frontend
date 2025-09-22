import axios, { AxiosInstance } from "axios";
import { useContext ,useMemo } from "react";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


// Global refresh lock
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const useApi = (): AxiosInstance => {
  const { accessToken, refreshAccessToken } = useContext(AuthContext);
  const router = useRouter();

  //useMemo ensures only one Axios instance per hook.
  const api = useMemo(() => { 
    const instance = axios.create({
      baseURL: "https://localhost:7287/api",
      withCredentials: true,
    });

    instance.interceptors.request.use(
      async (config) => {
        let token = accessToken;

        config.headers = config.headers || {};

        // If no token or expired → refresh
        if (!token || isTokenExpired(token)) {
          if (!isRefreshing) {
            // Start a single refresh request
            isRefreshing = true;
            refreshPromise = refreshAccessToken().finally(() => {
              isRefreshing = false;
            });
          }

          // Wait for that refresh to finish
          token = await refreshPromise!;
        }

        // Attach token to request
        if (config.headers && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    //below are used if you want to access message and status direcly 

//     instance.interceptors.response.use((response) => {
//   const { message, data, success } = response.data;
//   //console.log(message,data,success);

//   // Optional toast
//   if (message) toast.success(message);

//   // Return flattened structure
//   return {
//     message,
//     data,     // roles array
//     success
//   } as any; ;
// });

      // ---------- RESPONSE interceptor  ----------
  instance.interceptors.response.use(
    (response) => {
      if (response.data.success && response.data?.message) {
        toast.success(response.data.message);
      }
      return response// if  we return direct response the acceess this like res.data.data, res.data.message
       //return response.data;// now its access res.data (the backend sending data ) but here cant access message because interceptor 
                            //assign the value into their data  sothat cant dierct access data.message
    },
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Bad request");
      } else if (status === 401) {
        toast.error("Session expired. Please log in again.");
        // localStorage.removeItem("user");
        // router.push("/login");
      } else if (status === 403) {
        toast.error("You don’t have permission.");
      } else if (status === 404) {
        toast.error("Resource not found.");
      } else if (status === 500) {
        toast.error("Server error. Try again later.");
      } else {
        toast.error(message || "Unexpected error occurred.");
      }

      return Promise.reject(error);
    }
  );

    return instance;
  }, [ ]);
   //}, [accessToken, refreshAccessToken]); call this when the token change 

  return api;
};

// helper
function isTokenExpired(token: string): boolean {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
}