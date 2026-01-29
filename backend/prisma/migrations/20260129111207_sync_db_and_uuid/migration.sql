-- AlterTable
ALTER TABLE "task" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "task_list" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
