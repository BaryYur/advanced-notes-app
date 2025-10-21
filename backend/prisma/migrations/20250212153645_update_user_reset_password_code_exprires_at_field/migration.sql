/*
  Warnings:

  - You are about to drop the column `passwordResetCodeAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "passwordResetCodeAt",
ADD COLUMN     "passwordResetCodeExpiresAt" TIMESTAMP(3);
