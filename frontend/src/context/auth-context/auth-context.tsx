import { createContext } from "react";

import { User } from "@/types";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserPending: boolean;
  clearAuthData: () => void;
  setAuthData: () => void;
};

export const AuthContext = createContext({} as AuthContextType);
