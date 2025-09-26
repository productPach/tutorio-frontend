"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Fio/Fio.module.css";
import { ChangeEvent, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import {
  setIsModalExperience,
  setIsSheetExperience,
} from "@/store/features/modalSlice";
import { getAccessToken } from "@/api/server/auth";

export const ExperienceModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  //const token = useAppSelector((state) => state.auth.token);
  const token = getAccessToken(); // берём из localStorage
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(tutor?.experience);
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(value);
    setErrorInput(value.length < 1);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = tutor?.id;
    const experience = inputValue;
    if (token && id) {
      dispatch(updateTutor({ id, experience })).unwrap;
      dispatch(setIsModalExperience(false));
      dispatch(setIsSheetExperience(false));
    }
  };

  // Обработчик для события нажатия клавиши
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !errorInput) {
      update(); // Вызываем сохранение при нажатии на Enter
    }
  };

  return (
    <>
      <div className={styles.description}>
        Пожалуйста, укажите ваш стаж репетиторства
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={"Введите только цифры"}
          autoComplete="off"
          value={inputValue}
          onChange={handleInputValue}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(styles.input, {
            [styles.focused]: isFocused,
            [styles.errorInput]: errorInput,
          })}
          maxLength={2}
        />
      </div>
      <div className={styles.button}>
        <button
          onClick={update}
          type="button"
          disabled={!inputValue || errorInput}
        >
          Сохранить
        </button>
      </div>
    </>
  );
};
