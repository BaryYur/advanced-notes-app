import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserApiService, UpdateUserData } from "@/services";

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
  const { ...queryProps } = useMutation({
    mutationFn: () => UserApiService.deleteUser(),
  });

  return queryProps;
};
