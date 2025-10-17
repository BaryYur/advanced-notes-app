import React from "react";

import { COLORS } from "@/lib/data";

interface TaskListColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const TaskListColorSelector: React.FC<TaskListColorSelectorProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="w-full">
      <ul className="w-full grid grid-cols-8 p-1.5">
        {COLORS.map((color, index) => (
          <li key={index}>
            <button
              className="hover:bg-gray-100 p-2 rounded-md"
              onClick={() => onColorChange(color)}
            >
              <span
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-md block"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="p-2 border-t flex items-center justify-between">
        <p>Custom color</p>
        <div className="border rounded-md flex items-center px-2 gap-2 py-1">
          <div className="w-4 h-4 rounded-md" style={{ backgroundColor: selectedColor }} />
          <input
            className="w-[70px]"
            placeholder="color"
            value={selectedColor}
            onChange={(event) => {
              console.log('change')
              onColorChange(event.target.value)
            }}
          />
        </div>
      </div>
    </div>
  );
};
