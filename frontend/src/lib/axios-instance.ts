import axios from "axios";

import { handleApiError } from "@/errors";

export const apiPath = import.meta.env.VITE_BACKEND_MAIN_PATH;

export const apiClient = axios.create({
  baseURL: apiPath,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  },
);
