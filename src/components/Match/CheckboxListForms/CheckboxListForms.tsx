"use client";
import React, { useEffect, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
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
type DataItem = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  "study-place"?: string;
  [key: string]: any;
};

export const CheckboxListForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();

  // Создаем флаг для отслеживания первоначальной загрузки
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: DataItem[] = getDataMatchLS
    ? JSON.parse(getDataMatchLS)
    : [];
  // Получаем объект в массиве, в котором содержится свойство с typeForm текущей формы
  const containsClassProperty = dataMatch.find((obj) =>
    obj.hasOwnProperty(typeForm)
  );
  // Создаем переменную для начального значения состояния
  let initialCheckboxValue: string[];
  // Если длинна массива в объекте больше 0, то кладем это значение в initialCheckboxValue, чтобы передать в состояние при инициализации
  containsClassProperty?.[typeForm].length
    ? (initialCheckboxValue = containsClassProperty?.[typeForm])
    : (initialCheckboxValue = []);

  // Создаем состояние для чекбоксов
  const [checkbox, setCheckbox] = useState<string[]>(initialCheckboxValue);

  // Функция для обработки клика по чекбоксу
  const handleCheckboxClick = (title: string) => {
    setCheckbox((prev) => {
      // Проверяем, выбран ли уже этот ответ
      if (prev.includes(title)) {
        // Если выбран, убираем его из списка
        return prev.filter((item) => item !== title);
      } else {
        // Если не выбран, добавляем в список
        return [...prev, title];
      }
    });
  };

  const determineLink = (checkboxes: string[]): string | undefined => {
    const checkboxSet = new Set(checkboxes);

    if (
      checkboxSet.has("Дистанционно") &&
      !checkboxSet.has("У репетитора") &&
      !checkboxSet.has("У меня дома")
    ) {
      return "/match/tutorType/price";
    }
    if (
      checkboxSet.has("У репетитора") &&
      !checkboxSet.has("Дистанционно") &&
      !checkboxSet.has("У меня дома")
    ) {
      return "/match/tutorPlace/trip";
    }
    if (
      checkboxSet.has("У меня дома") &&
      !checkboxSet.has("Дистанционно") &&
      !checkboxSet.has("У репетитора")
    ) {
      return "/match/studentAdress/adress-1";
    }
    if (
      checkboxSet.has("Дистанционно") &&
      checkboxSet.has("У репетитора") &&
      !checkboxSet.has("У меня дома")
    ) {
      return "/match/tutorPlace/trip";
    }
    if (
      checkboxSet.has("Дистанционно") &&
      checkboxSet.has("У меня дома") &&
      !checkboxSet.has("У репетитора")
    ) {
      return "/match/studentAdress/adress-1";
    }
    if (
      !checkboxSet.has("Дистанционно") &&
      checkboxSet.has("У меня дома") &&
      checkboxSet.has("У репетитора")
    ) {
      return "/match/studentAdress/adress-2";
    }
    if (
      checkboxSet.has("Дистанционно") &&
      checkboxSet.has("У меня дома") &&
      checkboxSet.has("У репетитора")
    ) {
      return "/match/studentAdress/adress-2";
    }
    return undefined;
  };

  // Каждый раз, когда обновляется состояние checkbox редактируем массив ответов в LS
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    // Создаем новый объект, который нужно положить в массив с данными формы
    const newData = {
      id: id,
      [typeForm]: checkbox,
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

      // Вариант, когда не нужно удалять все ранее записанные свойства при изменении checkbox
      // dataMatch.splice(indexOfArray, 1, newData);
      // // Кладем новый массив в LS
      // localStorage.setItem("currentMatch", JSON.stringify(dataMatch));
    } else {
      // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
      const dataToSave = [...dataMatch, newData];
      localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
    }
  }, [checkbox]);

  // Функция для перехода на следующий шаг
  const handleNextStep = () => {
    // Обновляем состояния для красивого эффекта перехода
    setIsDisabled(true);
    setIsVisible(false);

    const link: string = determineLink(checkbox) ?? "/match/tutorType/price";

    // Для красоты делаем переход через 0,4 секунды после клика
    setTimeout(() => route.push(link), 400);
  };

  // Функция для возврата на предыдущий шаг
  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    // Для красоты делаем переход через 0,4 секунды после клика
    setTimeout(() => route.back(), 400);
  };

  // Состояния для красоты
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Это нужно для того, чтобы сохранилась красота, даже если клиент воспользуется кнопкой "Назад" в браузе
  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  // Находим объект массива по ID вопроса (формы)
  const currentDataMatch = dataMatch.find((obj) => obj.id === id);
  // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
  const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : null;
  const nextPagePropertyArr = answerArray.find(
    (obj) => obj.title === valueProperty
  );
  const nextPageProperty = nextPagePropertyArr
    ? nextPagePropertyArr?.nextPage
    : "";

  const isAnyRadioSelected = answerArray.some(
    (answer) => answer.title === valueProperty
  );

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
          <div className={styles.containerAnswers}>
            {answerArray.map((answer) => {
              return (
                <React.Fragment key={answer.id}>
                  <div className={styles.answer}>
                    <input
                      value={checkbox}
                      onChange={() => handleCheckboxClick(answer.title)}
                      checked={checkbox.includes(answer.title)}
                      type="checkbox"
                      className={styles.checkboxInput}
                      id={`checkbox-${answer.id}`}
                      name="checkbox"
                    />
                    <label
                      className={styles.checkboxLabel}
                      htmlFor={`checkbox-${answer.id}`}
                    >
                      <span className={styles.checkbox}></span>
                      <p className={styles.answerTitle}>{answer.title}</p>
                    </label>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            disabled={checkbox.length ? false : true}
            onClick={() => handleNextStep()}
            className={styles.continueButton}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
