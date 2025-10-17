import React, { useContext, useEffect, useState } from "react";

import { TaskList } from "@/types";

import { TaskListsContext } from "@/context";

import { ListIcon } from "@/components";

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

import { Check, ChevronDown } from "lucide-react";

type ListType = Omit<Omit<TaskList, "userId">, "tasksCounter">;

interface TaskListDropdownProps {
  onOpen: () => void;
  onInputFocus: () => void;
  currentTaskList?: TaskList;
  onSelectList: (value: ListType) => void;
}

export const TaskListDropdown: React.FC<TaskListDropdownProps> = ({
  onOpen,
  onInputFocus,
  currentTaskList,
  onSelectList,
}) => {
  const { taskLists } = useContext(TaskListsContext);

  const defaultList = {
    id: "",
    name: "No list",
    color: "lightgray",
  };

  const [lists, setLists] = useState<ListType[]>([]);
  const [selectedTaskList, setSelectedTaskList] = useState<ListType>(defaultList);

  const handleSelectList = (value: ListType) => {
    setSelectedTaskList(value);
    onSelectList(value);
    onInputFocus();
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
    <Listbox value={selectedTaskList} onChange={handleSelectList}>
      <ListboxButton
        type="button"
        onClick={onOpen}
        className="relative flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1.5"
      >
        <div className="flex items-center gap-2">
          <ListIcon color={selectedTaskList.color} emoji={selectedTaskList.emoji} />

          <span className="whitespace-nowrap text-sm">
            {selectedTaskList?.name}
          </span>
        </div>

        <ChevronDown size={15} />
      </ListboxButton>

      <ListboxOptions
        transition
        anchor="bottom end"
        className="absolute z-50 mt-3 rounded-xl border border-gray-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {lists.map((list) => (
          <ListboxOption
            key={list.id}
            value={list}
            className="group flex cursor-default select-none data-[focus]:bg-white/10"
          >
            <button className="flex w-full min-w-36 items-center justify-between gap-2 rounded-md px-3 py-1.5 hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <div>
                  {list.emoji ? (
                    <div>{list.emoji}</div>
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
            </button>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
