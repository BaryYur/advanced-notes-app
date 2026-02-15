import React, { useEffect, useState, useContext } from "react";

import { TaskListContext } from "@/context";

import { TaskList } from "@/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

import { Check } from "lucide-react";

type ListType = Omit<Omit<TaskList, "userId">, "tasksCounter">;

interface TaskListDropdownProps {
  onOpen: () => void;
  onClose: () => void;
  onInputFocus: () => void;
  currentTaskList?: TaskList;
  onSelectList: (value: ListType) => void;
}

export const TaskListDropdown: React.FC<TaskListDropdownProps> = ({
  onOpen,
  onClose,
  onInputFocus,
  currentTaskList,
  onSelectList,
}) => {
  const { taskLists } = useContext(TaskListContext);

  const defaultList = {
    id: "",
    name: "No list",
    color: "lightgray",
  };

  const [lists, setLists] = useState<ListType[]>([]);
  const [selectedTaskList, setSelectedTaskList] =
    useState<ListType>(defaultList);

  const handleSelectList = (value: string) => {
    const list = lists.find((list) => list.name === value);

    if (list) {
      setSelectedTaskList(list);
      onSelectList(list);
      onInputFocus();
      onClose();
    }
  };

  const createListboxLists = () => {
    const listboxLists = taskLists.map((list) => ({
      id: list.id,
      name: list.name,
      color: list.color,
      emoji: list.emoji,
    }));

    setLists([...listboxLists, defaultList]);
  };

  useEffect(() => {
    createListboxLists();
  }, [taskLists]);

  useEffect(() => {
    if (currentTaskList) {
      setSelectedTaskList({
        id: currentTaskList.id,
        name: currentTaskList.name,
        color: currentTaskList.color,
        emoji: currentTaskList.emoji,
      });
    }
  }, [currentTaskList]);

  return (
    <Select
      value={selectedTaskList.name}
      onOpenChange={() => onOpen()}
      onValueChange={(value) => handleSelectList(value)}
    >
      <SelectTrigger className="relative flex h-[30px] items-center gap-1 rounded-md border border-none border-red-400 bg-gray-100 px-2 py-0 shadow-none">
        <SelectValue placeholder="List" />
      </SelectTrigger>
      <SelectContent
        align="end"
        side="bottom"
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="mt-2.5 rounded-xl"
      >
        <SelectGroup>
          {lists.map((list) => (
            <SelectItem
              key={list.id}
              value={list.name}
              className="flex h-[30px] w-full min-w-36 cursor-pointer items-center justify-between gap-2 rounded-md px-3 hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    {list.emoji ? (
                      <div className="text-xs">{list.emoji}</div>
                    ) : (
                      <div>
                        <div
                          style={{ borderColor: list.color }}
                          className="h-[8px] w-[8px] rounded-[3px] border-[2px]"
                        />
                      </div>
                    )}
                  </div>

                  <span className="text-xs">{list.name}</span>
                </div>

                <Check
                  size={13}
                  className="invisible fill-white group-data-[selected]:visible"
                />
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
