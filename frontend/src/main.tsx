import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";

import {
  ThemeProvider,
  AuthContextProvider,
  TaskListContextProvider,
} from "@/context";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

import "./index.css";

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="theme">
            <AuthContextProvider>
              <TaskListContextProvider>
                <App />
              </TaskListContextProvider>
            </AuthContextProvider>
          </ThemeProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
