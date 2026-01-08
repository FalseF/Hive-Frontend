import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useContext, useMemo } from "react";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

// Global refresh lock
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const useApi = () => {
  const { accessToken, refreshAccessToken } = useContext(AuthContext);
  const router = useRouter();

  const api = useMemo(() => {
    const instance: AxiosInstance = axios.create({
         baseURL: "https://localhost:7287/api",
        withCredentials: true,
    });

    // ---------- REQUEST interceptor ----------
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
    // ---------- RESPONSE interceptor ----------
    instance.interceptors.response.use(
      (response) => {
        const apiResponse = response.data as ApiResponse<unknown>;

        if (apiResponse.message) {
          toast.success(apiResponse.message);
        }

        // Return full AxiosResponse, unwrap later in wrapper
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400) toast.error(message || "Bad request");
        else if (status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("user");
          router.push("/login");
        } else if (status === 403) toast.error("You don't have permission.");
        else if (status === 404) toast.error("Resource not found.");
        else if (status === 500) toast.error("Server error. Try again later.");
        else toast.error(message || "Unexpected error occurred.");

        return Promise.reject(error);
      }
    );

    // ---------- Typed wrapper methods ----------
    const wrap = <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>) =>
      promise.then((res) => res.data);

    return {
      get: <T>(url: string, config?: AxiosRequestConfig) =>
        wrap<T>(instance.get<ApiResponse<T>>(url, config)),
      post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        wrap<T>(instance.post<ApiResponse<T>>(url, data, config)),
      put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        wrap<T>(instance.put<ApiResponse<T>>(url, data, config)),
      delete: <T>(url: string, config?: AxiosRequestConfig) =>
        wrap<T>(instance.delete<ApiResponse<T>>(url, config)),
      getRaw: (url: string, config?: AxiosRequestConfig) =>
        instance.get(url, config),
    };
  }, []);

  return api;
};

// ---------- Helper ----------
function isTokenExpired(token: string): boolean {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
}
