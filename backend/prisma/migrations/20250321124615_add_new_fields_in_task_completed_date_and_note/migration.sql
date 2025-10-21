/*
  Warnings:

  - Added the required column `completed` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "completed" BOOLEAN NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT NOT NULL;
