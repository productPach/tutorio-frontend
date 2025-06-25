"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./MenuMobile.module.css";
import { Menu, X } from "lucide-react"; // Можно заменить на свою иконку

const links = [
  { label: "Новый заказ", href: "/" },
  { label: "Заказы", href: "/student/orders" },
  { label: "Настройки", href: "/student/settings" },
  { label: "База знаний", href: "/student/wiki" },
];

export default function MenuMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Кнопка меню */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.menuButton}
        aria-label="Открыть меню"
      >
        {isOpen ? (
          <X size={28} strokeWidth={1.25} />
        ) : (
          <Menu size={28} strokeWidth={1.25} />
        )}
      </button>

      {/* Меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              className={styles.menuPanel}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 300 }} // разрешаем тянуть вниз на 300px
              dragElastic={0.3} // немного упругости
              onDragEnd={(event, info) => {
                // info.point.y - позиция относительно экрана
                // info.offset.y - смещение с момента начала drag
                // info.velocity.y - скорость
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setIsOpen(false); // закрываем меню при сильном свайпе вниз
                }
              }}
            >
              {links.map((link) => (
                <a key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
