import React, { useContext, useMemo } from "react";

import { AuthContext } from "@/context";

import { UserAuthType } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  SettingsTabs,
} from "@/components";
import {
  SettingsUserDetailsTab,
  SettingsPasswordTab,
  SettingsAppearenceTab,
} from "../settings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useContext(AuthContext);

  const tabs = useMemo(
    () => [
      {
        name: "personal",
        title: "Personal",
        component: <SettingsUserDetailsTab onCloseModal={onClose} />,
      },
      ...(user?.authType === UserAuthType.EMAIL
        ? [
            {
              name: "password",
              title: "Password",
              component: <SettingsPasswordTab />,
            },
          ]
        : []),
      {
        name: "appearance",
        title: "Appearance",
        component: <SettingsAppearenceTab />,
      },
    ],
    [user],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        overlayClassName="bg-main/60 z-[60]"
        className="z-[70] h-[80%] max-w-[860px] overflow-hidden border-none bg-main px-0 shadow-sm sm:rounded-xl md:rounded-3xl"
        closeClassName="right-6 top-6"
      >
        <div className="px-5">
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
