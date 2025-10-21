/*
  Warnings:

  - Added the required column `userId` to the `task_list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_id_fkey";

-- AlterTable
ALTER TABLE "task_list" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
