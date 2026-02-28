import React, { useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogOverlay,
  SettingsTabs,
} from "@/components";
import { SettingsUserDetails } from "./settings-user-details";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const tabs = useMemo(
    () => [
      {
        name: "personal",
        title: "Personal",
        component: <SettingsUserDetails />,
      },
      {
        name: "password",
        title: "Password",
        component: <>Password</>,
      },
      {
        name: "appearance",
        title: "Appearance",
        component: <>Themes</>,
      },
      {
        name: "shortcuts",
        title: "Shortcuts",
        component: <>Shortcuts</>,
      },
    ],
    [],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-white/60" />
      <DialogContent
        isOverlayVisible={false}
        className="h-[80%] max-w-[800px] overflow-hidden border-none bg-white px-0 shadow-sm sm:rounded-xl md:rounded-3xl"
      >
        <div className="pl-5">
          <DialogTitle className="text-2xl font-medium">Settings</DialogTitle>
          <DialogDescription className="text-sm text-zinc-400" />

          <div className="mt-5">
            <SettingsTabs tabs={tabs} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
