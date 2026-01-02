import React, { useCallback, useState, createContext, useEffect } from "react";

import { User } from "@/types";

import { useGetUser } from "@/hooks/api";

import Cookies from "js-cookie";

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

  const logout = useCallback(() => {
    // setUser(null);
    // Cookies.remove("accessToken");
    console.log(Cookies.get("accessToken"));
  }, []);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, [userData, isUserDataPending]);

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
