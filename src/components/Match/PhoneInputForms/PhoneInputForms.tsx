"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import ReCaptcha from "@/components/reCapcha/reCapcha";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import { sendSms } from "@/utils/sensSms/sendSms";

interface Answer {
  id: number;
  title: string;
  nextPage: string;
}

interface ComponentRenderProps {
  id: number;
  question: string;
  description: string;
  typeForm: string;
  answerArray: Answer[];
}

type DataItem = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  [key: string]: any;
};

export const PhoneInputForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();
  // Состояние для содержимого в поле номер телефона
  const [inputValue, setInputValue] = useState("");
  // Состояние для ошибки
  const [errorInput, setErrorInput] = useState(false);
  // Состояние для reCaptcha
  const [verified, setVerified] = useState(false);
  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  // Добавляем в состояние неформатированный номер телефона
  const [to, setTo] = useState("");

  // Отправляем SMS
  const onClickSms = () => {
    sendSms(to);
    handleNextStep(nextPageProperty, inputValue, to);
  };

  // Функция для обновления состояния reCaptcha
  const handleVerify = (token: string | null) => {
    setVerified(!!token);
  };

  // Функция ввода и форматирования номера телефона в поле инпута
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setInputValue(formattedPhoneNumber.formatted);
    setTo(formattedPhoneNumber.original);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getDataMatchLS = localStorage.getItem("currentMatch");
  const dataMatch: DataItem[] = getDataMatchLS && JSON.parse(getDataMatchLS);

  const containsClassProperty = dataMatch.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  const handleNextStep = useCallback(
    (link: string, inputValue: string, originValue: string) => {
      setIsDisabled(true);
      setIsVisible(false);

      const newData = {
        id: id,
        [typeForm]: inputValue,
        origin: originValue,
      };

      if (containsClassProperty) {
        const indexOfArray = dataMatch.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );
        const filterDataMatch = dataMatch.filter(
          (obj, index) => index < indexOfArray
        );
        const dataToSave = [...filterDataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      } else {
        const dataToSave = [...dataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      }

      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm]
  );

  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    const valuePropertyOrigin = currentDataMatch
      ? currentDataMatch[origin]
      : "";
    setInputValue(valueProperty);
    setTo(valuePropertyOrigin);
  }, [typeForm]);

  const nextPageProperty = answerArray[0].nextPage;

  return (
    <>
      <div
        className={`${styles.container} ${
          isVisible ? animation.visible : animation.hidden
        }`}
      >
        <div className={styles.wrap}>
          <div onClick={handlePrevStep} className={styles.wrapIcon}>
            <Image
              width={20}
              height={20}
              alt="Назад"
              src="/img/icon/CaretLeft.svg"
              className={styles.iconBack}
            />
            Назад
          </div>
          <div className={styles.title}>{question}</div>
          <div className={styles.inputContainer}>
            <span
              className={clsx(styles.inputPhoneNumberPrefix, {
                [styles.visible]: isFocused || inputValue.length > 0,
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
              className={clsx(styles.inputPhoneNumber, {
                [styles.focused]: isFocused || inputValue.length > 0,
                [styles.errorInput]: errorInput,
              })}
              maxLength={15}
            />
          </div>
          {errorInput ? (
            <div className={styles.errorInputText}>
              Пожалуйста, введите корректный номер телефона
            </div>
          ) : null}
          <div className={styles.reCaptchaContainer}>
            <ReCaptcha onVerify={handleVerify} />
          </div>
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={onClickSms}
            className={styles.continueButton}
            disabled={inputValue.length < 15 || errorInput || !verified}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
