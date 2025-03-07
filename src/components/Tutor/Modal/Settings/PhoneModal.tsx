"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/Fio/Fio.module.css";
import componentStyles from "./Settings.module.css";
import { ChangeEvent, useState } from "react";
import { updateTutor } from "@/store/features/tutorSlice";
import { setIsModalPhone, setScrollY } from "@/store/features/modalSlice";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";

export const PhoneModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const tutor = useAppSelector((state) => state.tutor.tutor);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(
    tutor?.phone ? formatPhoneNumber(tutor?.phone).formatted : ""
  );
  // Добавляем в состояние неформатированный номер телефона
  const [to, setTo] = useState("");
  // Функция ввода и форматирования номера телефона в поле инпута
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setInputValue(formattedPhoneNumber.formatted);
    setTo(formattedPhoneNumber.original);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = tutor?.id;
    const email = inputValue;
    const status = tutor?.status;
    if (token && id && status) {
      dispatch(updateTutor({ id, token, status, email })).unwrap;
      dispatch(setIsModalPhone(false));
      dispatch(setScrollY(0));
    }
  };

  return (
    <>
      <div className={styles.description}>
        На указанный номер придёт проверочный код для подтверждения
      </div>
      <div className={styles.inputContainer}>
        <span
          className={clsx(componentStyles.inputPhoneNumberPrefix, {
            [componentStyles.visible]: isFocused || inputValue.length > 0,
          })}
        >
          +7
        </span>
        <input
          id="studentPhoneNumber"
          type="tel"
          placeholder="Введите номер телефона"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(componentStyles.inputPhoneNumber, {
            [componentStyles.focused]: isFocused || inputValue.length > 0,
            [componentStyles.errorInput]: errorInput,
          })}
          maxLength={15}
        />
      </div>
      <div className={styles.button}>
        <button
          onClick={update}
          type="button"
          disabled={inputValue.length < 15 || errorInput}
        >
          Изменить
        </button>
      </div>
    </>
  );
};
