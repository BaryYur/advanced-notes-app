import { apiClient } from "@/vars";

import { User } from "@/types";

import { handleApiError } from "@/errors";

const getUser = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);

    return response.data as User;
  } catch (error) {
    handleApiError(error);
  }
};

export const UserApiService = {
  getUser,
};
