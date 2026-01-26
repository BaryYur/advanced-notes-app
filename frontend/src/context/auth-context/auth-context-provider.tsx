import React, { useState, useEffect } from "react";

import { useGetUser } from "@/hooks/api";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./auth-context";

import { User } from "@/types";

import { AuthApiService } from "@/services";

import { pageRoutes } from "@/config";

import { handleToastError } from "@/errors";

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true" || false,
  );
  const [user, setUser] = useState<User | null>(null);

  const { data: userData, isPending: isUserDataPending } = useGetUser();

  const clearAuthData = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUser(null);
  };

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => AuthApiService.logout(),
    onSuccess: () => {
      clearAuthData();
      navigate(`/${pageRoutes.signIn}`);
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  const logout = () => {
    logoutMutation();
  };

  const setAuthData = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setAuthData();
    }
  }, [userData]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        logout,
        user,
        setUser,
        isUserPending: isUserDataPending,
        clearAuthData,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
