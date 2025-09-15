"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "./Fio.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { setIsModalFio, setIsSheetFio } from "@/store/features/modalSlice";

export const Fio = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(tutor?.name);
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ""); // Убираем все не буквенные символы
    setInputValue(value);
    setErrorInput(value.trim().length < 2); // Устанавливаем ошибку, если строка пустая или состоит из пробелов
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = tutor?.id;
    const name = inputValue;
    if (token && id) {
      dispatch(updateTutor({ id, token, name })).unwrap;
      dispatch(setIsModalFio(false));
      dispatch(setIsSheetFio(false));
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
        Пожалуйста, укажите ваше полное ФИО, как в паспорте
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={"Например, Николай Александрович Романов"}
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
