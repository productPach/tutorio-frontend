"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdressInputForms } from "./AdressInputForms";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { LocationMultiDropdownForms } from "./LocationMultiDropdownForms";
import { setModalSelectCity } from "@/store/features/modalSlice";

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
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
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем значение regionUser из Redux
  const regionUser = useAppSelector((state) => state.match.regionUser);

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

  // Создаем переменную для начального значения состояния
  let initialCheckboxTripValue: string[];
  containsClassProperty?.[typeForm].length
    ? (initialCheckboxTripValue = containsClassProperty?.[typeForm])
    : (initialCheckboxTripValue = []);

  // Создаем состояние для чекбоксов
  const [checkbox, setCheckbox] = useState<string[]>(initialCheckboxValue);
  // Создаем состояние для чекбоксов
  const [checkboxTrip, setCheckboxTrip] = useState<string[]>(
    initialCheckboxTripValue
  );

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

  // Функция для обработки клика по чекбоксу
  const handleCheckboxTripClick = (title: string) => {
    setCheckboxTrip((prev) => {
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
            <React.Fragment key={"1"}>
              <div className={styles.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("1")}
                  checked={checkbox.includes("1")}
                  type="checkbox"
                  className={styles.checkboxInput}
                  id={`checkbox-1`}
                  name="checkbox"
                />
                <label
                  className={styles.checkboxLabelLocation}
                  htmlFor={`checkbox-1`}
                >
                  <span className={styles.checkbox}></span>
                  <p className={styles.answerTitle}>Дистанционно</p>
                </label>
              </div>
            </React.Fragment>
            <React.Fragment key={"2"}>
              <div className={styles.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("2")}
                  checked={checkbox.includes("2")}
                  type="checkbox"
                  className={styles.checkboxInput}
                  id={`checkbox-2`}
                  name="checkbox"
                />
                <label
                  className={styles.checkboxLabelLocation}
                  htmlFor={`checkbox-2`}
                >
                  <span className={styles.checkbox}></span>
                  <p className={styles.answerTitle}>
                    Занимаюсь с учениками у себя
                  </p>
                </label>
              </div>
              {checkbox.includes("2") && (
                <AdressInputForms
                  id={id}
                  question={question}
                  typeForm={typeForm}
                />
              )}
            </React.Fragment>
            <React.Fragment key={"3"}>
              <div className={styles.answerLocation}>
                <input
                  value={checkbox}
                  onChange={() => handleCheckboxClick("3")}
                  checked={checkbox.includes("3")}
                  type="checkbox"
                  className={styles.checkboxInput}
                  id={`checkbox-3`}
                  name="checkbox"
                />
                <label
                  className={styles.checkboxLabelLocation}
                  htmlFor={`checkbox-3`}
                >
                  <span className={styles.checkbox}></span>
                  <p className={styles.answerTitle}>
                    Готов выезжать к ученикам
                  </p>
                </label>
              </div>
              {checkbox.includes("3") && (
                <div className={styles.wrapAdress}>
                  <div className={styles.description}>
                    Укажите места, куда вы готовы выезжать на занятия с
                    учениками
                  </div>
                  <div className={styles.description}>
                    Регион:{" "}
                    <span
                      onClick={() => {
                        dispatch(setModalSelectCity(true));
                      }}
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {regionUser && regionUser.city} и{" "}
                      {regionUser && regionUser.area}
                    </span>
                  </div>
                  <div className={styles.containerAnswers}>
                    <React.Fragment key={"1"}>
                      <div className={styles.answerLocation}>
                        <input
                          value={checkbox}
                          onChange={() => handleCheckboxTripClick("1")}
                          checked={checkboxTrip.includes("1")}
                          type="checkbox"
                          className={styles.checkboxInput}
                          id={`checkboxTrip-1`}
                          name="checkboxTrip"
                        />
                        <label
                          className={styles.checkboxLabelLocation}
                          htmlFor={`checkboxTrip-1`}
                        >
                          <span className={styles.checkbox}></span>
                          <p className={styles.answerTitle}>
                            {regionUser?.city}
                          </p>
                        </label>
                      </div>
                      {checkboxTrip.includes("1") && (
                        <>
                          <div className={styles.wrapAdress}>
                            <div className={styles.containerAnswers}>
                              <React.Fragment key={"1"}>
                                <div className={styles.answerContainer}>
                                  <input
                                    // checked={answer.title === valueProperty && true}
                                    readOnly
                                    type="radio"
                                    className={styles.radioInput}
                                    id={`radio-1`}
                                    name="goal"
                                  />
                                  <label
                                    className={styles.radioLabel}
                                    htmlFor={`radio-1`}
                                  >
                                    <span className={styles.radio}></span>
                                    <p className={styles.answerTitle}>
                                      Выезжаю по всему городу
                                    </p>
                                  </label>
                                </div>
                              </React.Fragment>
                              <React.Fragment key={"2"}>
                                <div className={styles.answerContainer}>
                                  <input
                                    //   checked={answer.title === valueProperty && true}
                                    readOnly
                                    type="radio"
                                    className={styles.radioInput}
                                    id={`radio-2`}
                                    name="goal"
                                  />
                                  <label
                                    className={styles.radioLabel}
                                    htmlFor={`radio-2`}
                                  >
                                    <span className={styles.radio}></span>
                                    <p className={styles.answerTitle}>
                                      Выбрать отдельные районы и станции метро
                                    </p>
                                  </label>
                                </div>
                              </React.Fragment>
                            </div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                    <React.Fragment key={"2"}>
                      <div className={styles.answerLocation}>
                        <input
                          value={checkbox}
                          onChange={() => handleCheckboxTripClick("2")}
                          checked={checkboxTrip.includes("2")}
                          type="checkbox"
                          className={styles.checkboxInput}
                          id={`checkboxTrip-2`}
                          name="checkboxTrip"
                        />
                        <label
                          className={styles.checkboxLabelLocation}
                          htmlFor={`checkboxTrip-2`}
                        >
                          <span className={styles.checkbox}></span>
                          <p className={styles.answerTitle}>
                            {regionUser?.area}
                          </p>
                        </label>
                      </div>
                      {checkboxTrip.includes("2") && (
                        <LocationMultiDropdownForms
                          id={id}
                          question={question}
                          typeForm={typeForm}
                        />
                      )}
                    </React.Fragment>
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
        <div className={styles.wrapButtonStandart}>
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
