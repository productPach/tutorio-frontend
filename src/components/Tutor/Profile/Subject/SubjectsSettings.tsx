"use client";
import stylesGen from "../../../../app/tutor/layout.module.css";
import styles from "../../../SignIn/SignInTutor/SignInTutor.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";

import React, { useCallback, useEffect, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { Search } from "@/components/SelectSubject/Search";
import { SubjectItemProfile } from "./SubjectItemProfile";
import { SelectSubjectItemProfile } from "./SelectSubjectItemProfile";
import componentSubjectStyle from "./Subject.module.css";
import { Subject } from "@/types/types";
import { Spinner } from "@/components/Spinner/Spinner";
import clsx from "clsx";
import { getAllSubjects } from "@/store/features/subjectSlice";

export const SubjectsSettings = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const cookiesAccepted = useAppSelector((state) => state.general.cookies);
  const [listSubjectChecked, setListSubjectChecked] = useState<string[]>([]);
  const [clickedCategory, setClickedCategory] = useState("");
  const [clickedSubject, setClickedSubject] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Стейт для предметов
  const subjects = useAppSelector((state) => state.subject.subjects);

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  // Получаем значение loading из Redux
  const isLoading = useAppSelector((state) => state.tutor.loading);
  const updateStatus = useAppSelector((state) => state.tutor.updateStatus);

  const [successUpdateTutor, setSuccessUpdateTutor] = useState(true);

  useEffect(() => {
    updateStatus === "success" && setSuccessUpdateTutor(true);
  }, [updateStatus]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (tutor?.subject) {
      setListSubjectChecked(tutor.subject);
    }
  }, [tutor]);

  const handleScrollToSubject = useCallback(
    (subjectId: string, category: string) => {
      setClickedCategory(category);
      setClickedSubject(subjectId);
    },
    []
  );

  const handleSubjectCheckedChange = useCallback(
    (subjectId: string, isChecked: boolean) => {
      if (!subjectId) return;
      setListSubjectChecked((prev) =>
        isChecked
          ? prev.includes(subjectId)
            ? prev
            : [...prev, subjectId]
          : prev.filter((id) => id !== subjectId)
      );
      setSuccessUpdateTutor(false);
    },
    []
  );

  // Обновление данных репетитора
  const updateDataTutor = () => {
    const id = tutor?.id;
    if (token && id) {
      const subject = listSubjectChecked;
      dispatch(updateTutor({ id, subject })).unwrap;
      setIsDisabled(true);
      setIsVisible(false);
    } else {
      console.log("Нет токена");
    }
  };

  const listSubjects = subjects;

  const getGeneralCategories = (
    tutorSubjects: string[],
    allSubjects: Subject[]
  ) => {
    const categoryMap = new Map<
      string,
      { subjects: Subject[]; remainingSubjects: Subject[]; totalCount: number }
    >();

    allSubjects.forEach((subject) => {
      if (!categoryMap.has(subject.id_cat)) {
        categoryMap.set(subject.id_cat, {
          subjects: [],
          remainingSubjects: [],
          totalCount: 0,
        });
      }
      categoryMap.get(subject.id_cat)!.totalCount++;

      if (tutorSubjects.includes(subject.id_p)) {
        categoryMap.get(subject.id_cat)!.subjects.push(subject);
      } else {
        categoryMap.get(subject.id_cat)!.remainingSubjects.push(subject);
      }
    });

    return Array.from(categoryMap.entries()).map(
      ([id_cat, { subjects, remainingSubjects, totalCount }]) => ({
        id_cat,
        category: allSubjects.find((s) => s.id_cat === id_cat)!, // Категория
        subjectsInCategory: subjects,
        remainingSubjectsInCategory: remainingSubjects,
        countSubjectsInCategory: totalCount - subjects.length, // Количество оставшихся предметов
        totalCount, // Общее количество предметов
      })
    );
  };

  // Функция для валидации условий активации кнопки
  const isFormValid = () => {
    if (!tutor?.subject) return false; // Если нет данных, кнопка неактивна

    const hasSubjectChanged =
      JSON.stringify([...tutor.subject].sort()) !==
      JSON.stringify([...listSubjectChecked].sort());

    return hasSubjectChanged;
  };

  return (
    <>
      <div className={stylesGen.content_block}>
        <h3>Выберите предметы и укажите стоимость занятий</h3>
      </div>

      <div className={stylesGen.content_block}>
        <div className={styles.sticky}>
          <Search
            handleScrollToSubject={handleScrollToSubject}
            subjects={subjects}
          />
        </div>

        <div className={componentSubjectStyle.titleSubject}>
          Выбранные предметы
        </div>

        <div className={styles.containerAnswers}>
          {getGeneralCategories(tutor?.subject || [], listSubjects)
            .filter(({ subjectsInCategory }) => subjectsInCategory.length > 0) // Фильтруем категории с выбранными предметами
            .map(({ id_cat, category, subjectsInCategory }) => (
              <React.Fragment key={id_cat}>
                <SelectSubjectItemProfile
                  id={0}
                  typeForm={"typeForm"}
                  category={category}
                  subjectsInCategory={subjectsInCategory}
                  countSubjectsInCategory={
                    subjectsInCategory.filter((s) =>
                      tutor?.subject.includes(s.id_p)
                    ).length
                  } // Количество отмеченных предметов в категории
                  listSubjectChecked={listSubjectChecked} // Используем локальное состояние
                  onSubjectCheckedChange={handleSubjectCheckedChange}
                  clickedCategory={clickedCategory}
                  clickedSubject={clickedSubject}
                  setClickedSubject={setClickedSubject}
                />
              </React.Fragment>
            ))}
        </div>

        <div className={componentSubjectStyle.titleSubject2}>
          Остальные предметы
        </div>

        <div className={styles.containerAnswers}>
          {getGeneralCategories(tutor?.subject || [], listSubjects).map(
            ({
              id_cat,
              category,
              remainingSubjectsInCategory,
              countSubjectsInCategory,
            }) =>
              countSubjectsInCategory > 0 && (
                <React.Fragment key={id_cat}>
                  <SubjectItemProfile
                    id={0}
                    typeForm={"typeForm"}
                    category={category}
                    subjectsInCategory={remainingSubjectsInCategory} // Оставшиеся предметы
                    countSubjectsInCategory={countSubjectsInCategory} // Их количество
                    listSubjectChecked={listSubjectChecked}
                    onSubjectCheckedChange={handleSubjectCheckedChange}
                    clickedCategory={clickedCategory}
                    clickedSubject={clickedSubject}
                    setClickedSubject={setClickedSubject}
                  />
                </React.Fragment>
              )
          )}
        </div>
      </div>
      <div
        className={clsx(componentSubjectStyle.containerButton, {
          [componentSubjectStyle.containerButton_with_cookies]:
            !cookiesAccepted,
        })}
      >
        <button
          type="button"
          className={componentSubjectStyle.saveButton}
          disabled={!isFormValid() || isLoading || successUpdateTutor}
          onClick={() => updateDataTutor()}
        >
          {successUpdateTutor && updateStatus === "success"
            ? "Сохранено"
            : "Сохранить"}
          {isLoading && (
            <div className={componentSubjectStyle.buttonYlSpinner}>
              <Spinner />
            </div>
          )}
        </button>
        {/* <div>
            {successUpdateTutor &&
              updateStatus === "success" &&
              "Данные успешно обновлены"}
          </div> */}
      </div>
    </>
  );
};
