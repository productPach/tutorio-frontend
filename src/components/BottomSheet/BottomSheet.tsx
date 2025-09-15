import { motion, AnimatePresence } from "framer-motion";
import styles from "./BottomSheet.module.css";
import { ReactNode, useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className={styles.sheetWrapper}>
            <motion.div
              className={styles.sheet}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 300 }}
              dragElastic={0.3}
              onDragEnd={(event, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  onClose();
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.grabber} />

              {/* Контент с прокруткой */}
              <div
                className={styles.sheetContent}
                onPointerDown={(e) => e.stopPropagation()} // блокируем drag при скролле
              >
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
