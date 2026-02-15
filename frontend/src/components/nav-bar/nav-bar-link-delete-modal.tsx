import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components";

interface NavBarLinkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDeletion: () => void;
}

export const NavBarLinkDeleteModal: React.FC<NavBarLinkDeleteModalProps> = ({
  isOpen,
  onClose,
  onSubmitDeletion,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[360px] overflow-hidden px-0 pb-0 sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 py-3">
          <DialogTitle className="text-lg font-semibold">
            Are you sure?
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            This action can not be undone
          </DialogDescription>
        </div>

        <DialogFooter className="mt-2 bg-gray-200/60 px-5 py-3">
          <Button
            type="button"
            variant="destructive"
            className="w-[84px]"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();

              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-[84px]"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();

              onSubmitDeletion();
              onClose();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
