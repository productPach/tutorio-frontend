import React, { useState, useEffect } from "react";
import styles from "./Pagination.module.css";
import clsx from "clsx";

interface PaginationProps {
  totalPages: number;
  currentPage?: number; // для управляемой версии (опционально)
  initialPage?: number; // для автономной версии
  onPageChange?: (page: number) => void; // уведомление родителя
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage: controlledPage,
  initialPage = 1,
  onPageChange,
}) => {
  const [internalPage, setInternalPage] = useState(initialPage);

  // определяем текущую страницу: если родитель передал, используем её
  const currentPage = controlledPage ?? internalPage;

  useEffect(() => {
    if (controlledPage === undefined) {
      setInternalPage(initialPage);
    }
  }, [initialPage, controlledPage]);

  if (totalPages <= 1) return null;

  const createPageRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const pages = createPageRange();

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    // для автономного режима
    if (controlledPage === undefined) {
      setInternalPage(page);
    }

    onPageChange?.(page);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      {/* Десктопная пагинация */}
      <div className={`${styles.pagination} ${styles.desktopOnly}`}>
        <button
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
          className={clsx(styles.navButton, styles.ylw)}
        >
          Первая
        </button>
        {/* <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(styles.navButton, styles.ylw)}
        >
          ‹ Предыдущая
        </button> */}

        {pages.map((p, index) =>
          p === "..." ? (
            <span key={index} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => changePage(p as number)}
              className={`${clsx(styles.pageButton, styles.ylw)} ${
                currentPage === p ? styles.active : ""
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(styles.navButton, styles.ylw)}
        >
          Следующая ›
        </button> */}
        <button
          onClick={() => changePage(totalPages)}
          disabled={currentPage === totalPages}
          className={clsx(styles.navButton, styles.ylw)}
        >
          Последняя
        </button>
      </div>

      {/* Мобильная пагинация */}
      <div className={`${styles.pagination} ${styles.mobileOnly}`}>
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(styles.navButton, styles.blc)}
        >
          ‹ Предыдущая
        </button>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(styles.navButton, styles.ylw)}
        >
          Следующая ›
        </button>
      </div>
    </>
  );
};
