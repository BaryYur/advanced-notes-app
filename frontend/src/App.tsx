import { useContext } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { MainRouter } from "@/router/main-router";

import { MainLayout } from "@/components";

import { AuthPage } from "@/pages";

import { AuthContext } from "@/context";

import { Toaster } from "react-hot-toast";

export const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Toaster />

      {!isLoggedIn ? (
        <Routes>
          <Route path="/sign-in" element={<AuthPage authPageType="signIn" />} />
          <Route path="/sign-up" element={<AuthPage authPageType="signUp" />} />
          <Route
            path="/reset-password"
            element={<AuthPage authPageType="resetPassword" />}
          />
          <Route path="/*" element={<Navigate to="/sign-in" />} />
        </Routes>
      ) : (
        <>
          <MainLayout>
            <Routes>
              <Route path="/app/*" element={<MainRouter />} />
              <Route path="/*" element={<Navigate to="/app/home" />} />
            </Routes>
          </MainLayout>
        </>
      )}
    </>
  );
};
