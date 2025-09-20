import axios, { AxiosInstance } from "axios";
import { useContext ,useMemo } from "react";
import AuthContext from "../context/AuthContext";

// const api: AxiosInstance = axios.create({
//   baseURL: "https://localhost:7287/api",
//   withCredentials: true,
// });

// export const useApi = () => {
//   const { accessToken, refreshAccessToken } = useContext(AuthContext);

//   console.log("above ",accessToken);

//   // api.interceptors.request.use(async (config) => {
//   //   if (!accessToken || isTokenExpired(accessToken)) {
//   //     await refreshAccessToken();
//   //   }
//   //   if (config.headers) {
//   //     console.log("inside ",accessToken);
//   //     config.headers.Authorization = `Bearer ${accessToken}`;
//   //   }
//   //   console.log("outside ",accessToken);

//   //   return config;
//   // });
//   api.interceptors.request.use(
//   async (config) => {
//     let token = accessToken;

//     // If token is missing or expired, refresh it
//     if (!token || isTokenExpired(token)) {
//       console.log("call from validate token");
//       token = await refreshAccessToken(); 
//       console.log("new token",token);
//     }

//     // Attach the latest token to headers
//     if (config.headers && token) {
//       console.log("token with header",token);
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

//   return api;
// };

// function isTokenExpired(token: string): boolean {
//   const payload = JSON.parse(atob(token.split(".")[1]));
//   console.log("payle",payload);
//   return payload.exp * 1000 < Date.now();
// }


// Global refresh lock
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const useApi = (): AxiosInstance => {
  const { accessToken, refreshAccessToken } = useContext(AuthContext);

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