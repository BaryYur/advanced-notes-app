/*
  Warnings:

  - You are about to drop the column `userId` on the `task_list` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_userId_fkey";

-- AlterTable
ALTER TABLE "task_list" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
