"use client";
import { data } from "@/utils/listSubjects";
import stylesGen from "../../../../app/tutor/layout.module.css";
import styles from "../../../SignIn/SignInTutor/SignInTutor.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";

import React, { useCallback, useEffect, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { Search } from "@/components/SelectSubject/Search";
import { SubjectItemProfile } from "./SubjectItemProfile";

export const SubjectsSettings = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const [listSubjectChecked, setListSubjectChecked] = useState<string[]>([]);
  // Состояние для выбранной категории
  const [clickedCategory, setClickedCategory] = useState("");
  // Состояние для выбранного предмета
  const [clickedSubject, setClickedSubject] = useState("");

  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Обновление данных репетитора
  const updateDataTutor = () => {
    const id = tutor?.id;
    if (token && id) {
      const subject = listSubjectChecked;
      dispatch(updateTutor({ id, token, status, subject })).unwrap;
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);
    } else {
      console.log("Нет токена");
    }
  };

  const handleSubjectCheckedChange = useCallback(
    (subjectId: string, isChecked: boolean) => {
      if (!subjectId) return; // Добавляем проверку, чтобы игнорировать пустые значения
      setListSubjectChecked((prev) => {
        if (isChecked) {
          return prev.includes(subjectId) ? prev : [...prev, subjectId];
        } else {
          return prev.filter((id) => id !== subjectId);
        }
      });
    },
    []
  );

  // Импортируем предметы
  const listSubjects = data;
  // Предметы-категории
  const listCategorySubjects = listSubjects.filter(
    (subject) => subject.general
  );

  const handleScrollToSubject = useCallback(
    (subjectId: string, category: string) => {
      setClickedCategory(category);
      setClickedSubject(subjectId);
    },
    []
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  return (
    <>
      <div className={stylesGen.content_block}>
        <h3>Выберите предметы и укажите стоимость занятий</h3>
      </div>

      <div className={stylesGen.content_block}>
        <div className={styles.sticky}>
          <Search handleScrollToSubject={handleScrollToSubject} />
        </div>

        <div>Выбранные</div>

        <div className={styles.containerAnswers}>
          {listCategorySubjects.map((category) => {
            const subjectsInCategory = listSubjects.filter(
              (subject) => subject.id_cat === category.id_cat
            );
            const countSubjectsInCategory = subjectsInCategory.length;
            return (
              <React.Fragment key={category.id_p}>
                <SubjectItemProfile
                  id={0}
                  typeForm={"typeForm"}
                  category={category}
                  subjectsInCategory={subjectsInCategory}
                  countSubjectsInCategory={countSubjectsInCategory}
                  listSubjectChecked={listSubjectChecked}
                  onSubjectCheckedChange={handleSubjectCheckedChange}
                  clickedCategory={clickedCategory}
                  clickedSubject={clickedSubject}
                  setClickedSubject={setClickedSubject}
                />
              </React.Fragment>
            );
          })}
        </div>

        <div>Остальные</div>

        <div className={styles.containerAnswers}>
          {listCategorySubjects.map((category) => {
            const subjectsInCategory = listSubjects.filter(
              (subject) => subject.id_cat === category.id_cat
            );
            const countSubjectsInCategory = subjectsInCategory.length;
            return (
              <React.Fragment key={category.id_p}>
                <SubjectItemProfile
                  id={0}
                  typeForm={"typeForm"}
                  category={category}
                  subjectsInCategory={subjectsInCategory}
                  countSubjectsInCategory={countSubjectsInCategory}
                  listSubjectChecked={listSubjectChecked}
                  onSubjectCheckedChange={handleSubjectCheckedChange}
                  clickedCategory={clickedCategory}
                  clickedSubject={clickedSubject}
                  setClickedSubject={setClickedSubject}
                />
              </React.Fragment>
            );
          })}
        </div>

        <div className={styles.button}>
          <button onClick={updateDataTutor} type="button" disabled={errorInput}>
            Сохранить
          </button>
        </div>
      </div>
    </>
  );
};
