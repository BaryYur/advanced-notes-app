import { useEffect, useRef, useState } from "react";

interface useOutsideClickProps {
  onOutsideClick?: (event?: MouseEvent) => void;
  dependencies?: unknown[];
}

export const useOutsideClick = <T extends HTMLElement>({
  onOutsideClick,
  dependencies = [],
}: useOutsideClickProps) => {
  const elementRef = useRef<T | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        onOutsideClick?.(event);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [...dependencies]);

  return {
    elementRef,
    isActive,
    setIsActive,
  };
};
