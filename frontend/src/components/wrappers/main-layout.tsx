import React from "react";

import { NavBar } from "../nav-bar/nav-bar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <NavBar />

      <div 
        className="ml-0 w-full lg:ml-[365px]"
      >
        {children}
      </div>
    </div>
  );
};
