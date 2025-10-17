import React, { useCallback, useState, useEffect, createContext } from "react";

import { User } from "@/types";

import { jwtDecode } from "jwt-decode";
import { useGetUser } from "@/hooks/api/user";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  user: User | null;
  isUserPending: boolean;
};

const calculateRemainingTime = (expirationTime: number) => {
  const currentTime = new Date().getTime();

  return expirationTime - currentTime;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const { data: userData, isPending: isUserDataPending } = useGetUser();

  const logout = useCallback(() => {
    setToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("refreshToken");
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    setToken(accessToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const decodedToken = jwtDecode<{ exp: number }>(refreshToken);
    const expirationTime = decodedToken.exp * 1000;

    localStorage.setItem("expirationTime", expirationTime.toString());
  };

  useEffect(() => {
    if (userData) setUser(userData);

    if (!userData && !isUserDataPending) {
      logout();
    }
  }, [userData, isUserDataPending]);

  useEffect(() => {
    if (token) {
      const expirationTime = Number(localStorage.getItem("expirationTime"));
      const remainingTime = calculateRemainingTime(expirationTime);

      if (remainingTime < 0) {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: token !== null,
        login,
        logout,
        user,
        isUserPending: isUserDataPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
