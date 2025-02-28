"use client";
import { Subject } from "@/types/types";
import styles from "../../../SignIn/SignInTutor/SignInTutor.module.css";
import componentSubjectStyle from "./Subject.module.css";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { availableDurations } from "@/utils/listSubjects";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setIsModalEditSubjectPrices,
  setSubjectForEditInModal,
} from "@/store/features/modalSlice";
import Link from "next/link";
import clsx from "clsx";

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

export const SelectSubjectItemProfile: React.FC<ComponentProps> = ({
  category,
  subjectsInCategory,
  countSubjectsInCategory,
  listSubjectChecked,
  onSubjectCheckedChange,
  clickedCategory,
  clickedSubject,
  setClickedSubject,
}) => {
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const [toggle, setToggle] = useState(true);
  const [categoryChecked, setCategoryChecked] = useState(false);
  const [subjectChecked, setSubjectChecked] = useState<SubjectCheckedState>({});

  // Устанавливаем выбранные предметы при первой загрузке
  useEffect(() => {
    if (subjectsInCategory.length > 0) {
      setSubjectChecked(
        subjectsInCategory.reduce((acc, subject) => {
          acc[subject.id_p] = listSubjectChecked.includes(subject.id_p);
          return acc;
        }, {} as SubjectCheckedState)
      );
    }
  }, [subjectsInCategory, listSubjectChecked]);

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
    <div className={componentSubjectStyle.answerContainer}>
      <div className={styles.answer} onClick={clickCategorySubject}>
        <div className={styles.checkboxLeftContent}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d={
                !toggle
                  ? "M15.5359 10.4082L12.3539 13.5902C12.1586 13.7855 11.842 13.7855 11.6468 13.5902L8.46481 10.4082C8.26954 10.213 8.26954 9.8964 8.46481 9.70113C8.66007 9.50587 8.97665 9.50587 9.17191 9.70113L11.972 12.5012C11.9814 12.5007 11.9908 12.5004 12.0003 12.5004C12.0027 12.5004 12.0051 12.5004 12.0075 12.5005C12.0146 12.5006 12.0216 12.5008 12.0287 12.5012L14.8288 9.70113C15.024 9.50587 15.3406 9.50587 15.5359 9.70113C15.7311 9.8964 15.7311 10.213 15.5359 10.4082Z"
                  : "M8.46481 13.5918L11.6468 10.4098C11.842 10.2145 12.1586 10.2145 12.3539 10.4098L15.5359 13.5918C15.7311 13.787 15.7311 14.1036 15.5359 14.2989C15.3406 14.4941 15.024 14.4941 14.8288 14.2989L12.0287 11.4988C12.0193 11.4993 12.0099 11.4996 12.0003 11.4996C11.9979 11.4996 11.9955 11.4996 11.9931 11.4995C11.986 11.4994 11.979 11.4992 11.972 11.4988L9.17191 14.2989C8.97665 14.4941 8.66007 14.4941 8.46481 14.2989C8.26954 14.1036 8.26954 13.787 8.46481 13.5918Z"
              }
              fill="#2A2A2A"
            />
          </svg>

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
        <div className={componentSubjectStyle.embeded}>
          {subjectsInCategory.map((subject) => (
            <div
              className={componentSubjectStyle.checkboxContentSpBtwn}
              key={subject.id_p}
            >
              <div
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
              <div
                className={clsx(
                  componentSubjectStyle.selectSubjectLiBorder,
                  componentSubjectStyle.selectSubjectLiBorderHght
                )}
              ></div>
              <div
                className={componentSubjectStyle.containerCheckboxRightContent}
              >
                <div className={componentSubjectStyle.checkboxRightContent}>
                  {/* <div className={componentSubjectStyle.inputPriceWrapper}>
                  <input
                    type="text"
                    className={componentSubjectStyle.inputPriceSubject}
                    placeholder="Цена занятия, ₽"
                  />

                  <select className={componentSubjectStyle.inputPriceSelect}>
                    {availableDurations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration === "day" ? "день" : `${duration} мин.`}
                      </option>
                    ))}
                  </select>
                </div> */}

                  <Image
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setIsModalEditSubjectPrices(true));
                      dispatch(setSubjectForEditInModal(subject.id_p)); // Передаем ID предмета
                    }}
                    className={componentSubjectStyle.img}
                    src={
                      tutor?.subjectPrices?.some(
                        (item) => subject.id_p === item.subjectId
                      )
                        ? "/../img/icon/tutor/pencilSimple.svg"
                        : "/../img/icon/tutor/plus.svg"
                    }
                    alt="Настройки цены занятия в зависимости от места"
                    width={21}
                    height={21}
                  />
                  <Link
                    href="#"
                    className={componentSubjectStyle.linkToPriceSubject}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setIsModalEditSubjectPrices(true));
                      dispatch(setSubjectForEditInModal(subject.id_p)); // Передаем ID предмета
                    }}
                  >
                    {tutor?.subjectPrices?.some(
                      (item) => subject.id_p === item.subjectId
                    )
                      ? "редактировать"
                      : "добавить стоимость"}
                  </Link>
                </div>
                {tutor?.subjectPrices.some(
                  (item) => item.subjectId === subject.id_p
                ) && (
                  <div className={componentSubjectStyle.subjectPrises}>
                    {tutor.subjectPrices
                      .filter(
                        (item) => item.subjectId === subject.id_p && item.price
                      )
                      .sort(
                        (a, b) =>
                          ["online", "group", "travel", "home"].indexOf(
                            a.format
                          ) -
                          ["online", "group", "travel", "home"].indexOf(
                            b.format
                          )
                      )
                      .map(({ format, price }) => (
                        <div key={format}>
                          {format === "online" && "онлайн"}
                          {format === "group" && "группа"}
                          {format === "travel" && "выезд"}
                          {format === "home" && "дома"}: {price} ₽
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
