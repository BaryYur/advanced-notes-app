-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
