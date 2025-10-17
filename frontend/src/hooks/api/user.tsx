import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { UserApiService } from "@/services";

import { useQuery } from "@tanstack/react-query";

import { jwtDecode } from "jwt-decode";

export const useGetUser = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (token) {
      const decodedTokenData = jwtDecode(token);

      setUserId(decodedTokenData.sub);
    } else {
      navigate("/auth/sign-in");
    }
  }, [token]);

  const { ...queryProps } = useQuery({
    queryFn: () => (userId ? UserApiService.getUser(userId) : null),
    queryKey: ["user"],
    enabled: !!userId,
    staleTime: 5_000_000,
  });

  return queryProps;
};
