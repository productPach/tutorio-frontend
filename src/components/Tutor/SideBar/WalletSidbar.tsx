"use client";
import styles from "../Modal/BalanceBoost/BalanceBoost.module.css";
import generalStyles from "../../../app/tutor/layout.module.css";

import React, { ChangeEvent, useState } from "react";
import clsx from "clsx";
import {
  setIsModalBalanceBoostNotEmail,
  setIsModalDepositBalanceYookassa,
  setIsSheetBalanceBoostNotEmail,
  setIsSheetDepositBalanceYookassa,
  setValueModalBalanceBoost,
} from "@/store/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const WalletSidbar = () => {
  const dispatch = useAppDispatch();

  const tutor = useAppSelector((state) => state.tutor.tutor); // Получаем tutor из Redux
  const isVerifiedEmail = tutor?.isVerifedEmail;

  // Стейт для значения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState("100");
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

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleOpenModal = () => {
    if (!isVerifiedEmail) {
      if (window.innerWidth < 769) {
        dispatch(setIsSheetBalanceBoostNotEmail(true));
      } else {
        dispatch(setIsModalBalanceBoostNotEmail(true));
      }

      return;
    }

    const amount = Number(inputValue);

    if (amount < 100) {
      setErrorInput(true);
      return;
    }

    dispatch(setValueModalBalanceBoost(inputValue));
    if (window.innerWidth < 769) {
      dispatch(setIsSheetDepositBalanceYookassa(true));
    } else {
      dispatch(setIsModalDepositBalanceYookassa(true));
    }
  };

  return (
    <>
      <div className={generalStyles.sidebarResponse}>
        <div className={clsx(generalStyles.sidebar_filterOrder)}>
          <h3>Пополнить баланс</h3>
          <div className={styles.description}>
            Пополните баланс, чтобы не упускать подходящие заказы и откликаться
            на них без задержек
          </div>
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
              className={clsx(styles.minValueBoost, {
                [styles.error]: errorInput,
              })}
            >
              Минимальная сумма пополнения — 100 ₽
            </div>
          </div>
          <div className={styles.button}>
            <button
              type="button"
              disabled={errorInput}
              onClick={handleOpenModal}
            >
              Пополнить баланс
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
