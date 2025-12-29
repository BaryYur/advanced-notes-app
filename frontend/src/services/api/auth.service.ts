import { apiClient } from "@/lib";

export enum AuthType {
  Email = "email",
  Google = "google",
}

const signIn = async (email: string, password: string, authType: AuthType) => {
  await apiClient.post("/auth/sign-in", {
    email,
    password,
    authType,
  });
};

const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  authType: AuthType,
) => {
  const response = await apiClient.post("/auth/sign-up", {
    firstName,
    lastName,
    email,
    password,
    authType,
  });

  return response.data;
};

const sendResetPasswordCode = async (email: string) => {
  await apiClient.post("/auth/reset-password-code", { email });
};

const resetPassword = async (
  email: string,
  verificationCode: string,
  newPassword: string,
) => {
  await apiClient.post("/auth/reset-password", {
    email,
    verificationCode,
    newPassword,
  });
};

export const AuthApiService = {
  signIn,
  signUp,
  sendResetPasswordCode,
  resetPassword,
};
