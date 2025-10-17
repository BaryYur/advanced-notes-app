import { createContext, useContext, useMemo } from "react";
import type { CSSProperties, PropsWithChildren } from "react";

import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
// import { GripVertical } from "lucide-react";

interface Props {
  id: UniqueIdentifier;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export const SortableItem = ({ children, id }: PropsWithChildren<Props>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} style={style} className="relative z-10 list-none">
        {children}
      </li>
    </SortableItemContext.Provider>
  );
};

export const DragHandle = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      {...attributes}
      {...listeners}
      ref={ref}
      className="absolute left-0 top-0 z-10 h-full w-full"
      // className="absolute left-2 inset-y-1"
    >
      {/* <GripVertical size={15} /> */}
    </button>
  );
};
