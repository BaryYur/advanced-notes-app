import { apiClient } from "@/lib";

import { User } from "@/types";

const getUser = async () => {
  const response = await apiClient.get<User>("/user/info");

  return response.data;
};

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
}

const updateUserInfo = async (userData: UpdateUserData) => {
  const response = await apiClient.patch<User>("/user/info", userData);

  return response.data;
};

const deleteUser = async () => {
  await apiClient.delete("/user");
};

export interface UpdateUserPasswordData {
  oldPassword: string;
  newPassword: string;
}

const updateUserPassword = async (data: UpdateUserPasswordData) => {
  await apiClient.patch("/user/password", data);
};

export const UserApiService = {
  getUser,
  updateUserInfo,
  deleteUser,
  updateUserPassword,
};
