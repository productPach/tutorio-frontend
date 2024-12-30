"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Fio/Fio.module.css";
import componentStyles from "./Education.module.css";
import { ChangeEvent, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { setIsModalExperience } from "@/store/features/modalSlice";

export const EducationItemModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
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
    const status = tutor?.status;
    if (token && id && status) {
      dispatch(updateTutor({ id, token, status, experience })).unwrap;
      dispatch(setIsModalExperience(false));
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
        Вы действительно хотите удалить запись об образовании?
      </div>

      <div className={clsx(styles.button, componentStyles.containerFlxRw)}>
        <button
          onClick={update}
          type="button"
          disabled={!inputValue || errorInput}
        >
          Отмена
        </button>
        <button
          className={styles.buttonGr}
          onClick={update}
          type="button"
          disabled={!inputValue || errorInput}
        >
          Удалить образование
        </button>
      </div>
    </>
  );
};
