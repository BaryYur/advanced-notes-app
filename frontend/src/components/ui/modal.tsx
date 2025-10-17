import React, { useRef, useEffect, useState } from "react";

import * as motion from "motion/react-client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "visible";
    }

    return () => {
      window.document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handleAnimationComplete = () => {
    if (!isOpen) {
      setIsVisible(false);
    }
  };

  return (
    <>
      {isVisible && (
        <div className="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
            onAnimationComplete={handleAnimationComplete}
          >
            <div
              ref={modalRef}
              className="no-scrollbar relative rounded-[20px] bg-white p-[12px] sm:p-[20px]"
            >
              {title && (
                <p className="text-center text-[24px] font-semibold">{title}</p>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
