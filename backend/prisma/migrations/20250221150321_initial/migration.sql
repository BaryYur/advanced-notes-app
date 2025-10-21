/*
  Warnings:

  - Added the required column `taskListId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "taskListId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
