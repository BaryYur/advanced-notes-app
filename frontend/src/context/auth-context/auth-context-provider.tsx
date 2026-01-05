import React, { useState, useEffect } from "react";

import { AuthContext } from "./auth-context";

import { User } from "@/types";

import { useGetUser, useLogout } from "@/hooks/api";

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { data: userData, isPending: isUserDataPending } = useGetUser();
  const { mutate: logoutMutation, isSuccess: isLogoutSuccess } = useLogout();

  const logout = () => {
    logoutMutation();
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, [userData, isUserDataPending]);

  useEffect(() => {
    if (isLogoutSuccess) {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [isLogoutSuccess]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        logout,
        user,
        isUserPending: isUserDataPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
