import { useState } from "react";

import { useUpdateUserPassword } from "@/hooks";

import { Button, Input } from "@/components";

import { toast } from "react-hot-toast";

export const SettingsPasswordTab = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const {
    mutate: updateUserPasswordMutation,
    isPending: isUpdatingUserPasswordPending,
  } = useUpdateUserPassword();

  const handleSubmitUpdatePassword = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    updateUserPasswordMutation(passwords);
  };

  return (
    <div>
      <p className="text-lg font-medium">Update your password</p>
      <form
        onSubmit={handleSubmitUpdatePassword}
        className="mt-4 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="oldPassword" className="text-sm font-medium">
            Old password
          </label>
          <Input
            id="oldPassword"
            type="password"
            isHideIconVisible
            disabled={isUpdatingUserPasswordPending}
            value={passwords.oldPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, oldPassword: event.target.value })
            }
            placeholder="Enter old password"
            className="rounded-lg bg-gray-100 p-3 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            New password
          </label>
          <Input
            id="newPassword"
            type="password"
            isHideIconVisible
            disabled={isUpdatingUserPasswordPending}
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, newPassword: event.target.value })
            }
            placeholder="Enter new password"
            className="rounded-lg bg-gray-100 p-3 text-sm"
          />
        </div>

        <div className="flex justify-end">
          <Button
            className="h-[38px] w-[90px]"
            loading={isUpdatingUserPasswordPending}
            disabled={isUpdatingUserPasswordPending}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
