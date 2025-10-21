/*
  Warnings:

  - You are about to drop the `TaskList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskList" DROP CONSTRAINT "TaskList_userId_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_taskListId_fkey";

-- DropTable
DROP TABLE "TaskList";

-- CreateTable
CREATE TABLE "task_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '',
    "emoji" TEXT,
    "tasksCounter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_list_name_userId_key" ON "task_list"("name", "userId");

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
