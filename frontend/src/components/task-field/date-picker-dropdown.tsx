import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Calendar,
} from "@/components";

import { format } from "date-fns";

import { CalendarDays } from "lucide-react";

interface DatePickerDropdownProps {
  value?: Date | null;
  isTaskBar?: boolean;
  onOpen?: () => void;
  onSelect: (value?: Date) => void;
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  value,
  isTaskBar = false,
  onSelect,
  onOpen,
}) => {
  return (
    <DropdownMenu onOpenChange={() => onOpen?.()}>
      <DropdownMenuTrigger asChild>
        <button
          className={`${isTaskBar ? "bg-white" : "bg-gray-100"} relative flex items-center gap-2 rounded-md px-2 py-1.5`}
          onClick={onOpen}
        >
          <CalendarDays size={18} />

          {value && !isTaskBar && (
            <div className="absolute -right-1 -top-1 h-[9px] w-[9px] rounded-sm border border-white bg-blue-500" />
          )}

          {isTaskBar && (
            <div className="text-xs">
              {value ? (
                <span>{format(value, "MM-dd-yyyy")}</span>
              ) : (
                <span>Schedule</span>
              )}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        onClick={(event) => event.stopPropagation()}
        className={`${isTaskBar ? "mt-1" : "mt-2.5"} z-50 rounded-2xl border border-gray-200 bg-white p-1 text-sm/6 shadow-none`}
      >
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={onSelect}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
