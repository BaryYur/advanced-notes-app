import React from "react";

import { COLORS } from "@/lib/data";

interface TaskListColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const TaskListColorSelector: React.FC<TaskListColorSelectorProps> = ({
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className="w-full">
      <ul className="grid w-full grid-cols-8 p-1.5">
        {COLORS.map((color, index) => (
          <li key={index}>
            <button
              className="rounded-md p-2 hover:bg-gray-100"
              onClick={() => onColorChange(color)}
            >
              <span
                style={{ backgroundColor: color }}
                className="block h-4 w-4 rounded-md"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t p-2">
        <p>Custom color</p>
        <div className="flex items-center gap-2 rounded-md border px-2 py-1">
          <div
            className="h-4 w-4 rounded-md"
            style={{ backgroundColor: selectedColor }}
          />
          <input
            className="w-[70px]"
            placeholder="color"
            value={selectedColor}
            onChange={(event) => {
              onColorChange(event.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
