"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

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

// Определяем тип для объекта в массиве
type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  [key: string]: any;
};

export const YearsInputForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();

  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Функция для валидации значения поля
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (/[^\d]/.test(e.target.value)) {
      setErrorInput(true);
    } else {
      setErrorInput(false);
    }
    setInputValue(e.target.value);
  };

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataMatch.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  // Функция для перехода на следующий шаг
  const handleNextStep = useCallback(
    (link: string, inputValue: string) => {
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);

      // Создаем новый объект, который нужно положить в массив с данными формы
      const newData = {
        id: id,
        [typeForm]: inputValue,
      };

      // Если typeForm текущей формы уже содержится в массиве, значит клиент уже отвечал на данный вопрос, и значит нужно удалить все последующие ответы (элементы массива с индексом больше индекса текущего объекта)
      if (containsClassProperty) {
        // Определяем индекс элмента массива (объекта, который появлися в массиве в результате ответа на данную форму)
        const indexOfArray = dataMatch.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );
        // Фильтруем массив, чтобы в нем остались элементы с индексами меньше текущего (удаляем все последующие ответы)
        const filterDataMatch = dataMatch.filter(
          (obj, index) => index < indexOfArray
        );
        // Добавляем новый объект в копию старого массива, уже отфильтрованного
        const dataToSave = [...filterDataMatch, newData];
        // Кладем новый массив в LS
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      } else {
        // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
        const dataToSave = [...dataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      }
      // Для красоты делаем переход через 0,4 секунды после клика
      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm]
  );

  // Функция для возврата на предыдущий шаг
  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    // Для красоты делаем переход через 0,4 секунды после клика
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  useEffect(() => {
    // Находим объект массива по ID вопроса (формы)
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);

    // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    setInputValue(valueProperty);
  }, [typeForm]);

  const nextPageProperty = answerArray[0].nextPage;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Проверяем, содержит ли inputValue только цифры
      const isValidInput = /^\d+$/.test(inputValue);
      if (e.key === "Enter") {
        if (isValidInput) {
          handleNextStep(nextPageProperty, inputValue);
        } else {
          setErrorInput(true);
        }
      }
    };

    const input = document.getElementById("stydentYears");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue]);

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
          {/* <div className={styles.description}>Выберите один из нижеперечисленных вариантов</div> */}
          <input
            id="stydentYears"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={answerArray[0].title}
            autoComplete="off"
            value={inputValue}
            onChange={handleInputValue}
            className={clsx(styles.inputStudentYears, {
              [styles.errorInput]: errorInput,
            })}
            maxLength={2}
          />
          {errorInput ? (
            <div className={styles.errorInputText}>
              Пожалуйста, введите возраст ученика используя только цифры
            </div>
          ) : null}
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={() => handleNextStep(nextPageProperty, inputValue)}
            className={styles.continueButton}
            disabled={!inputValue || errorInput}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
