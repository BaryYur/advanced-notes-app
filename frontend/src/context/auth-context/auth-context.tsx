import { createContext } from "react";

import { User } from "@/types";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  user: User | null;
  isUserPending: boolean;
};

export const AuthContext = createContext({} as AuthContextType);
