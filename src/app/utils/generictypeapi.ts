
import axios, { AxiosInstance } from "axios";
import { useContext, useMemo } from "react";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

// Typed Axios instance: generic returns T directly
interface TypedAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

// Global refresh lock
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const useApi = (): TypedAxiosInstance => {
  const { accessToken, refreshAccessToken } = useContext(AuthContext);
  const router = useRouter();

  const api = useMemo(() => {
    const instance: TypedAxiosInstance = axios.create({
      baseURL: "https://localhost:7287/api",
      withCredentials: true,
    }) as TypedAxiosInstance;

    // ---------- REQUEST interceptor ----------
    instance.interceptors.request.use(
      async (config) => {
        let token = accessToken;
        config.headers = config.headers || {};

        if (!token || isTokenExpired(token)) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken().finally(() => {
              isRefreshing = false;
            });
          }
          token = await refreshPromise!;
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ---------- RESPONSE interceptor ----------
    instance.interceptors.response.use(
      (response) => {
        const apiResponse = response.data as ApiResponse<any>;

        if (apiResponse.message) {
          toast.success(apiResponse.message);
        }

        // Return only the data part (T)
        return apiResponse.data;
      },
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400) toast.error(message || "Bad request");
        else if (status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("user");
          router.push("/login");
        } else if (status === 403) toast.error("You don’t have permission.");
        else if (status === 404) toast.error("Resource not found.");
        else if (status === 500) toast.error("Server error. Try again later.");
        else toast.error(message || "Unexpected error occurred.");

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return api;
};

// ---------- Helper ----------
function isTokenExpired(token: string): boolean {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
}
