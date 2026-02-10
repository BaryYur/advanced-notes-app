import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Calendar,
} from "@/components";

import { CalendarDays } from "lucide-react";

interface DatePickerDropdownProps {
  value?: Date;
  onOpen: () => void;
  onSelect: (value?: Date) => void;
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  value,
  onSelect,
  onOpen,
}) => {
  return (
    <DropdownMenu onOpenChange={() => onOpen()}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative rounded-md bg-gray-100 px-2 py-1.5"
          onClick={onOpen}
        >
          <CalendarDays size={18} />
          {value && (
            <div className="absolute -right-1 -top-1 h-[9px] w-[9px] rounded-sm border border-white bg-blue-500" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        onClick={(event) => event.stopPropagation()}
        className="z-50 mt-3 rounded-2xl border border-gray-200 bg-white p-1 text-sm/6 shadow-none"
      >
        <Calendar mode="single" selected={value} onSelect={onSelect} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
