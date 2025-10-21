/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `task_list` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `task_list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_id_fkey";

-- AlterTable
ALTER TABLE "task_list" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "task_list_userId_key" ON "task_list"("userId");

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
