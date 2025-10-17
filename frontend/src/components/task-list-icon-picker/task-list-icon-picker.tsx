import React, { useMemo } from "react";

import {
  Menu,
  MenuButton,
  MenuItems,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@headlessui/react";
import { TaskListColorSelector } from "@/components";

import { Plus, ChevronDown } from "lucide-react";

interface TaskListIconPickerProps {
  isActive: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onOpen: () => void;
}

export const TaskListIconPicker: React.FC<TaskListIconPickerProps> = ({
  isActive,
  selectedColor,
  onColorChange,
  onOpen,
}) => {
  const tabs = useMemo(() => {
    return [
      {
        name: "Color",
        title: "Colors",
        component: (
          <TaskListColorSelector selectedColor={selectedColor} onColorChange={onColorChange} />
        ),
      },
      {
        name: "Emoji",
        title: "Emojis",
        component: <div className="p-2">emojis</div>
      },
    ];
  }, [selectedColor, onColorChange]);

  return (
    <div className="relative">
      <Menu>
        <MenuButton
          type="button"
          onClick={onOpen}
          className="flex rounded-md data-[open]:bg-gray-100"
        >
          <div
            className={`${isActive ? "" : "hidden"} flex items-center gap-2 rounded-lg px-2 py-2 transition-all duration-300 hover:bg-gray-100 group-hover:bg-gray-100`}
          >
            {
              <div>
                <div style={{ borderColor: selectedColor }} className="h-2.5 w-2.5 rounded-sm border-[2px]" />
              </div>
            }
            <ChevronDown size={15} />
          </div>

          <div
            className={`${isActive ? "hidden" : ""} flex rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 group-hover:bg-gray-100`}
          >
            <Plus size={15} />
          </div>
        </MenuButton>

        <MenuItems
          transition
          onClick={(event) => event.stopPropagation()}
          anchor="bottom start"
          className="absolute z-50 mt-1.5 w-80 rounded-xl border border-gray-200 bg-white text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div>
            <TabGroup>
              <TabList className="flex gap-2 p-1.5">
                {tabs.map(({ name }) => (
                  <Tab
                    key={name}
                    className="rounded-md px-3 py-1.5 data-[selected]:bg-gray-100"
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>

              <TabPanels className="mt-1">
                {tabs.map(({ name, component }) => (
                  <TabPanel key={name} className="rounded-xl bg-white/5">
                    {component}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};
