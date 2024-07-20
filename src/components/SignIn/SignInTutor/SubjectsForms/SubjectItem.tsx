"use client";
import { Subject } from "@/types/types";
import styles from "../SignInTutor.module.css";
import React, { useState, useEffect, useRef } from "react";

interface ComponentProps {
  id: number;
  typeForm: string;
  category: Subject;
  subjectsInCategory: Subject[];
  countSubjectsInCategory: number;
  listSubjectChecked: string[];
  onSubjectCheckedChange: (subjectId: string, isChecked: boolean) => void;
  clickedCategory: string;
  clickedSubject: string;
  setClickedSubject: (state: string) => void;
}

type SubjectCheckedState = {
  [key: string]: boolean;
};

export const SubjectItem: React.FC<ComponentProps> = ({
  category,
  subjectsInCategory,
  countSubjectsInCategory,
  listSubjectChecked,
  onSubjectCheckedChange,
  clickedCategory,
  clickedSubject,
  setClickedSubject,
}) => {
  const [toggle, setToggle] = useState(false);
  const [categoryChecked, setCategoryChecked] = useState(false);
  const [subjectChecked, setSubjectChecked] = useState<SubjectCheckedState>({});
  // Создаем рефы для каждого элемента
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Обработчик изменений состояния
  useEffect(() => {
    const handleStateChange = () => {
      const allChecked = subjectsInCategory.every(
        (subject) => subjectChecked[subject.id_p]
      );
      setCategoryChecked(allChecked);
    };

    handleStateChange();
  }, [subjectChecked, subjectsInCategory]);

  // Раскрываем список предметов в категории
  const clickCategorySubject = () => {
    setToggle((state) => !state);
  };

  // Раскрываем категорию, в которой находится предмет из поиска
  useEffect(() => {
    if (category.id_cat === clickedCategory) {
      !toggle && clickCategorySubject();
      handleSubjectCheckboxChange(clickedSubject, true);
    }
  }, [clickedCategory, clickedSubject]);

  // Функция клика на предмет-категорию
  const handleCategoryCheckboxClick = () => {
    setToggle(true);
    const newCheckedState = !categoryChecked;
    setCategoryChecked(newCheckedState);
    const newSubjectChecked = subjectsInCategory.reduce(
      (acc, subject) => {
        acc[subject.id_p] = newCheckedState;
        return acc;
      },
      {} as { [key: string]: boolean }
    );
    setSubjectChecked(newSubjectChecked);

    // Вызов onSubjectCheckedChange после обновления состояния
    subjectsInCategory.forEach((subject) => {
      onSubjectCheckedChange(subject.id_p, newCheckedState);
    });
  };

  useEffect(() => {
    // Устанавливаем состояние чекбоксов для предметов при изменении списка предметов
    const newSubjectChecked = subjectsInCategory.reduce((acc, subject) => {
      acc[subject.id_p] = listSubjectChecked.includes(subject.id_p);
      return acc;
    }, {} as SubjectCheckedState);
    setSubjectChecked(newSubjectChecked);
  }, [subjectsInCategory, listSubjectChecked]);

  // Функция клика на предмет
  const handleSubjectCheckboxChange = (
    subjectId: string,
    isChecked: boolean
  ) => {
    setSubjectChecked((prevState) => ({
      ...prevState,
      [subjectId]: isChecked,
    }));

    // Вызов onSubjectCheckedChange после обновления состояния
    onSubjectCheckedChange(subjectId, isChecked);

    clickedSubject &&
      setTimeout(() => {
        const clickedSubjectNumb = +clickedSubject;
        if (itemRefs.current[clickedSubjectNumb]) {
          itemRefs.current[clickedSubjectNumb]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        setClickedSubject("");
      }, 300);
  };

  return (
    <div className={styles.answerContainer}>
      <div className={styles.answer} onClick={clickCategorySubject}>
        <div className={styles.checkboxLeftContent}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            id={`checkbox-${category.id}`}
            name="checkbox"
            checked={categoryChecked}
            onChange={handleCategoryCheckboxClick}
          />
          <label
            className={styles.checkboxLabel}
            htmlFor={`checkbox-${category.id}`}
          >
            <span className={styles.checkbox}></span>
          </label>
          <p className={styles.answerTitle}>{category.title}</p>
        </div>
        <div className={styles.checkboxRightContent}>
          <span>
            {Object.values(subjectChecked).filter(Boolean).length} из{" "}
            {countSubjectsInCategory}
          </span>
        </div>
      </div>

      {toggle && (
        <div className={styles.embeded}>
          {subjectsInCategory.map((subject) => (
            <div
              key={subject.id_p}
              className={styles.checkboxLeftContent}
              ref={(el) => {
                itemRefs.current[+subject.id_p] = el;
              }}
            >
              <input
                type="checkbox"
                className={styles.checkboxInput}
                id={`subject-${subject.id_p}`}
                name="subject"
                checked={!!subjectChecked[subject.id_p]}
                onChange={(e) =>
                  handleSubjectCheckboxChange(subject.id_p, e.target.checked)
                }
              />
              <label
                className={styles.checkboxLabel}
                htmlFor={`subject-${subject.id_p}`}
              >
                <span className={styles.checkbox}></span>
                <p className={styles.answerTitle}>{subject.title}</p>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
