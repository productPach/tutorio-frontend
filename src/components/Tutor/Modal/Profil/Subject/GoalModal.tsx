"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../ProfileInfo/ProfileInfo.module.css";
import componentStyles from "./SubjectModal.module.css";
import componentLocationStyle from "../../../Profile/Location/Location.module.css";
import React, { useEffect, useState } from "react";
import {
  getTutorGoals,
  getTutorIncompletePrices,
  getTutorSubjectsWithGoals,
  updateTutorGoals,
} from "@/store/features/tutorSlice";
import { Spinner } from "@/components/Spinner/Spinner";
import { getAccessToken } from "@/api/server/auth";
import clsx from "clsx";

export const GoalModal = () => {
  const dispatch = useAppDispatch();
  const token = getAccessToken();
  const tutor = useAppSelector((state) => state.tutor.tutor);

  const tutorGoals = useAppSelector((state) => state.tutor.tutorGoals);
  const tutorGoalsLoading = useAppSelector(
    (state) => state.tutor.tutorGoalsLoading
  );
  const tutorGoalsSaved = useAppSelector(
    (state) => state.tutor.tutorGoalsSaved
  );

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [initialSelectedGoals, setInitialSelectedGoals] = useState<string[]>(
    []
  );
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showSaving, setShowSaving] = useState(false);

  const editSubjectId = useAppSelector(
    (state) => state.modal.subjectForEditInModal
  );

  // 1️⃣ Загрузка целей при открытии модалки или смене предмета
  useEffect(() => {
    if (!editSubjectId || !tutor?.id) return;

    // сброс состояния
    setSelectedGoals([]);
    setInitialSelectedGoals([]);
    setShowSavedMessage(false);

    dispatch(getTutorGoals({ subjectId: editSubjectId, tutorId: tutor.id }));
  }, [editSubjectId, tutor?.id, dispatch]);

  // 2️⃣ Синхронизация выбранных целей при получении tutorGoals
  useEffect(() => {
    if (!tutorGoals || tutorGoals.length === 0) return;

    const initial = tutorGoals
      .filter((goal) => goal.selected) // сервер уже присылает selected для текущего предмета
      .map((goal) => goal.id);

    setSelectedGoals(initial);
    setInitialSelectedGoals(initial);
    setShowSavedMessage(false);
  }, [tutorGoals]);

  const hasChanges = initialSelectedGoals.join(",") !== selectedGoals.join(",");

  const handleCheckboxChange = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const saveGoals = async () => {
    if (!token || !tutor?.id || !editSubjectId) return;

    setShowSaving(true);
    const start = Date.now();

    dispatch(
      updateTutorGoals({
        tutorId: tutor.id,
        subjectId: editSubjectId,
        goalIds: selectedGoals,
      })
    ).unwrap();
    await dispatch(getTutorIncompletePrices({ id: tutor.id })).unwrap();

    // После успешного обновления перезагружаем subjectsWithGoals
    // await dispatch(getTutorSubjectsWithGoals({ tutorId: tutor.id }));

    // Минимум 1 сек отображаем "Сохраняем..."
    const checkSaving = setInterval(() => {
      if (!tutorGoalsLoading && Date.now() - start >= 1000) {
        setShowSaving(false);
        clearInterval(checkSaving);
      }
    }, 50);
  };

  return (
    <>
      <div className={componentStyles.description}>
        Выберите цели, по&nbsp;которым проводите занятия.
        Так&nbsp;мы&nbsp;сможем отправлять вам&nbsp;уведомления о&nbsp;новых
        заказах, которые соответствуют вашим целям&nbsp;📣
      </div>
      <br />

      <div className={componentLocationStyle.containerAnswers}>
        {tutorGoals.map((goal) => (
          <div key={goal.id} className={componentLocationStyle.answerLocation}>
            <input
              checked={selectedGoals.includes(goal.id)}
              onChange={() => handleCheckboxChange(goal.id)}
              type="checkbox"
              className={componentLocationStyle.checkboxInput}
              id={`checkbox-${goal.id}`}
              name="checkbox"
            />
            <label
              className={componentLocationStyle.checkboxLabelLocation}
              htmlFor={`checkbox-${goal.id}`}
            >
              <span className={componentLocationStyle.checkbox}></span>
              <p className={componentLocationStyle.answerTitle}>{goal.title}</p>
            </label>
          </div>
        ))}
      </div>

      <div className={styles.button}>
        <button
          onClick={saveGoals}
          type="button"
          disabled={showSaving || !hasChanges}
          className={clsx({
            [componentStyles.buttonDisabled]: !hasChanges || showSaving,
            [componentStyles.buttonActive]: hasChanges && !showSaving,
          })}
        >
          Сохранить
          {showSaving && (
            <div className={componentStyles.buttonYlSpinner}>
              <Spinner />
            </div>
          )}
        </button>
      </div>

      <div
        className={componentStyles.successMessage}
        style={{
          opacity: showSavedMessage ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          height: "20px",
          marginTop: "8px",
        }}
      >
        Цели успешно сохранены
      </div>
    </>
  );
};
