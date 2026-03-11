import React from "react";

import { Theme } from "@/context";

interface ThemeIconProps {
  theme: Theme;
}

const themeColors = {
  light: {
    bg: "bg-[#f3f4f6]",
    inputBg: "bg-[#e5e7eb]",
    itemTextBg: "bg-[#d6d5da]",
    itemBg: "bg-white",
    itemCheckboxBg: "bg-[#d6d5da]",
  },
  dark: {
    bg: "bg-[#232529]",
    inputBg: "bg-[#53575f]",
    itemTextBg: "bg-[#636870]",
    itemBg: "bg-[#2a2e37]",
    itemCheckboxBg: "bg-[#636870]",
  },
  black: {
    bg: "bg-[#000000]",
    inputBg: "bg-[#3b3f44]",
    itemTextBg: "bg-[#494e53]",
    itemBg: "bg-[#15161b]",
    itemCheckboxBg: "bg-[#3b3f44]",
  },
} as const;

export const ThemeIcon: React.FC<ThemeIconProps> = ({ theme }) => {
  return theme === "system" ? (
    <div className="flex h-[100px] w-32 overflow-hidden rounded-md">
      <div className={`${themeColors.light.bg} flex-1 pl-2 pt-3`}>
        <div
          className={`${themeColors.light.inputBg} w-full rounded-l-[4px] p-1.5`}
        >
          <div className={`${themeColors.light.itemTextBg} h-1 w-2/3`} />
        </div>

        <ul className="mt-2 flex flex-col gap-[1px]">
          {[1, 2, 3, 4].map((item, index) => (
            <li
              key={item}
              className={`${themeColors.light.itemBg} ${index === 0 ? "rounded-b-[2px] rounded-tl-[4px]" : "rounded-l-[2px]"} flex h-1/4 items-center gap-1 p-1.5`}
            >
              <div className={`${themeColors.light.itemCheckboxBg} h-1 w-1`} />
              <div
                className={`${themeColors.light.itemTextBg} h-[3px] w-2/3`}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={`${themeColors.dark.bg} flex-1 pr-2 pt-3`}>
        <div
          className={`${themeColors.dark.inputBg} h-4 w-full rounded-r-[4px]`}
        />

        <ul className="mt-2 flex flex-col gap-[1px]">
          {[1, 2, 3, 4].map((item, index) => (
            <li
              key={item}
              className={`${themeColors.dark.itemBg} ${index === 0 ? "rounded-b-[2px] rounded-tr-[4px]" : "rounded-r-[2px]"} flex h-4 items-center gap-1 p-1.5`}
            />
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div
      className={`${themeColors[theme].bg} h-[100px] w-32 overflow-hidden rounded-md px-2 pt-3`}
    >
      <div
        className={`${themeColors[theme].inputBg} w-full rounded-[4px] p-1.5`}
      >
        <div className={`${themeColors[theme].itemTextBg} h-1 w-1/3`} />
      </div>
      <ul className="mt-2 flex flex-col gap-[1px]">
        {[1, 2, 3, 4].map((item, index) => (
          <li
            key={item}
            className={`${themeColors[theme].itemBg} ${index === 0 ? "rounded-b-[2px] rounded-t-[4px]" : "rounded-[2px]"} flex h-1/4 items-center gap-1 p-1.5`}
          >
            <div className={`${themeColors[theme].itemCheckboxBg} h-1 w-1`} />
            <div className={`${themeColors[theme].itemTextBg} h-[3px] w-1/3`} />
          </li>
        ))}
      </ul>
    </div>
  );
};
