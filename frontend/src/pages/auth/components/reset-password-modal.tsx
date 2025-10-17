import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSendResetPasswordCode } from "@/hooks";

import { Modal, Button } from "@/components";

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
      navigate("/reset-password", {
        state: { recoveryEmail: resetPasswordEmail },
      });
      setResetPasswordEmail("");
    }
  }, [isSendingSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 pb-5 pt-2">
        <form onSubmit={submitHandler}>
          <p className="text-lg font-semibold">Send verification code</p>
          <div className="mt-2 flex">
            <input
              value={resetPasswordEmail}
              disabled={isSendingPending}
              onChange={(event) => setResetPasswordEmail(event.target.value)}
              className="w-[280px] rounded-l-xl border-[1px] bg-gray-100 p-3 focus:border-blue-400 disabled:opacity-60"
              placeholder="Your email"
            />
            <Button
              type="submit"
              disabled={isSendingPending}
              className="rounded-l-none rounded-r-xl border-[1px] border-black bg-primary px-5 py-3 text-white disabled:bg-zinc-600"
              loading={isSendingPending}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
