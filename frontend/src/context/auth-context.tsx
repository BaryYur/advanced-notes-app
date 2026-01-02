import React, { useState, createContext, useEffect } from "react";

import { User } from "@/types";

import { useGetUser, useLogout } from "@/hooks/api";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  user: User | null;
  isUserPending: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

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
