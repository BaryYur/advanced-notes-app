import { useContext, useState } from "react";

import { AuthContext } from "@/context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components";

import { ChevronsUpDown, LogOutIcon, Settings } from "lucide-react";

export const NavBarUserDropdown = () => {
  const { user, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);

  const userBox = (
    <div className="flex items-center gap-2">
      <div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 text-xs text-white">
          {user?.firstName[0]}
        </div>
      </div>
      <div className="flex flex-col items-start gap-0.5 text-xs">
        <span className="font-semibold">
          {user?.firstName} {user?.lastName}
        </span>
        <span>{user?.email}</span>
      </div>
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`${isOpen ? "bg-gray-100/50" : ""} relative flex w-full items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-gray-100/50`}
      >
        {userBox}
        <ChevronsUpDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="top"
        className="absolute -bottom-[60px] -right-[260px] z-50 w-64 rounded-xl border border-gray-200 bg-white p-1.5 text-sm/6 shadow-none transition duration-100 ease-out"
      >
        <div className="pb-2">{userBox}</div>

        <div className="border-t py-1">
          <button className="flex w-full items-center justify-start gap-2 rounded-md px-1 py-1.5 hover:bg-gray-100">
            <Settings size={16} />
            <span className="text-[13px] font-medium">Settings</span>
          </button>
        </div>

        <div className="border-t pt-1">
          <button
            className="flex w-full items-center justify-start gap-2 rounded-md px-1 py-1.5 hover:bg-gray-100"
            onClick={logout}
          >
            <LogOutIcon size={16} />
            <span className="text-[13px] font-medium">Log out</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
