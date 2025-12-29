import { apiClient } from "@/lib";

import { User } from "@/types";

import { handleApiError } from "@/errors";

const getUser = async () => {
  try {
    const response = await apiClient.get("/user/info");

    return response.data as User;
  } catch (error) {
    handleApiError(error);
  }
};

export const UserApiService = {
  getUser,
};
