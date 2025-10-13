"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { TimerSms } from "@/components/TimerSms/TimerSms";
import { fetchCreateOrder } from "@/api/server/orderApi";
import { Order, Role } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getToken } from "@/store/features/authSlice";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  createStudent,
  getCurrentStudent,
} from "@/store/features/studentSlice";
import { baseUrl } from "@/api/server/configApi";

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
  const loadingAuth = useAppSelector((state) => state.auth.loadingAuth);
  const regionUser = useAppSelector((state) => state.auth.regionUser);

  let region: string;
  regionUser ? (region = regionUser?.city) : (region = "Не определено");

  const [codes, setCodes] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Получаем данные формы из LocalStorage
  const getDataMatchLS = localStorage.getItem("currentMatch");
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

  const phoneDataMatch = dataMatch.find((obj) => obj.id == "20");
  const phoneValue = phoneDataMatch ? phoneDataMatch.phone : "";

  // const jsonPhone = localStorage.getItem("origin-phone");
  // const phone = jsonPhone ? JSON.parse(jsonPhone) : "";

  // Убираем все нецифровые символы
  const phoneClear = phoneValue.replace(/\D/g, "");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Фокус на активный инпут
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);
      if (value && index < 3) setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (index > 0 && !codes[index]) {
        setActiveIndex(index - 1);
        setErrorInput(false);
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        setCodes(newCodes);
      } else {
        const newCodes = [...codes];
        newCodes[index] = "";
        setCodes(newCodes);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleNextStep = useCallback(
    (link: string) => {
      setIsDisabled(true);
      setIsVisible(false);
      setTimeout(() => route.push(link), 400);
    },
    [route]
  );

  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    setTimeout(() => route.back(), 400);
  };

  // Проверка кода на сервере
  const handleVerifyCode = useCallback(
    async (code: string) => {
      try {
        if (!phoneClear) {
          console.warn("Телефон не найден в localStorage");
          setErrorInput(true);
          return;
        }

        const response = await fetch(`${baseUrl}sms/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneClear, code }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setErrorInput(false);
          setIsSuccess(true);
          await handleGetToken(code);
        } else {
          setErrorInput(true);
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Ошибка проверки кода:", err);
        setErrorInput(true);
        setIsSuccess(false);
      }
    },
    [phoneClear]
  );

  useEffect(() => {
    const inputValue = codes.join("");
    if (inputValue.length === 4) {
      handleVerifyCode(inputValue);
    }
  }, [codes]);

  // Авторизация студента и создание при необходимости
  const handleGetToken = async (secretCode: string) => {
    try {
      if (!phoneClear) return;
      const role: Role = "student";

      const token = await dispatch(
        getToken({ phone: phoneClear, secretCode, role })
      ).unwrap();
      if (!token) {
        setErrorInput(true);
        return;
      }

      setIsSuccess(true);
      setErrorInput(false);

      try {
        await dispatch(getCurrentStudent()).unwrap();
      } catch {
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
        if (!fioValue) return;

        await dispatch(
          createStudent({
            name: fioValue,
            phone: phoneClear,
            avatarUrl: randomAvatar,
            region,
          })
        ).unwrap();

        await dispatch(getCurrentStudent()).unwrap();
      }

      // Создание заказа
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
            .map((el) =>
              typeof el === "object" && el !== null && "id" in el
                ? (el as any).id
                : null
            )
            .filter((id): id is string => typeof id === "string");
        }

        const tutorType = dataMatch.find((obj) => obj.id == "17")?.tutorType;
        let tutorTypeDataMatch;
        if (tutorType === "Начинающий: до\u00A01000\u00A0₽")
          tutorTypeDataMatch = "1";
        if (tutorType === "Репетитор со средним опытом: до\u00A01500\u00A0₽")
          tutorTypeDataMatch = "2";
        if (tutorType === "Опытный репетитор: до\u00A02500\u00A0₽")
          tutorTypeDataMatch = "3";

        const autoContactsString = dataMatch.find(
          (obj) => obj.id == "22"
        )?.autoContacts;
        const autoContactsBoolean =
          autoContactsString === "Да, показывать контакты";
        const infoDataMatch = dataMatch.find((obj) => obj.id == "18")?.info;

        const orderData = await fetchCreateOrder(
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

        handleNextStep(answerArray[0].nextPage + orderData.id);
      } catch (error) {
        console.error("Ошибка при создании заказа:", error);
      }
    } catch (error) {
      console.warn("Ошибка handleGetToken:", error);
      setErrorInput(true);
    }
  };

  const nextPageProperty = answerArray[0].nextPage;

  return (
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
              autoComplete={index === 0 ? "one-time-code" : "off"}
              placeholder="•"
              value={value}
              maxLength={1}
              // ref={(el) => (inputRefs.current[index] = el)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onKeyPress={(e) => handleKeyPress(e)}
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
  );
};
