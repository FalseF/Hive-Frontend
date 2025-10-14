"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  //refreshAccessToken: () => Promise<void>;
   refreshAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  //refreshAccessToken: async () => {},
   refreshAccessToken: async () => "",
  
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   refreshAccessToken();
  // }, [])

  const login = async (username: string, password: string) => {
    console.log("auth ")
    const res = await axios.post<{ accessToken: string }>(
      "https://localhost:7287/api/auth/login",
      { username, password },
      { withCredentials: true, 
        headers: { "Content-Type": "application/json"}
      }
    );

  };

  // const refreshAccessToken = async () => {
  //   try {
  //     const res = await axios.post<{ accessToken: string }>(
  //       "https://localhost:7287/api/auth/refresh",
  //       {},
  //       { withCredentials: true }
  //     );
  //     setAccessToken(res.data.accessToken);
  //     decodeAndSetUser(res.data.accessToken);
  //   } catch {
  //     setAccessToken(null);
  //     setUser(null);
  //   }
  // };

  const refreshAccessToken = async (): Promise<string> => {
  try {
     console.log("api called for:");
    const res = await axios.post<{ accessToken: string }>(
        "https://localhost:7287/api/auth/refresh",
        {},
        { withCredentials: true }
      );
    const newToken = res.data.accessToken;

    // update context or localStorage here
   

    return newToken;
  } catch (err) {
    console.error("Failed to refresh token", err);
     setAccessToken(null);
     setUser(null);
    throw err;
  }
};

  const logout = async () => {
    await axios.post("https://localhost:7287/api/auth/logout", {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  const decodeAndSetUser = (token: string) => {
    type JwtPayload = {
      nameid?: string;
      sub?: string;
      email: string;
      unique_name?: string;
      name?: string;
      role?: string | string[];
    };

    const decoded: JwtPayload = jwtDecode(token);
    setUser({
      id: decoded.nameid || decoded.sub || "",
      email: decoded.email,
      username: decoded.unique_name || decoded.name || "",
      roles: Array.isArray(decoded.role) ? decoded.role : decoded.role ? [decoded.role] : [],
    });
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
