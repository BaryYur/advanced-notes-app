import { useContext } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { MainRouter } from "@/router/main-router";

import { MainLayout } from "@/components";

import { AuthPage, NotFoundPage } from "@/pages";

import { AuthContext } from "@/context";

import { pageRoutes } from "@/config";

import { Toaster } from "react-hot-toast";

export const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Toaster />

      {!isLoggedIn ? (
        <Routes>
          <Route
            path={`/${pageRoutes.signIn}`}
            element={<AuthPage authPageType="signIn" />}
          />
          <Route
            path={`/${pageRoutes.signUp}`}
            element={<AuthPage authPageType="signUp" />}
          />
          <Route
            path={`/${pageRoutes.resetPassword}`}
            element={<AuthPage authPageType="resetPassword" />}
          />
          <Route
            path="/*"
            element={<Navigate to={`/${pageRoutes.signIn}`} />}
          />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            <Route
              path={`/${pageRoutes.app.index}/*`}
              element={<MainRouter />}
            />
            <Route path={pageRoutes.notFound} element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      )}
    </>
  );
};
