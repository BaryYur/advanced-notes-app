import React from "react";

import { motion, AnimatePresence } from "framer-motion";

interface TaskModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  id,
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            layoutId={id}
            className="fixed z-50 flex h-[300px] left-0 top- w-[700px] items-center justify-center rounded-2xl bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 250, damping: 20 },
            }}
          >
            modal {id}
          </motion.div>

          <motion.div
            className="fixed left-0 top-0 z-40 h-full w-full bg-black/10 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}
    </AnimatePresence>
  );
};
