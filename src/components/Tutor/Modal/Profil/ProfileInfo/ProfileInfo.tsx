"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "./ProfileInfo.module.css";
import { ChangeEvent, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { setIsModalProfileInfo } from "@/store/features/modalSlice";

export const ProfileInfo = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
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
    if (token && id) {
      dispatch(updateTutor({ id, token, profileInfo })).unwrap;
      dispatch(setIsModalProfileInfo(false));
    }
  };

  return (
    <>
      <div className={styles.description}>
        Поделитесь информацией о себе, чтобы клиенты могли лучше вас узнать.
        Пожалуйста, не указывайте ссылки, контактные данные или стоимость услуг
      </div>
      <div className={styles.inputContainer}>
        <textarea
          placeholder={
            "Любая информация о себе, кроме ссылок, контактов и стоимости занятий"
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
