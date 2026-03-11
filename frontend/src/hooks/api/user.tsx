import { useContext } from "react";

import { AuthContext } from "@/context";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  UserApiService,
  UpdateUserData,
  UpdateUserPasswordData,
} from "@/services";

import { handleToastError } from "@/errors";

import { toast } from "react-hot-toast";

export const useGetUser = () => {
  const { ...queryProps } = useQuery({
    queryFn: () => UserApiService.getUser(),
    queryKey: ["user"],
    staleTime: 5_000_000,
  });

  return queryProps;
};

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();

  const { ...queryProps } = useMutation({
    mutationFn: (userData: UpdateUserData) =>
      UserApiService.updateUserInfo(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return queryProps;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { logout } = useContext(AuthContext);

  const { ...queryProps } = useMutation({
    mutationFn: () => UserApiService.deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      logout();
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return queryProps;
};

export const useUpdateUserPassword = () => {
  const { ...queryProps } = useMutation({
    mutationFn: (passwordData: UpdateUserPasswordData) =>
      UserApiService.updateUserPassword(passwordData),
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return queryProps;
};
