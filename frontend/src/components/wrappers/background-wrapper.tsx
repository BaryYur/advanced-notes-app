import React from "react";

interface BackgroundWrapperProps {
  currentColor?: string;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ currentColor = "#60A5FA" }) => {
  return (
    <>
      <div
        style={{ backgroundColor: currentColor }} 
        className="fixed left-0 -top-[220px] z-0 h-[280px] w-full rounded-b-[100%] opacity-20 blur-2xl"
      />
      <div
        style={{ backgroundColor: currentColor }} 
        className="fixed -bottom-[250px] left-0 z-0 h-[280px] w-full rounded-b-[100%] opacity-20 blur-2xl"
      />
    </>
  );
};
