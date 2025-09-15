import axios, { AxiosInstance } from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const api: AxiosInstance = axios.create({
  baseURL: "https://localhost:7287/api",
  withCredentials: true,
});

export const useApi = () => {
  const { accessToken, refreshAccessToken } = useContext(AuthContext);

  api.interceptors.request.use(async (config) => {
    if (!accessToken || isTokenExpired(accessToken)) {
      await refreshAccessToken();
    }
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return api;
};

function isTokenExpired(token: string): boolean {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
}
