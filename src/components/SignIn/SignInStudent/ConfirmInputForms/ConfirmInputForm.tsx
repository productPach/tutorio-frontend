"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../SignInTutor/SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { TimerSms } from "@/components/TimerSms/TimerSms";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getToken } from "@/store/features/authSlice";
import {
  createTutor,
  getCurrentTutor,
  resetDeleteRequest,
  updateTutor,
} from "@/store/features/tutorSlice";
import { Role } from "@/types/types";
import { baseUrl } from "@/api/server/configApi";
import {
  getCurrentStudent,
  updateStudent,
} from "@/store/features/studentSlice";
import { fetchCancelDeleteRequest } from "@/api/server/userApi";

interface ComponentRenderProps {
  id: number;
  typeForm: string;
  question: string;
  description: string;
  placeholder: string;
  nextPage: string;
}

type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  [key: string]: any;
};

export const ConfirmInputForm: React.FC<ComponentRenderProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
}) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const loadingAuth = useAppSelector((state) => state.auth.loadingAuth);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

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
  const getDataUserLS = localStorage.getItem("current-user");
  const dataUser: Order[] = getDataUserLS ? JSON.parse(getDataUserLS) : [];

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

  useEffect(() => setIsVisible(true), []);

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

  const phoneDataUser = dataUser.find((obj) => obj.id === 1);
  const phoneValue = phoneDataUser ? phoneDataUser.phone : "";

  // Серверная проверка кода
  const handleVerifyCode = useCallback(async (code: string) => {
    try {
      const jsonPhone = localStorage.getItem("origin-phone");
      const phone = jsonPhone ? JSON.parse(jsonPhone) : "";
      if (!phone) return;

      const response = await fetch(`${baseUrl}sms/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setErrorInput(false);
        handleGetToken(code);
      } else {
        setErrorInput(true);
      }
    } catch (err) {
      console.error("Ошибка проверки кода:", err);
      setErrorInput(true);
    }
  }, []);

  // Вызываем проверку кода после ввода 4 цифр
  useEffect(() => {
    const inputValue = codes.join("");
    if (inputValue.length === 4) {
      handleVerifyCode(inputValue);
    }
  }, [codes, handleVerifyCode]);

  // Авторизация пользователя
  // НОВАЯ ВЕРСИЯ ОТ 25.01.2025
  const handleGetToken = async (secretCode: string) => {
    try {
      const jsonPhone = localStorage.getItem("origin-phone");
      const phone = jsonPhone ? JSON.parse(jsonPhone) : "";
      const role: Role = "student";

      if (phone) {
        // Получаем токен с обработкой ошибок
        const token = await dispatch(
          getToken({ phone, secretCode, role })
        ).unwrap();

        if (token) {
          setIsSuccess(true);
          setErrorInput(false);
          try {
            // Пытаемся получить данные ученика
            await dispatch(getCurrentStudent()).unwrap();
          } catch {
            // Если ученик не существует, создаем нового
            console.log("Такого пользователя нет");
          } finally {
            // Повторно получаем статус ученика после создания
            const updatedStudent = await dispatch(getCurrentStudent()).unwrap();

            switch (updatedStudent?.status) {
              case "Rega: Order":
                handleNextStep("../student/orders");
                break;
              case "Pending":
              case "Active":
              case "Canceled delete":
                handleNextStep("../student/orders");
                break;
              case "Deleted":
                dispatch(
                  updateStudent({
                    id: updatedStudent?.id,
                    status: "Canceled delete",
                  })
                );
                fetchCancelDeleteRequest({ role: "student" });
                dispatch(resetDeleteRequest());
                handleNextStep("../student/orders");
                break;
              default:
                console.warn("Неизвестный статус ученика");
            }
          }
        } else {
          setErrorInput(true);
        }
      }
    } catch (error) {
      if (!isLoggedIn) {
        setErrorInput(true); // Если ошибка 400 — неверные данные
      } else {
        console.warn("Ошибка получения токена:", error);
      }
    }
  };

  return (
    <div
      className={`${styles.container} ${isVisible ? animation.visible : animation.hidden}`}
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
          {description} <span className={styles.wsNoWrap}>+7{phoneValue}</span>
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
              placeholder="•"
              value={value}
              maxLength={1}
              // ref={(el) => (inputRefs.current[index] = el)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              // onKeyPress={(e) => handleKeyPress(e, index)}
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
          onClick={() => handleNextStep(nextPage)}
          className={styles.continueButton}
          disabled={codes.join("").length < 4 || !isSuccess || loadingAuth}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};
