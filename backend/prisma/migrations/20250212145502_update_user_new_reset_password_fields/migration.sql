/*
  Warnings:

  - Added the required column `passwordResetCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordResetCodeAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetCode" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "passwordResetCodeAt" TIMESTAMP(3) NOT NULL;
