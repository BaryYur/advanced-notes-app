import React from "react";

import { cn } from "@/lib/utils";

interface ListIconProps {
  color: string;
  emoji?: string;
  emojiClassName?: string;
  className?: string;
}

export const ListIcon: React.FC<ListIconProps> = ({
  color,
  emoji,
  emojiClassName,
  className,
}) => {
  return (
    <>
      {emoji ? (
        <div className={cn("text-xl", emojiClassName)}>{emoji}</div>
      ) : (
        <div>
          <div
            style={{ borderColor: color }}
            className={cn(
              `h-[9px] w-[9px] rounded-[3.5px] border-[2px]`,
              className,
            )}
          />
        </div>
      )}
    </>
  );
};
