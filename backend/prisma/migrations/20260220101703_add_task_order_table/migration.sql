/*
  Warnings:

  - You are about to drop the column `completedIndex` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `defaultIndex` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `homeIndex` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `todayIndex` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "completedIndex",
DROP COLUMN "defaultIndex",
DROP COLUMN "homeIndex",
DROP COLUMN "todayIndex";

-- CreateTable
CREATE TABLE "TaskOrder" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TaskOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskOrder_userId_context_idx" ON "TaskOrder"("userId", "context");

-- CreateIndex
CREATE UNIQUE INDEX "TaskOrder_taskId_context_key" ON "TaskOrder"("taskId", "context");

-- AddForeignKey
ALTER TABLE "TaskOrder" ADD CONSTRAINT "TaskOrder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
