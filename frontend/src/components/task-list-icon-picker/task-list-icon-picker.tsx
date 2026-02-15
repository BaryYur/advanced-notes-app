import React, { useMemo } from "react";

import {
  TaskListColorSelector,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components";

import { EmojiPicker } from "@ferrucc-io/emoji-picker";

import { Plus, ChevronDown } from "lucide-react";

interface TaskListIconPickerProps {
  isActive: boolean;
  selectedColor: string;
  selectedEmoji: string | null;
  onColorChange: (color: string) => void;
  onEmojiChange: (emoji: string) => void;
  onOpen: () => void;
}

export const TaskListIconPicker: React.FC<TaskListIconPickerProps> = ({
  isActive,
  selectedColor,
  selectedEmoji,
  onColorChange,
  onEmojiChange,
  onOpen,
}) => {
  const tabs = useMemo(() => {
    return [
      {
        name: "Color",
        title: "Colors",
        component: (
          <TaskListColorSelector
            selectedColor={selectedColor}
            onColorChange={onColorChange}
          />
        ),
      },
      {
        name: "Emoji",
        title: "Emoji",
        component: (
          <div className="w-[360px] pb-2">
            <EmojiPicker
              onEmojiSelect={onEmojiChange}
              className="custom-scrollbar max-h-[300px] w-full border-none bg-transparent shadow-none"
            >
              <EmojiPicker.Header>
                <EmojiPicker.Input
                  placeholder="Search emoji"
                  className="bg-zinc-100 py-5 pl-8"
                />
              </EmojiPicker.Header>
              <EmojiPicker.Group className="custom-scrollbar mt-2">
                <EmojiPicker.List hideStickyHeader={true} />
              </EmojiPicker.Group>
            </EmojiPicker>
          </div>
        ),
      },
    ];
  }, [selectedColor, onColorChange]);

  return (
    <DropdownMenu onOpenChange={() => onOpen()}>
      <DropdownMenuTrigger asChild>
        <button
          className={`${isActive ? "bg-gray-100" : ""} z-40 flex rounded-md`}
        >
          <div
            className={`${isActive ? "" : "hidden"} flex items-center gap-2 rounded-lg px-2 py-2 transition-all duration-300 hover:bg-gray-100 group-hover:bg-gray-100`}
          >
            {selectedEmoji ? (
              <span className="text-xs">{selectedEmoji}</span>
            ) : (
              <div>
                <div
                  style={{ borderColor: selectedColor }}
                  className="h-2.5 w-2.5 rounded-sm border-[2px]"
                />
              </div>
            )}
            <ChevronDown size={15} />
          </div>

          <div
            className={`${isActive ? "hidden" : ""} flex rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 group-hover:bg-gray-100`}
          >
            <Plus size={15} />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        onClick={(event) => event.stopPropagation()}
        className="z-50 mt-1.5 min-w-80 rounded-2xl border border-gray-200 bg-white p-1 text-sm/6 shadow-none"
      >
        <Tabs defaultValue={tabs[0].name}>
          <TabsList className="bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.name}
                value={tab.name}
                className="rounded-md px-3 py-1.5 shadow-none"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.name} value={tab.name}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
