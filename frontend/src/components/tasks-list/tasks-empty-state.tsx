import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export const TasksEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center"
    >
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <ClipboardList className="h-7 w-7" strokeWidth={1.5} />
      </div>

      <h3 className="text-zinc-600">No tasks yet</h3>
    </motion.div>
  );
};
