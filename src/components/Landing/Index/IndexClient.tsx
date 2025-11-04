"use client";

import clsx from "clsx";
import styles from "../../../app/page.module.css";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface Props {
  link: string;
  id_p?: string;
  subject?: string;
  label: string;
  description?: string;
  size?: "small" | "medium";
  variant?: "first" | "second";
  /** Для второго блока: массив подкатегорий */
  subcategories?: string[];
}

export const IndexClient = ({
  link,
  id_p,
  subject,
  label,
  description,
  size,
  variant = "first",
  subcategories,
}: Props) => {
  const router = useRouter();

  const handleSubject = useCallback(() => {
    localStorage.removeItem("currentMatch");
    localStorage.removeItem("confirm-time");
    localStorage.removeItem("origin-phone");

    const dataToSave = id_p
      ? [{ id: 0, subject: id_p }]
      : [{ id: 1, goal: subject }];

    localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
    document.body.style.overflow = "auto";
    router.push(link);
  }, [id_p, subject, link, router]);

  if (variant === "first") {
    // === Первый блок ===
    return (
      <div
        onClick={handleSubject}
        className={clsx(
          styles.firstSection__snippet,
          size === "medium" ? styles.snippetMedium : styles.snippetSmall
        )}
      >
        <div
          className={size === "medium" ? undefined : styles.fs_SnippetItemEmj}
        >
          {label}
        </div>
        {description && (
          <p
            className={
              size === "medium"
                ? styles.firstSection__snippetL
                : styles.firstSection__snippetM
            }
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  // === Второй блок (сеточная секция) ===
  return (
    <div className={styles.tutorsIn__subject}>
      <h4>{label}</h4>
      <ul>
        {(subcategories || ["Общий курс"]).map((sub, idx) => (
          <li key={idx}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSubject();
              }}
            >
              {sub}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
