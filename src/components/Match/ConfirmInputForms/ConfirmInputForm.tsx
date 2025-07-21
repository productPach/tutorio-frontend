"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { TimerSms } from "@/components/TimerSms/TimerSms";
import { fetchCreateOrder } from "@/api/server/orderApi";
import { Order } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getToken } from "@/store/features/authSlice";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  createStudent,
  getCurrentStudent,
} from "@/store/features/studentSlice";

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

export const ConfirmInputForm: React.FC<ComponentRenderProps> = ({
  id,
  question,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  // Получаем значение loadingAuth из Redux
  const loadingAuth = useAppSelector((state) => state.auth.loadingAuth);
  // Получаем значение regionUser из Redux
  const regionUser = useAppSelector((state) => state.auth.regionUser);

  let region: string;
  regionUser && (region = regionUser?.city);

  // Состояние текстового поля
  const [inputValue, setInputValue] = useState("");
  // Состояние текстового поля с логическим выражением
  const [isSuccess, setIsSuccess] = useState(false);
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  //console.log(errorInput);

  // Состояние для содержимого инпутов
  const [codes, setCodes] = useState(["", "", "", ""]);
  // Состояние для активного инпута (нужно, чтобы отслеживать какой инпут должен быть в фокусе, при этом остальные дизейблим)
  const [activeIndex, setActiveIndex] = useState(0);
  // Ссылки на инпуты
  const inputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  // Авторизация пользователя
  const handleGetToken = async (secretCode: string) => {
    try {
      const jsonPhone = localStorage.getItem("origin-phone");
      const phone = jsonPhone ? JSON.parse(jsonPhone) : "";
      if (!phone) {
        console.warn("Телефон не найден в localStorage");
        setErrorInput(true);
        return;
      }

      // Получаем токен
      const token = await dispatch(getToken({ phone, secretCode })).unwrap();
      setErrorInput(false);

      if (!token) {
        setErrorInput(true);
        return;
      }

      setIsSuccess(true);

      try {
        // Пробуем получить студента
        await dispatch(getCurrentStudent(token)).unwrap();
      } catch (error) {
        // Массив аватарок для случайного выбора
        const avatars = [
          "/img/icon/student/avatar/animal1.svg",
          "/img/icon/student/avatar/animal2.svg",
          "/img/icon/student/avatar/animal3.svg",
          "/img/icon/student/avatar/animal4.svg",
          "/img/icon/student/avatar/animal5.svg",
          "/img/icon/student/avatar/animal6.svg",
          "/img/icon/student/avatar/animal7.svg",
        ];
        const randomAvatar =
          avatars[Math.floor(Math.random() * avatars.length)];

        const fioDataMatch = dataMatch.find((obj) => obj.id == "19");
        const fioValue = fioDataMatch ? fioDataMatch.fio : "";

        if (!fioValue) {
          return;
        }

        await dispatch(
          createStudent({
            name: fioValue,
            phone,
            avatarUrl: randomAvatar,
            region: region,
            token,
          })
        ).unwrap();

        // После создания снова пробуем получить студента
        await dispatch(getCurrentStudent(token)).unwrap();
      }

      // После получения студента — создаём заказ
      try {
        const subjectDataMatch = dataMatch.find(
          (obj) => obj.id == "0"
        )?.subject;
        const goalDataMatch = dataMatch.find((obj) => obj.id == "1")?.goal;
        const classDataMatch = dataMatch.find((obj) => obj.id == "2")?.class;
        const studentTypeDataMatch = dataMatch.find(
          (obj) => obj.id == "3"
        )?.studentType;
        const studentCourseDataMatch = dataMatch.find(
          (obj) => obj.id == "4"
        )?.studentCourse;
        const deadlineDataMatch = dataMatch.find(
          (obj) => obj.id == "5"
        )?.deadline;
        const studentLevelDataMatch = dataMatch.find(
          (obj) => obj.id == "6"
        )?.studentLevel;
        const studentYearsDataMatch = dataMatch.find(
          (obj) => obj.id == "7"
        )?.studentYears;
        const tutorGenderDataMatch = dataMatch.find(
          (obj) => obj.id == "8"
        )?.tutorGender;
        const studentUniversityDataMatch = dataMatch.find(
          (obj) => obj.id == "9"
        )?.studentUniversity;
        const internationalExamDataMatch = dataMatch.find(
          (obj) => obj.id == "10"
        )?.internationalExam;
        const studyMethodsDataMatch = dataMatch.find(
          (obj) => obj.id == "11"
        )?.studyMethods;
        const studyProgrammsDataMatch = dataMatch.find(
          (obj) => obj.id == "12"
        )?.studyProgramms;
        const timetableDataMatch = dataMatch.find(
          (obj) => obj.id == "13"
        )?.timetable;
        const studyPlaceDataMatch = dataMatch.find(
          (obj) => obj.id == "14"
        )?.studyPlace;
        const studentAdressDataMatch = dataMatch.find(
          (obj) => obj.id == "15"
        )?.studentAdress;

        const studentTripRaw = dataMatch.find(
          (obj) => obj.id == "16"
        )?.studentTrip;
        let studentTripDataMatch: string[] = [];

        if (Array.isArray(studentTripRaw)) {
          studentTripDataMatch = studentTripRaw
            .filter((el) => typeof el === "object" && el !== null && "id" in el)
            .map((el) => (el as { id: string }).id);
        }
        const tutorType = dataMatch.find((obj) => obj.id == "17")?.tutorType;
        let tutorTypeDataMatch;
        if (tutorType === "Начинающий: до\u00A01000\u00A0₽") {
          tutorTypeDataMatch = "1";
        }
        if (tutorType === "Репетитор со средним опытом: до\u00A01500\u00A0₽") {
          tutorTypeDataMatch = "2";
        }
        if (tutorType === "Опытный репетитор: до\u00A02500\u00A0₽") {
          tutorTypeDataMatch = "3";
        }

        const autoContactsString = dataMatch.find(
          (obj) => obj.id == "22"
        )?.autoContacts;
        const autoContactsBoolean =
          autoContactsString === "Да, показывать контакты";

        const infoDataMatch = dataMatch.find((obj) => obj.id == "18")?.info;

        const orderData = await fetchCreateOrder(
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
          region,
          studyPlaceDataMatch,
          studentAdressDataMatch,
          studentTripDataMatch,
          tutorTypeDataMatch,
          autoContactsBoolean,
          infoDataMatch
        );

        // Переход на следующий шаг с ID заказа
        handleNextStep(nextPageProperty + orderData.id);
      } catch (error) {
        console.error("Ошибка при создании заказа:", error);
      }
    } catch (error) {
      console.warn("Ошибка в handleGetToken:", error);
      setErrorInput(true);
    }
  };

  // Обновляем inputValue когда меняется содержимое отдельных инпутов
  useEffect(() => {
    const inputValue = codes.join("");
    if (inputValue.length === 4) {
      setIsSuccess(false);
      handleGetToken(inputValue);
    }
  }, [codes]);

  // Функция добавления значения в инпут
  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && index < 3) {
        setActiveIndex(index + 1);
      }
    }
  };

  //console.log(inputValue);

  // Функция удаления значения из инпута
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      // Если текущий инпут пустой и не является первым инпутом, то
      // переходим на предыдущий инпут и очищаем его содержимое
      if (index > 0 && !codes[index]) {
        setActiveIndex(index - 1);
        setErrorInput(false);
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        setCodes(newCodes);
      } else if (index === 0 && !codes[index]) {
        // Если текущий инпут первый и пустой, просто очищаем его содержимое
        const newCodes = [...codes];
        newCodes[index] = "";
        setCodes(newCodes);
      }
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Обновляем фокус на следующий инпут при изменении активного инпута
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataMatch.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  // Функция для перехода на следующий шаг
  const handleNextStep = useCallback(
    (link: string) => {
      // Обновляем состояния для красивого эффекта перехода
      setIsDisabled(true);
      setIsVisible(false);
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

  // Находим объект массива с введенным телефоном
  const phoneDataMatch = dataMatch.find((obj) => obj.id === "20");
  // Вытаскиваем значение данного объека из свойства phone
  const phoneValue = phoneDataMatch ? phoneDataMatch.phone : "";

  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  useEffect(() => {
    // Находим объект массива по ID вопроса (формы)
    const currentDataMatch = dataMatch.find((obj) => obj.id === String(id));
    // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    setInputValue(valueProperty);
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
          <div className={styles.description}>
            {answerArray[0].title} +7{phoneValue}
          </div>

          <form
            autoComplete="one-time-code"
            className={styles.inputCodeConfirmContainer}
          >
            {codes.map((value, index) => (
              <input
                key={index}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={index === 0 ? "one-time-code" : "off"} // ✅ Только первый
                placeholder="•"
                value={value}
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                className={clsx(
                  styles.inputCodeConfirm,
                  errorInput ? styles.errorInput : ""
                )}
                disabled={index !== activeIndex}
              />
            ))}
          </form>
          <TimerSms />
        </div>
        <div className={styles.wrapButton}>
          <button
            type="button"
            onClick={() => handleNextStep(nextPageProperty)}
            className={styles.continueButton}
            disabled={codes.join("").length < 4 || !isSuccess || loadingAuth}
          >
            Продолжить
            {loadingAuth && (
              <div className={styles.spinner}>
                <Spinner />
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
