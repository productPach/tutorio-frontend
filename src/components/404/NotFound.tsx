"use client";

import clsx from "clsx";
import styles from "../VerifyEmail/VerifyEmail.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const NotFound: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    // Принудительно устанавливаем title при монтировании
    document.title = "Упс, такой страницы не существует — Tutorio";
  }, []);
  return (
    <>
      {/* <Header /> */}
      <div className={clsx(styles.container, styles.center)}>
        <div className={styles.content_block}>
          <p className={styles.title}>Упс! 404 —&nbsp;страницы нет&nbsp;😕</p>
          <p className={styles.description}>
            Зато есть много других интересных мест на&nbsp;Tutorio. Вернёмся
            назад?
          </p>
          <button
            onClick={() => router.back()}
            className={clsx(styles.content_block_button, styles.buttonYlw)}
          >
            Вернуться&nbsp;назад
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
