"use client";

import { useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "./BalanceBoost.module.css";
import { ChangeEvent, useEffect, useState } from "react";

export const BalanceBoost = () => {
  // Вытаскиваем стоимость отклика на заказ из Redux
  const valueBoost = useAppSelector(
    (state) => state.modal.valueModalBalanceBoost
  );
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(valueBoost);
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Убираем нечисловые символы
    setInputValue(value);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  useEffect(() => {
    const numericInputValue = Number(inputValue);
    const numericValueBoost = Number(valueBoost);
    if (numericInputValue < numericValueBoost) {
      setErrorInput(true);
    } else {
      setErrorInput(false);
    }
  }, [inputValue, valueBoost]);

  console.log(errorInput);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  return (
    <>
      <div className={styles.description}>
        После добавления отклика вы сможете связаться с учеником и договориться
        о занятиях
      </div>
      {/* <div>
        Вернем деньги за отклик, если ученик не посмотрит его в течение 5 дней
      </div> */}
      <div className={styles.inputContainer}>
        <span
          className={clsx(styles.inputPhoneNumberPrefix, {
            [styles.visible]: isFocused || inputValue.length > 0,
          })}
        >
          ₽
        </span>
        <input
          type="number"
          placeholder={"Укажите сумму пополнения"}
          autoComplete="off"
          value={inputValue}
          onChange={handleInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(styles.inputPhoneNumber, {
            [styles.focused]: isFocused || inputValue.length > 0,
            [styles.errorInput]: errorInput,
          })}
          maxLength={7}
        />
        <div
          className={clsx(styles.minValueBoost, { [styles.error]: errorInput })}
        >
          Минимальная сумма пополнения — {valueBoost} ₽
        </div>
      </div>
      <div className={styles.button}>
        <button type="button" disabled={errorInput}>
          Пополнить баланс
        </button>
      </div>
    </>
  );
};
