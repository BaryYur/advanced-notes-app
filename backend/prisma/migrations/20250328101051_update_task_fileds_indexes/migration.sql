/*
  Warnings:

  - You are about to drop the `task_list` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskListName` to the `task` table without a default value. This is not possible if the table is not empty.
  - Made the column `taskListId` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_taskListId_fkey";

-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_userId_fkey";

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "completedIndex" DOUBLE PRECISION,
ADD COLUMN     "defaultIndex" DOUBLE PRECISION,
ADD COLUMN     "homeIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "taskListName" TEXT NOT NULL,
ADD COLUMN     "todayIndex" DOUBLE PRECISION,
ALTER COLUMN "taskListId" SET NOT NULL;

-- DropTable
DROP TABLE "task_list";

-- CreateTable
CREATE TABLE "TaskList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '',
    "emoji" TEXT,
    "tasksCounter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskList_name_userId_key" ON "TaskList"("name", "userId");

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "TaskList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
