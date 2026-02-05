import React, { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useOutsideClick } from "@/hooks";

import { ListIcon } from "@/components";

import { ListType } from "@/types";

import { pageRoutes } from "@/config";

import { NavBarLinkActionDropdown } from "./nav-bar-link-action-dropdown";
import { NavBarTaskListField } from "./nav-bar-task-list-field";

import { Home, Calendar, SquareCheckBig } from "lucide-react";

interface NavBarLinkProps {
  taskListId: string;
  title: string;
  linkType: ListType;
  color: string;
  emoji?: string;
  tasksCounter: number;
}

const mainIcons = {
  [ListType.Home]: <Home size={13} strokeWidth={2.2} />,
  [ListType.Today]: <Calendar size={13} strokeWidth={2.2} />,
  [ListType.Completed]: <SquareCheckBig size={13} strokeWidth={2.2} />,
};

export const NavBarLink: React.FC<NavBarLinkProps> = ({
  taskListId,
  title,
  linkType,
  color,
  emoji,
  tasksCounter,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isNavLinkPickerOpen, setIsNavLinkPickerOpen] = useState(false);

  const handleClickOutside = () => {
    if (isNavLinkPickerOpen) {
      setIsNavLinkPickerOpen(false);
    } else {
      setIsActive(false);
    }
  };

  const { isActive, setIsActive, elementRef } = useOutsideClick<HTMLLIElement>({
    onOutsideClick: handleClickOutside,
    dependencies: [isNavLinkPickerOpen],
  });

  const isLinkActive =
    decodeURIComponent(location.pathname.split("/")[2]) === title;

  return (
    <li ref={elementRef}>
      <div
        onClick={() => {
          navigate(`/${pageRoutes.app.index}/${title}`);
        }}
        className={`${isLinkActive && "bg-gray-100/50"} group relative z-10 flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5`}
      >
        {isLinkActive && (
          <div
            className="nav-color-box absolute left-0 z-50 h-full w-20 opacity-[0.08]"
            style={{
              backgroundColor: color,
              filter: "blur(10px)",
            }}
          />
        )}

        {isActive ? (
          <div
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <NavBarTaskListField
              action="update"
              isInLinkPickerOpen={isNavLinkPickerOpen}
              onOpenPickerInNavLink={() => setIsNavLinkPickerOpen(true)}
              onUpdateAction={() => setIsActive(false)}
              taskListData={{
                id: taskListId,
                name: title,
                color: color,
                emoji: emoji,
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {linkType === ListType.Default ? (
              <ListIcon color={color} emoji={emoji} />
            ) : (
              mainIcons[linkType]
            )}

            <span
              className={`${linkType !== ListType.Default && "capitalize"} w-40 truncate text-sm`}
            >
              {title}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <NavBarLinkActionDropdown
            taskList={{
              id: taskListId,
              name: title,
            }}
            navBarLinkType={linkType}
            onStartEdit={() => setIsActive(true)}
          />

          <div className="rounded-md bg-gray-200/70 px-2 py-1 text-xs font-semibold text-gray-500">
            {tasksCounter}
          </div>
        </div>
      </div>
    </li>
  );
};
