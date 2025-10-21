-- DropIndex
DROP INDEX "task_list_name_key";

-- CreateIndex
CREATE INDEX "task_list_userId_name_idx" ON "task_list"("userId", "name");
