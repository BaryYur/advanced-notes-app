import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthApiService, AuthType } from "@/services";

import toast from "react-hot-toast";
import { handleToastError } from "@/errors";

export const useSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      authType: AuthType;
    }) => AuthApiService.signIn(data.email, data.password, data.authType),
    onSuccess: () => {
      toast.success("Successfully logged in");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/app/home");
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
};

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type ExtendedSignUpData = SignUpData & Record<"authType", AuthType>;

export const useSignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: ExtendedSignUpData) =>
      AuthApiService.signUp(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.authType,
      ),
    onSuccess: () => {
      toast.success("Successfully logged in");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/app/home");
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: {
      email: string;
      verificationCode: string;
      newPassword: string;
    }) =>
      AuthApiService.resetPassword(
        data.email,
        data.verificationCode,
        data.newPassword,
      ),
    onSuccess: () => {
      toast.success("Successfully changed");
      navigate("/sign-in");
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
};

export const useSendResetPasswordCode = () => {
  const { ...rest } = useMutation({
    mutationFn: (email: string) => AuthApiService.sendResetPasswordCode(email),
    onError: (error) => {
      handleToastError(error);
    },
  });

  return rest;
};
