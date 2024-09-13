"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "../Match/Match.module.css";
import { sendSms } from "@/utils/sensSms/sendSms";
import { securePinGenerator } from "@/utils/securePinGenerator/securePinGenerator";
import { performActionBasedOnUserExistence } from "@/utils/match/performActionBasedOnUserExistence/performActionBasedOnUserExistence";

export const TimerSms = () => {
  const initialTimeLS = localStorage.getItem("confirm-time"); // Начальное количество минут
  const initialTime = initialTimeLS
    ? JSON.parse(initialTimeLS)
    : { minutes: 0, seconds: 59, index: 0 };

  const [minutes, setMinutes] = useState(initialTime.minutes); // Состояние для отображения минут
  const [seconds, setSeconds] = useState(initialTime.seconds); // Состояние для отображения секунд
  const [index, setIndex] = useState(initialTime.index); // Состояние для количества попыток повторной отправки
  // Состояние для таймера
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Достаем оригинальный телефон
  const getOriginPhone = localStorage.getItem("origin-phone");
  const originPhone: string = getOriginPhone && JSON.parse(getOriginPhone);

  // Функция для добавления ведущих нулей к числам меньше 10
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  // Повторно отправляем SMS
  const onClickSms = () => {
    // Генерируем проверочный код
    const confirmCode = securePinGenerator();
    // Проверяем есть ли пользователь: если есть, обновляем секретный код, если нет - регистрируем
    performActionBasedOnUserExistence(originPhone, confirmCode);
    // Временно добавляем код в LocalStorage
    localStorage.setItem("confirm-code", JSON.stringify(confirmCode));
    setIsTimerActive(true);
    setIndex((state: number) => state + 1);
    sendSms(originPhone, confirmCode);
    if (index === 0) {
      setMinutes(9);
      setSeconds(59);
    }
    if (index === 1) {
      setMinutes(1);
      setSeconds(59);
    }
    if (index === 2) {
      setMinutes(4);
      setSeconds(59);
    }
    if (index >= 3) {
      setMinutes(14);
      setSeconds(59);
    }
    if (index >= 4) {
      setMinutes(29);
      setSeconds(59);
    }
  };

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

  return (
    <div
      className={clsx(
        styles.sendAgainContainer,
        isTimerActive && (minutes !== 0 || seconds !== 0)
          ? ""
          : styles.sendAgainActive
      )}
    >
      {isTimerActive && (minutes !== 0 || seconds !== 0) ? (
        `Отправить код ещё раз через ${formatTime(minutes)}:
            ${formatTime(seconds)}`
      ) : (
        <span onClick={onClickSms}>Отправить код ещё раз</span>
      )}
    </div>
  );
};
