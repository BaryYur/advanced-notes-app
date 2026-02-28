import { useContext, useState } from "react";

import { AuthContext } from "@/context";

// import { useUpdateUserInfo } from "@/hooks";git add .

import { Input, Button } from "@/components";

export const SettingsUserDetails = () => {
  const { user } = useContext(AuthContext);

  // const { mutate: updateUserInfoMutation } = useUpdateUserInfo();

  const [userName, setUserName] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
  });

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName({ ...userName, [event.target.name]: event.target.value });
  };

  return (
    <div className="overflow-y-visible pr-5">
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

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          type="text"
          id="name"
          name="firstName"
          value={userName.firstName}
          onChange={handleChangeUserName}
          className="rounded-lg bg-gray-100 p-3 text-sm"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="lastName" className="text-sm font-medium">
          Last name
        </label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          value={userName.lastName}
          onChange={handleChangeUserName}
          className="rounded-lg bg-gray-100 p-3 text-sm"
        />
      </div>

      <div className="mt-6">
        <p className="text-lg font-medium">Close account</p>
        <p className="text-sm text-zinc-400">
          Closing your account will permanently delete all your data.
        </p>
        <Button variant="destructive" className="mt-3">
          Delete account
        </Button>
      </div>
    </div>
  );
};
