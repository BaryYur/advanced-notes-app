-- AlterTable
ALTER TABLE "user" ALTER COLUMN "passwordResetCode" DROP NOT NULL,
ALTER COLUMN "passwordResetCodeAt" DROP NOT NULL;
