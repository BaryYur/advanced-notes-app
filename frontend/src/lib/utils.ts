import { getHours } from "date-fns";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrentDayPeriod = () => {
  const currentDate = new Date();
  const currentHour = getHours(currentDate);

  let dayPeriod;

  if (currentHour >= 5 && currentHour < 12) {
    dayPeriod = "morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    dayPeriod = "afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    dayPeriod = "evening";
  } else {
    dayPeriod = "night";
  }

  return dayPeriod;
};
