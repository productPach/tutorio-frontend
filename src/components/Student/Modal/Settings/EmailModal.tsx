"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import { ChangeEvent, useState } from "react";
import { setIsModalEmail, setScrollY } from "@/store/features/modalSlice";
import { updateStudent } from "@/store/features/studentSlice";
import { sendVerificationEmail } from "@/api/server/studentApi";

export const EmailModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const token = useAppSelector((state) => state.auth.token);
  const student = useAppSelector((state) => state.student.student);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(student?.email || "");
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Проверка на допустимые символы для e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Убираем все символы, которые не подходят для e-mail
    if (!emailRegex.test(value)) {
      setErrorInput(true); // Если email не соответствует формату, устанавливаем ошибку
    } else {
      setErrorInput(false); // Если email правильный, ошибки нет
    }

    setInputValue(value);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const update = () => {
    const id = student?.id;
    const email = inputValue;
    const status = student?.status;
    const isVerifedEmail = false;

    if (token && id && status) {
      // sendEmail({
      //   to: email,
      //   subject: "Подтверждение почты",
      //   text: "Для подтверждения вашей почты: " + email,
      //   html, // Передаём HTML-версию письма
      // });

      dispatch(updateStudent({ id, token, status, email, isVerifedEmail }))
        .unwrap()
        .then(() => sendVerificationEmail(id, token))
        .catch((error) => console.error("Ошибка обновления ученика:", error));

      dispatch(setIsModalEmail(false));
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
        Мы отправим на ваш e-mail проверочное письмо. Пожалуйста, откройте его и
        подтвердите ваш адрес
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={"Например, name@mail.ru"}
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
          Изменить
        </button>
      </div>
    </>
  );
};
