/*
  Warnings:

  - You are about to drop the `TaskOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskOrder" DROP CONSTRAINT "TaskOrder_taskId_fkey";

-- DropTable
DROP TABLE "TaskOrder";

-- CreateTable
CREATE TABLE "task_order" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "task_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_order_userId_context_idx" ON "task_order"("userId", "context");

-- CreateIndex
CREATE UNIQUE INDEX "task_order_taskId_context_key" ON "task_order"("taskId", "context");

-- AddForeignKey
ALTER TABLE "task_order" ADD CONSTRAINT "task_order_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
