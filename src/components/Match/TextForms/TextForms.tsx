"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCreateOrder } from "@/api/server/orderApi";
import { createStudent } from "@/store/features/studentSlice";

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

export const TextForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  description,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем токен из Redux
  const token = useAppSelector((state) => state.auth.token);
  // Получаем студента из Redux
  const student = useAppSelector((state) => state.student.student);
  // Получаем репетитора из Redux (пока хардкодим)
  const tutor = {
    name: "Павел Федотов",
    phone: "9269811041",
  };
  //const tutor = useAppSelector((state) => state.tutor.tutor);

  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);
  // Состояние для флоу заказа если пользователь аутентифицирован
  const [isAuth, setIsAuth] = useState(false);

  // Функция для валидации значения поля
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
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

  // Функция добавления нового объекта в LS
  const setValueFormInLS = (inputValue: string) => {
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
      inputValue &&
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
    } else {
      // Если typeForm текущей формы не содержится в массиве, тогда просто добавляем новый объект в массив и кладем в LS
      const dataToSave = [...dataMatch, newData];
      inputValue &&
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
    }
    return inputValue;
  };

  // Функция для перехода на следующий шаг
  const handleNextStep = useCallback(
    (link: string, inputValue: string) => {
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);
      setValueFormInLS(inputValue);

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

  // Функция перехода на следующий шаг, если есть токен
  const handleNextStepIfTokenTrue = async (
    token: string,
    inputValue: string
  ) => {
    const createOrder = () => {
      const subjectDataMatch = dataMatch.find((obj) => obj.id === 0)?.subject;
      const goalDataMatch = dataMatch.find((obj) => obj.id === 1)?.goal;
      const classDataMatch = dataMatch.find((obj) => obj.id === 2)?.class;
      const studentTypeDataMatch = dataMatch.find(
        (obj) => obj.id === 3
      )?.studentType;
      const studentCourseDataMatch = dataMatch.find(
        (obj) => obj.id === 4
      )?.studentCourse;
      const deadlineDataMatch = dataMatch.find((obj) => obj.id === 5)?.deadline;
      const studentLevelDataMatch = dataMatch.find(
        (obj) => obj.id === 6
      )?.studentLevel;
      const studentYearsDataMatch = dataMatch.find(
        (obj) => obj.id === 7
      )?.studentYears;
      const tutorGenderDataMatch = dataMatch.find(
        (obj) => obj.id === 8
      )?.tutorGender;
      const studentUniversityDataMatch = dataMatch.find(
        (obj) => obj.id === 9
      )?.studentUniversity;
      const internationalExamDataMatch = dataMatch.find(
        (obj) => obj.id === 10
      )?.internationalExam;
      const studyMethodsDataMatch = dataMatch.find(
        (obj) => obj.id === 11
      )?.studyMethods;
      const studyProgrammsDataMatch = dataMatch.find(
        (obj) => obj.id === 12
      )?.studyProgramms;
      const timetableDataMatch = dataMatch.find(
        (obj) => obj.id === 13
      )?.timetable;
      const studyPlaceDataMatch = dataMatch.find(
        (obj) => obj.id === 14
      )?.studyPlace;
      const studentAdressDataMatch = dataMatch.find(
        (obj) => obj.id === 15
      )?.studentAdress;
      const studentTripDataMatchLS =
        dataMatch.find((obj) => obj.id === 16)?.studentTrip || [];
      const studentTripDataMatch = Array.isArray(studentTripDataMatchLS)
        ? studentTripDataMatchLS.map((item: { id: string }) => item.id)
        : [];
      const tutorTypeDataMatch = dataMatch.find(
        (obj) => obj.id === 17
      )?.tutorType;
      const infoDataMatch = inputValue;

      // Создание заказа
      fetchCreateOrder(
        token,
        subjectDataMatch,
        goalDataMatch,
        classDataMatch,
        studentTypeDataMatch,
        studentYearsDataMatch,
        studentCourseDataMatch,
        studentUniversityDataMatch,
        internationalExamDataMatch,
        studyMethodsDataMatch,
        studyProgrammsDataMatch,
        deadlineDataMatch,
        studentLevelDataMatch,
        tutorGenderDataMatch,
        timetableDataMatch,
        studyPlaceDataMatch,
        studentAdressDataMatch,
        studentTripDataMatch,
        tutorTypeDataMatch,
        infoDataMatch
      )
        .then(() => {
          // Обновляем состояния для красивого эффекта перехода
          setIsDisabled(true);
          setIsVisible(false);
          setTimeout(() => route.push("/student/order"), 400);
        })
        .catch((error) => {
          console.error("Ошибка при создании заказа:", error);
        });
    };

    if (!student) {
      if (tutor) {
        dispatch(
          createStudent({ name: tutor.name, phone: tutor.phone, token })
        );
        //createOrder();
      } else {
        // ДОБАВИТЬ СОЗДАНИЕ ЗАКАЗА, ЕСЛИ ЕСТЬ СОТРУДНИК
        setTimeout(() => route.push("/r"), 400);
      }
    } else {
      createOrder();
    }
  };

  useEffect(() => {
    if (typeForm === "info" && token) {
      setIsAuth(true);
    }
  }, [typeForm, token]);

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
          {description && (
            <div className={styles.description}>{description}</div>
          )}
          <textarea
            id="stydentYears"
            placeholder={answerArray[0].title}
            autoComplete="off"
            value={inputValue}
            onChange={handleInputValue}
            className={clsx(styles.textaraeName, {
              [styles.errorInput]: errorInput,
            })}
            maxLength={500}
          ></textarea>
          {errorInput ? (
            <div className={styles.errorInputText}>
              Пожалуйста, введите наименование учебного заведения
            </div>
          ) : null}
        </div>
        <div className={styles.wrapButton}>
          {typeForm === "tutor-place" ? (
            <button
              type="button"
              onClick={() => handleNextStep(nextPageProperty, inputValue)}
              className={styles.continueButton}
              disabled={!inputValue || errorInput}
            >
              Продолжить
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                token && isAuth
                  ? handleNextStepIfTokenTrue(token, inputValue)
                  : handleNextStep(nextPageProperty, inputValue)
              }
              className={clsx(
                styles.continueButton,
                !inputValue && styles.continueButtonBlack
              )}
              disabled={errorInput}
            >
              {inputValue ? "Продолжить" : "Пропустить"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
