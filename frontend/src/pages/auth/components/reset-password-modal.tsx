import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { pageRoutes } from "@/config";

import { useSendResetPasswordCode } from "@/hooks";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components";

import toast from "react-hot-toast";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const {
    mutate: sendResetPasswordCodeMutation,
    isPending: isSendingPending,
    isSuccess: isSendingSuccess,
  } = useSendResetPasswordCode();

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (resetPasswordEmail === "") {
      toast.error("Email is required");
      return;
    }

    sendResetPasswordCodeMutation(resetPasswordEmail);
  };

  useEffect(() => {
    if (isSendingSuccess) {
      onClose();
      navigate(pageRoutes.resetPassword, {
        state: { recoveryEmail: resetPasswordEmail },
      });
      setResetPasswordEmail("");
    }
  }, [isSendingSuccess, navigate, onClose, resetPasswordEmail]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[400px] overflow-hidden px-0 pb-0 sm:rounded-xl">
        <form onSubmit={submitHandler}>
          <div className="px-5">
            <DialogTitle className="text-lg font-semibold">
              Send verification code
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              It sends verification code to your email
            </DialogDescription>
            <input
              value={resetPasswordEmail}
              disabled={isSendingPending}
              onChange={(event) => setResetPasswordEmail(event.target.value)}
              className="mt-5 w-full rounded-xl border bg-gray-200/30 p-3 focus:border-blue-400 disabled:opacity-60"
              placeholder="Enter your email"
            />
          </div>

          <DialogFooter className="mt-6 bg-gray-200/60 px-5 py-3">
            <Button
              type="button"
              variant="destructive"
              className="w-[84px]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-[84px]"
              disabled={isSendingPending}
              loading={isSendingPending}
            >
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
