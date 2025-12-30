import { apiClient } from "@/lib";

import { User } from "@/types";

const getUser = async () => {
  const response = await apiClient.get<User>("/user/info");

  return response.data;
};

export const UserApiService = {
  getUser,
};
