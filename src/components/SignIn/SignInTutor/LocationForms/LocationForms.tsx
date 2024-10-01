"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Answer {
  id: number;
  title: string;
}

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
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

export const LocationForms: React.FC<ComponentRenderProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
  answerArray,
}) => {
  const route = useRouter();

  // Создаем флаг для отслеживания первоначальной загрузки
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("current-user");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];
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
      localStorage.setItem("current-user", JSON.stringify(dataToSave));

      // Вариант, когда не нужно удалять все ранее записанные свойства при изменении checkbox
      // dataMatch.splice(indexOfArray, 1, newData);
      // // Кладем новый массив в LS
      // localStorage.setItem("current-user", JSON.stringify(dataMatch));
    } else {
      // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
      const dataToSave = [...dataMatch, newData];
      localStorage.setItem("current-user", JSON.stringify(dataToSave));
    }
  }, [checkbox]);

  // Функция для перехода на следующий шаг
  const handleNextStep = () => {
    // Обновляем состояния для красивого эффекта перехода
    setIsDisabled(true);
    setIsVisible(false);

    // Для красоты делаем переход через 0,4 секунды после клика
    setTimeout(() => route.push(nextPage), 400);
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
                      className={styles.checkboxLabelLocation}
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
