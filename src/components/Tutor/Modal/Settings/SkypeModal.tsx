"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/Fio/Fio.module.css";
import { ChangeEvent, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { setIsModalSkype, setScrollY } from "@/store/features/modalSlice";

export const SkypeModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(tutor?.skype || "");
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^a-zA-Z0-9._-]/g, ""); // Оставляем только допустимые символы

    // Убираем начальные и конечные запрещённые символы
    value = value.replace(/^[-_.]+|[-_.]+$/g, "");

    // Запрещаем последовательность из нескольких точек, дефисов или подчёркиваний
    value = value.replace(/([._-]){2,}/g, "$1");

    // Ограничиваем длину до 32 символов
    if (value.length > 32) {
      value = value.slice(0, 32);
    }

    setInputValue(value);
    setErrorInput(value.length < 6); // Ошибка, если длина меньше 6 символов
  };

  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = tutor?.id;
    const skype = inputValue;
    const status = tutor?.status;
    if (token && id && status) {
      dispatch(updateTutor({ id, token, status, skype })).unwrap;
      dispatch(setIsModalSkype(false));
      dispatch(setScrollY(0));
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
      <div className={styles.description}>Пожалуйста, укажите логин skype</div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={"Например, loginSkype"}
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
          maxLength={255}
        />
      </div>
      <div className={styles.button}>
        <button onClick={update} type="button" disabled={errorInput}>
          Сохранить
        </button>
      </div>
    </>
  );
};
