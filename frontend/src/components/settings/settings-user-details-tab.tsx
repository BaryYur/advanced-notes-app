import React, { useContext, useState, useEffect } from "react";

import { AuthContext } from "@/context";

import { useDeleteUser, useUpdateUserInfo } from "@/hooks";

import { Input, Button } from "@/components";

import { LoaderCircle } from "lucide-react";

import { toast } from "react-hot-toast";

interface SettingsUserDetailsTabProps {
  onCloseModal: () => void;
}

export const SettingsUserDetailsTab: React.FC<SettingsUserDetailsTabProps> = ({
  onCloseModal,
}) => {
  const { user } = useContext(AuthContext);

  const [userName, setUserName] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
  });

  const {
    mutate: updateUserInfoMutation,
    isPending: isUpdatingUserInfoPending,
    isSuccess: isUpdatingUserInfoSuccess,
  } = useUpdateUserInfo();
  const {
    mutate: deleteUserMutation,
    isPending: isDeleteUserPending,
    isSuccess: isDeleteUserSuccess,
  } = useDeleteUser();

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName({ ...userName, [event.target.name]: event.target.value });
  };

  const handleSubmitUpdateUserInfo = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!userName.firstName) {
      toast.error("Please fill in your name");
      return;
    }

    updateUserInfoMutation({
      firstName: userName.firstName,
      lastName: userName.lastName,
    });
  };

  useEffect(() => {
    if (isUpdatingUserInfoSuccess) {
      toast.success("User info updated successfully");
    }
  }, [isUpdatingUserInfoSuccess]);

  useEffect(() => {
    if (isDeleteUserSuccess) {
      onCloseModal();
    }
  }, [isDeleteUserSuccess]);

  return (
    <div className="overflow-y-visible">
      <p className="text-lg font-medium">Personal details</p>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          type="text"
          id="email"
          value={user?.email}
          disabled
          className="rounded-lg bg-gray-100 p-3 text-sm text-gray-400"
        />
      </div>

      <form onSubmit={handleSubmitUpdateUserInfo}>
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            type="text"
            id="name"
            name="firstName"
            placeholder="Your name"
            disabled={isUpdatingUserInfoPending}
            value={userName.firstName}
            onChange={handleChangeUserName}
            className="rounded-lg bg-gray-100 p-3 text-sm"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Surname
          </label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Your surname"
            disabled={isUpdatingUserInfoPending}
            value={userName.lastName}
            onChange={handleChangeUserName}
            className="rounded-lg bg-gray-100 p-3 text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={isUpdatingUserInfoPending || isDeleteUserPending}
          className="mt-4 h-[40px] w-[140px]"
        >
          {isUpdatingUserInfoPending ? (
            <div className="flex items-center justify-center gap-1">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-lg font-medium">Close account</p>
        <p className="text-sm text-zinc-400">
          Closing your account will permanently delete all your data.
        </p>
        <Button
          variant="destructive"
          disabled={isDeleteUserPending}
          onClick={() => deleteUserMutation()}
          className="mt-3 h-[40px]"
        >
          {isDeleteUserPending ? (
            <div className="flex items-center justify-center gap-1">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Deleting...</span>
            </div>
          ) : (
            "Delete account"
          )}
        </Button>
      </div>
    </div>
  );
};
