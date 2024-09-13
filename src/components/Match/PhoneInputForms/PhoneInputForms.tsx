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
import { securePinGenerator } from "@/utils/securePinGenerator/securePinGenerator";
import { performActionBasedOnUserExistence } from "@/utils/match/performActionBasedOnUserExistence/performActionBasedOnUserExistence";

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

  const initialTimeLS = localStorage.getItem("confirm-time"); // Начальное количество минут
  const initialTime = initialTimeLS
    ? JSON.parse(initialTimeLS)
    : { minutes: 0, seconds: 0, index: 0 };

  const [minutes, setMinutes] = useState(initialTime.minutes); // Состояние для отображения минут
  const [seconds, setSeconds] = useState(initialTime.seconds); // Состояние для отображения секунд
  const [index, setIndex] = useState(initialTime.index); // Состояние для количества попыток повторной отправки
  // Состояние для таймера
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Функция для добавления ведущих нулей к числам меньше 10
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  // Кладем в LS оригинальный номер телефона без форматирования каждый раз при изменении to
  useEffect(() => {
    if (to) {
      localStorage.setItem("origin-phone", JSON.stringify(to));
    }
  }, [to]);

  useEffect(() => {
    let interval = setInterval(() => {
      // Уменьшаем счетчик времени каждую секунду
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setIsTimerActive(false);
          clearInterval(interval);
          // Действия по завершению таймера (например, вызов функции или обработка события)
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, [minutes, seconds]);

  useEffect(() => {
    const confirmTime = {
      minutes,
      seconds,
      index,
    };
    localStorage.setItem("confirm-time", JSON.stringify(confirmTime));
  }, [minutes, seconds, index]);

  // Отправляем SMS
  const onClickSms = () => {
    // Генерируем проверочный код
    const confirmCode = securePinGenerator();
    // Проверяем есть ли пользователь: если есть, обновляем секретный код, если нет - регистрируем
    performActionBasedOnUserExistence(to, confirmCode);
    // Временно добавляем код в LocalStorage
    localStorage.setItem("confirm-code", JSON.stringify(confirmCode));
    sendSms(to, confirmCode);
    handleNextStep(nextPageProperty, inputValue, to);
    if (index === 0) {
      setMinutes(0);
      setSeconds(59);
      setIndex(1);
    }
    if (index === 1) {
      setMinutes(1);
      setSeconds(59);
      setIndex(2);
    }
    if (index === 2) {
      setMinutes(4);
      setSeconds(59);
      setIndex(3);
    }
    if (index >= 3) {
      setMinutes(14);
      setSeconds(59);
      setIndex(4);
    }
    if (index >= 4) {
      setMinutes(29);
      setSeconds(59);
    }
    const confirmTime = {
      minutes,
      seconds,
      index,
    };
    localStorage.setItem("confirm-time", JSON.stringify(confirmTime));
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

  // Достаем массив с данными заявки
  const getDataMatchLS = localStorage.getItem("currentMatch");
  const dataMatch: DataItem[] = getDataMatchLS
    ? JSON.parse(getDataMatchLS)
    : [];
  // Достаем оригинальный телефон
  const getOriginPhone = localStorage.getItem("origin-phone");
  const originPhone: string = getOriginPhone && JSON.parse(getOriginPhone);

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
    const valuePropertyOrigin = originPhone ? originPhone : "";
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
          <div
            className={clsx(
              styles.sendAgainContainer,
              isTimerActive && (minutes !== 0 || seconds !== 0)
                ? ""
                : styles.sendAgainActive
            )}
          >
            {isTimerActive && (minutes !== 0 || seconds !== 0) ? (
              `Изменить телефон можно через ${formatTime(minutes)}:
            ${formatTime(seconds)}`
            ) : (
              <div className={styles.reCaptchaContainer}>
                <ReCaptcha onVerify={handleVerify} />
              </div>
            )}
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
