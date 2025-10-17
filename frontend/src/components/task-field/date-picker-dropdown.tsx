import React from "react";

import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { Calendar } from "@/components";

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
    <Menu>
      <MenuButton
        type="button"
        onClick={onOpen}
        className="relative rounded-md bg-gray-100 px-2 py-1.5"
      >
        <CalendarDays size={18} />

        {value && (
          <div className="absolute -right-1 -top-1 h-[9px] w-[9px] rounded-sm border border-white bg-blue-500" />
        )}
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        onClick={(event) => event.stopPropagation()}
        className="absolute z-50 mt-3 rounded-xl border border-gray-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <Calendar mode="single" selected={value} onSelect={onSelect} />
      </MenuItems>
    </Menu>
  );
};
