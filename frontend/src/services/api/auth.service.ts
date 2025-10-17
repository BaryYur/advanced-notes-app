import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

export enum AuthType {
  Email = "email",
  Google = "google",
}

const signIn = async (email: string, password: string, authType: AuthType) => {
  try {
    const response = await apiClient.post("/auth/sign-in", {
      email,
      password,
      authType,
    });

    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  authType: AuthType,
) => {
  try {
    const response = await apiClient.post("/auth/sign-up", {
      firstName,
      lastName,
      email,
      password,
      authType,
    });

    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const sendResetPasswordCode = async (email: string) => {
  try {
    await apiClient.post("/auth/reset-password-code", { email });
  } catch (error: any) {
    handleApiError(error);
  }
};

const resetPassword = async (
  email: string,
  verificationCode: string,
  newPassword: string,
) => {
  try {
    await apiClient.post("/auth/reset-password", {
      email,
      verificationCode,
      newPassword,
    });
  } catch (error: any) {
    handleApiError(error);
  }
};

export const AuthApiService = {
  signIn,
  signUp,
  sendResetPasswordCode,
  resetPassword,
};
