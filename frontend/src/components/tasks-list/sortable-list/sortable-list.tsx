import React, { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useParams } from "react-router-dom";

import { ListType } from "@/types";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { DragHandle, SortableItem, SortableOverlay } from "../sortable-list";

interface BaseItem {
  id: UniqueIdentifier;
}

interface SortableListProps<T extends BaseItem> {
  items: T[];
  onChange(listType: ListType, items: T[]): void;
  renderItem(item: T, index: number): ReactNode;
}

export const SortableList = <T extends BaseItem>({
  items,
  onChange,
  renderItem,
}: SortableListProps<T>) => {
  const params = useParams();

  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          let listType: ListType = ListType.Default;

          if (params["*"] === "home") {
            listType = ListType.Home;
          } else if (params["*"] === "completed") {
            listType = ListType.Completed;
          } else if (params["*"] === "today") {
            listType = ListType.Today;
          }

          onChange(listType, arrayMove(items, activeIndex, overIndex));

          // console.log("page type", params["*"], items.map((item, index) => ({ ...item, index }))); // update indexes by socket
        }

        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <ul role="application" className="flex flex-col gap-0.5">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? (
          <div className="rounded-lg shadow-sm">
            {renderItem(activeItem, 1)}
          </div>
        ) : null}
      </SortableOverlay>
    </DndContext>
  );
};

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
