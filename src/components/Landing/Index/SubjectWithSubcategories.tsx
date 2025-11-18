"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import styles from "../../../app/page.module.css";

interface SubcategoryItem {
  name: string;
  link: string;
  goal?: string;
  id_p: string;
}

interface SubjectWithSubcategoriesProps {
  mainLink: string;
  mainLabel: string;
  subcategories: SubcategoryItem[];
  goal?: string;
  id_p?: string;
}

export const SubjectWithSubcategories = ({
  mainLink,
  mainLabel,
  subcategories,
  goal,
  id_p,
}: SubjectWithSubcategoriesProps) => {
  const router = useRouter();

  const handleNavigation = useCallback(
    (link: string, itemGoal?: string, itemId_p?: string) => {
      localStorage.removeItem("currentMatch");
      localStorage.removeItem("confirm-time");
      localStorage.removeItem("origin-phone");

      // Используем данные конкретного элемента (если переданы), иначе данные главной категории
      const finalGoal = itemGoal || goal;
      const finalId_p = itemId_p || id_p;

      // Формируем dataToSave в зависимости от наличия goal и id_p
      const dataToSave = [];

      if (finalId_p) {
        dataToSave.push({ id: 0, subject: finalId_p });
      }

      if (finalGoal) {
        dataToSave.push({ id: 1, goal: finalGoal });
      }

      localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      document.body.style.overflow = "auto";
      router.push(link);
    },
    [goal, id_p, router]
  );

  return (
    <div className={styles.tutorsIn__subject}>
      {/* Главный предмет */}
      <h4>
        <a
          href={mainLink}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(mainLink, mainLabel);
          }}
          style={{
            cursor: "pointer",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {mainLabel}
        </a>
      </h4>

      {/* Подкатегории */}
      <ul>
        {subcategories.map((sub, idx) => (
          <li key={idx}>
            <a
              href={sub.link}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(sub.link, sub.goal, sub.id_p);
              }}
            >
              {sub.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
