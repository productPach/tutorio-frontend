"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { TimerSms } from "@/components/TimerSms/TimerSms";
import { fetchGetToken } from "@/api/server/userApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getToken } from "@/store/features/authSlice";
import { createTutor, getCurrentTutor } from "@/store/features/tutorSlice";

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
  // Получаем значение loadingAuth из Redux
  const loadingAuth = useAppSelector((state) => state.auth.loadingAuth);
  // Получаем значение regionUser из Redux
  const regionUser = useAppSelector((state) => state.match.regionUser);

  // ПЕРЕДЕЛАТЬ!!!
  // Нужно вытаскивать код подтверждения в БД
  // Временно вытаскиваем код из LocalStorage
  const confirmCodeLS = localStorage.getItem("confirm-code");
  const confirmCode: string = confirmCodeLS && JSON.parse(confirmCodeLS);
  //console.log(confirmCode);

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

  // Авторизация пользователя
  // const getToken = async (secretCode: string) => {
  //   try {
  //     const jsonPhone = localStorage.getItem("origin-phone");
  //     const phone = jsonPhone ? JSON.parse(jsonPhone) : "";
  //     if (phone) {
  //       const data = await fetchGetToken({ phone, secretCode });
  //       console.log(phone);
  //       console.log(data.token);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleGetToken = async (secretCode: string) => {
    try {
      const jsonPhone = localStorage.getItem("origin-phone");
      const phone = jsonPhone ? JSON.parse(jsonPhone) : "";
      if (phone) {
        const token = await dispatch(getToken({ phone, secretCode })).unwrap();
        setErrorInput(false);
        if (token) {
          setIsSuccess(true);
          await dispatch(getCurrentTutor(token))
            .unwrap()
            .catch(async () => {
              // Репетитора не существет, создаем нового
              await dispatch(
                createTutor({
                  phone: phone,
                  token,
                })
              );
            })
            .finally(async () => {
              // Повторно получаем статус репетитора после создания
              const updatedTutor = await dispatch(
                getCurrentTutor(token)
              ).unwrap();
              if (updatedTutor?.status === "Rega: Fullname") {
                handleNextStep("fio");
              }
              if (updatedTutor?.status === "Rega: Subjects") {
                handleNextStep("subjects");
              }
              if (updatedTutor?.status === "Rega: Locations") {
                handleNextStep("locations");
              }
              if (updatedTutor?.status === "Rega: Photo") {
                handleNextStep("photo");
              }
            });
        } else {
          setErrorInput(true);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // Обновляем inputValue когда меняется содержимое отдельных инпутов
  useEffect(() => {
    const inputValue = codes.join("");
    if (inputValue.length === 4) {
      if (inputValue !== confirmCode) {
        setErrorInput(true);
        console.log("Invalid code");
      } else {
        setErrorInput(false);
        handleGetToken(inputValue);
      }
    }
  }, [codes, confirmCode]);

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

  // Вытаскиваем актуальный массив c данными формы из LocalStorage
  const getDataUserLS = localStorage.getItem("current-user");
  // Конвертируем массив c данными формы из JSON в JS объект
  const dataUser: Order[] = getDataUserLS ? JSON.parse(getDataUserLS) : [];

  // Получаем логическое значение "Содержится ли в массиве из LS свойство с typeForm текущей формы?"
  const containsClassProperty = dataUser.some((obj) =>
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
  const phoneDataUser = dataUser.find((obj) => obj.id === 1);
  // Вытаскиваем значение данного объека из свойства phone
  const phoneValue = phoneDataUser ? phoneDataUser.phone : "";

  useEffect(() => {
    setIsVisible(true);
  }, []); // Анимация будет стартовать после монтирования компонента

  useEffect(() => {
    // Находим объект массива по ID вопроса (формы)
    const currentDataUser = dataUser.find((obj) => obj.id === id);
    // Вытаскиваем значение данного объека из свойства, которое совпадает с typeForm (чтобы сделать checked выбранный ранее вариант ответа)
    const valueProperty = currentDataUser ? currentDataUser[typeForm] : "";
    setInputValue(valueProperty);
  }, [typeForm]);

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
            {description} +7{phoneValue}
          </div>

          <div className={styles.inputCodeConfirmContainer}>
            {codes.map((value, index) => (
              <input
                key={index}
                type="text"
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
          </div>
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
    </>
  );
};
