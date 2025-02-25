"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "../ProfileInfo/ProfileInfo.module.css";
import componentStyles from "./SubjectModal.module.css";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { Search } from "@/components/SelectSubject/Search";
import { data } from "@/utils/listSubjects";
import { SubjectItem } from "@/components/SignIn/SignInTutor/SubjectsForms/SubjectItem";
import { setIsModalEditSubjectPrices } from "@/store/features/modalSlice";
import clsx from "clsx";
import { Subject } from "@/types/types";

export const SubjectModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const editSubjectId = useAppSelector(
    (state) => state.modal.subjectForEditInModal
  );
  const subject: Subject | undefined = data.find(
    (item) => item.id_p === editSubjectId
  );
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(tutor?.profileInfo);
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value; // Убираем все не буквенные символы
    setInputValue(value);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = tutor?.id;
    const profileInfo = inputValue;
    const status = tutor?.status;
    if (token && id && status) {
      dispatch(updateTutor({ id, token, status, profileInfo })).unwrap;
      dispatch(setIsModalEditSubjectPrices(false));
    }
  };

  return (
    <>
      <h2 className={componentStyles.title}>{subject?.title}</h2>
      <div className={componentStyles.description}>Комментарий по занятиям</div>
      <div className={styles.inputContainer}>
        <textarea
          placeholder={
            "Дополнительная информация о занятиях: пожелания, формат, особенности обучения"
          }
          autoComplete="off"
          value={inputValue}
          onChange={handleInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(styles.textarea, {
            [styles.focused]: isFocused,
            [styles.errorInput]: errorInput,
          })}
          maxLength={5000}
        />
      </div>
      <div className={styles.button}>
        <button onClick={update} type="button">
          Сохранить
        </button>
      </div>
    </>
  );
};
