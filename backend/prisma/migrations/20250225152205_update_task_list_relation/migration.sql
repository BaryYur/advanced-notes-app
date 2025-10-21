-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_id_fkey";

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
