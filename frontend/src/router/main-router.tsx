import { Routes, Route, Navigate } from "react-router-dom";

import {
  HomePage,
  TaskListPage,
  TodayTasksPage,
  CompletedTasksPage,
} from "@/pages";

import { pageRoutes } from "@/config";

export const MainRouter = () => {
  return (
    <>
      <Routes>
        <Route path={pageRoutes.app.home} element={<HomePage />} />
        <Route path={pageRoutes.app.today} element={<TodayTasksPage />} />
        <Route
          path={pageRoutes.app.completed}
          element={<CompletedTasksPage />}
        />
        <Route path="/:name" element={<TaskListPage />} />
        <Route
          path={pageRoutes.notFound}
          element={<Navigate to="/app/home" />}
        />
      </Routes>
    </>
  );
};
