import { useEffect } from "react";

export const useGetPageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
