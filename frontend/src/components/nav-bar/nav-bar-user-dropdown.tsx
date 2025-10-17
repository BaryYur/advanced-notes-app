import { useContext } from "react";

import { AuthContext } from "@/context";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { ChevronsUpDown, LogOutIcon, Settings } from "lucide-react";

export const NavBarUserDropdown = () => {
  const { user, logout } = useContext(AuthContext);

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
    <div className="relative">
      <Menu>
        <MenuButton className="relative flex w-full items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-gray-100/50 data-[open]:bg-gray-100/50">
          {userBox}
          <ChevronsUpDown size={16} />
        </MenuButton>

        <MenuItems
          transition
          className="absolute -right-[260px] bottom-0 z-50 w-64 rounded-xl border border-gray-200 bg-white p-1.5 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <div className="pb-2">{userBox}</div>
          </MenuItem>

          <MenuItem>
            <div className="py-1 border-t">
              <button className="w-full flex items-center gap-2 justify-start hover:bg-gray-100 px-1 py-1.5 rounded-md">
                <Settings size={16} />
                <span className="font-medium text-[13px]">Settings</span>
              </button>
            </div>
          </MenuItem>

          <MenuItem>
            <div className="pt-1 border-t">
              <button 
                className="w-full flex items-center gap-2 justify-start hover:bg-gray-100 px-1 py-1.5 rounded-md"
                onClick={logout}
              >
                <LogOutIcon size={16} />
                <span className="font-medium text-[13px]">Log out</span>
              </button>
            </div>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
