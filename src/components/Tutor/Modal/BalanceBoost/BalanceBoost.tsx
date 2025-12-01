"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "./BalanceBoost.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  setIsModalBalanceBoost,
  setIsModalDepositBalanceYookassa,
  setIsSheetBalanceBoost,
  setIsSheetDepositBalanceYookassa,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";

export const BalanceBoost = ({ description }: { description?: string }) => {
  const dispatch = useAppDispatch();
  // Вытаскиваем стоимость отклика на заказ из Redux
  const valueBoost = useAppSelector(
    (state) => state.modal.valueModalBalanceBoost
  );
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState(valueBoost);
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    // Оставляем только цифры и ограничиваем длину до 5 символов
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);

    setInputValue(value);

    // Сброс ошибки, если >= 100
    if (Number(value) >= 100) {
      setErrorInput(false);
    }
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

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleOpenModal = () => {
    const amount = Number(inputValue);
    if (amount < 100) {
      setErrorInput(true);
      return;
    }

    dispatch(setValueModalBalanceBoost(inputValue));
    if (window.innerWidth < 769) {
      dispatch(setIsSheetBalanceBoost(false));
      dispatch(setIsSheetDepositBalanceYookassa(true));
    } else {
      dispatch(setIsModalBalanceBoost(false));
      dispatch(setIsModalDepositBalanceYookassa(true));
    }
  };

  return (
    <>
      <div className={styles.description}>
        {description
          ? description
          : "После добавления отклика вы сможете связаться с учеником и договориться о занятиях"}
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
          maxLength={5}
        />
        <div
          className={clsx(styles.minValueBoost, { [styles.error]: errorInput })}
        >
          Минимальная сумма пополнения — {valueBoost} ₽
        </div>
      </div>
      <div className={styles.button}>
        <button onClick={handleOpenModal} type="button" disabled={errorInput}>
          Пополнить баланс
        </button>
      </div>
    </>
  );
};
