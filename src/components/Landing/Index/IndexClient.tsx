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
}

export const IndexClient = ({
  link,
  id_p,
  subject,
  label,
  description,
  size,
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

  // === Первый блок ===
  return (
    <div
      onClick={handleSubject}
      className={clsx(
        styles.firstSection__snippet,
        size === "medium" ? styles.snippetMedium : styles.snippetSmall
      )}
    >
      <div className={size === "medium" ? undefined : styles.fs_SnippetItemEmj}>
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
};
