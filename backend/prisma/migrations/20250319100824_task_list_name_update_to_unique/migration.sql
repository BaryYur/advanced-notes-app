/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `task_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "task_list_name_key" ON "task_list"("name");
