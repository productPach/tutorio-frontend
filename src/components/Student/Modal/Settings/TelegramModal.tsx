"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import { ChangeEvent, useState } from "react";
import { setIsModalTelegram, setScrollY } from "@/store/features/modalSlice";
import { updateStudent } from "@/store/features/studentSlice";

export const TelegramModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const student = useAppSelector((state) => state.student.student);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(student?.telegram || "");
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^a-zA-Z0-9_]/g, ""); // Разрешаем только буквы, цифры и "_"

    if (/^\d/.test(value)) {
      value = value.replace(/^\d+/, ""); // Убираем цифры в начале
    }

    if (value.length > 32) {
      value = value.slice(0, 32); // Ограничиваем длину до 32 символов
    }

    setInputValue(value);
    setErrorInput(value.length < 5); // Ошибка, если длина < 5
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = student?.id;
    const telegram = inputValue;
    const status = student?.status;
    if (token && id && status) {
      dispatch(updateStudent({ id, token, status, telegram })).unwrap;
      dispatch(setIsModalTelegram(false));
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
      <div className={styles.description}>
        Пожалуйста, укажите логин telegram без @
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={"Например, loginTelegram"}
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
