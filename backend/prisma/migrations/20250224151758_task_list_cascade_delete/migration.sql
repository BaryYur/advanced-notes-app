-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_taskListId_fkey";

-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_userId_fkey";

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
