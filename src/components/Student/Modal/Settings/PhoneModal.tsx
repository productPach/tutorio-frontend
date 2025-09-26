"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../../../Tutor/Modal/Profil/Fio/Fio.module.css";
import componentStyles from "../../../Tutor/Modal/Settings/Settings.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getCurrentTutor } from "@/store/features/tutorSlice";
import { setIsModalPhone, setScrollY } from "@/store/features/modalSlice";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import {
  getToken,
  setStatusUpdateUser,
  updatePhoneUser,
} from "@/store/features/authSlice";
import { securePinGenerator } from "@/utils/securePinGenerator/securePinGenerator";
import { userExistence } from "@/utils/match/performActionBasedOnUserExistence/performActionBasedOnUserExistence";
import { sendSms } from "@/utils/sensSms/sendSms";
import { TimerSms } from "@/components/TimerSms/TimerSms";
import { Spinner } from "@/components/Spinner/Spinner";
import { getCurrentStudent } from "@/store/features/studentSlice";
import { Role } from "@/types/types";

export const PhoneModal = () => {
  const dispatch = useAppDispatch();
  // Получаем значение tutor из Redux
  const student = useAppSelector((state) => state.student.student);
  // Получаем значение updateUser из Redux
  const updateUser = useAppSelector((state) => state.auth.updateUser);
  // Получаем значение statusUpdateUser из Redux
  const statusUpdateUser = useAppSelector(
    (state) => state.auth.statusUpdateUser
  );
  // Состояние для лоадера в кнопке продолжить при переходе на форму ввода кода из смс
  const [loadingFormSms, setLoadingFormSms] = useState(false);
  // Стейт для знаения инпута с суммой пополнения
  const [inputValue, setInputValue] = useState("");
  // Стейт для ошибки
  const [error, setError] = useState(false);
  // Состояние для показа формы ввода кода из СМС
  const [isSmsForm, setIsSmsForm] = useState(false);
  // Состояние для лоадера
  const [isLoading, setIsLoading] = useState(false);
  const initialTimeLS = localStorage.getItem("confirm-time"); // Начальное количество минут
  const initialTime = initialTimeLS
    ? JSON.parse(initialTimeLS)
    : { minutes: 0, seconds: 0, index: 0 };

  const [minutes, setMinutes] = useState(initialTime.minutes); // Состояние для отображения минут
  const [seconds, setSeconds] = useState(initialTime.seconds); // Состояние для отображения секунд
  const [index, setIndex] = useState(initialTime.index); // Состояние для количества попыток повторной отправки
  // Состояние для таймера
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Функция для добавления ведущих нулей к числам меньше 10
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
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

  // Добавляем в состояние неформатированный номер телефона
  const [to, setTo] = useState("");
  // Функция ввода и форматирования номера телефона в поле инпута
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setInputValue(formattedPhoneNumber.formatted);
    setTo(formattedPhoneNumber.original);
  };
  // Состояние для ошибки текстового поля
  const [errorInput, setErrorInput] = useState(false);

  // Состояние для фиксации фокусирования на поле с вводом телефона
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Отправляем SMS
  const onClickSms = async () => {
    setIsTimerActive(true);
    try {
      setLoadingFormSms(true);
      // Генерируем проверочный код
      const confirmCode = securePinGenerator();
      // Проверяем есть ли пользователь с таким номером: если есть, выводим ошибку, если нет - меняем код
      if (student?.phone) {
        const existUser = await userExistence(to, student.phone, confirmCode);

        if (!existUser) {
          //console.log("Номер телефона уже занят");
          setError(true);
          setLoadingFormSms(false);
          return;
        }
      }

      setIsLoading(true); // Включаем лоадер
      // Временно добавляем код в LocalStorage
      localStorage.setItem("confirm-code", JSON.stringify(confirmCode));
      sendSms(to, confirmCode);

      if (index === 0) {
        setMinutes(0);
        setSeconds(59);
        setIndex(1);
      }
      if (index === 1) {
        setMinutes(1);
        setSeconds(59);
        setIndex(2);
      }
      if (index === 2) {
        setMinutes(4);
        setSeconds(59);
        setIndex(3);
      }
      if (index >= 3) {
        setMinutes(14);
        setSeconds(59);
        setIndex(4);
      }
      if (index >= 4) {
        setMinutes(29);
        setSeconds(59);
      }
      const confirmTime = {
        minutes,
        seconds,
        index,
      };
      localStorage.setItem("confirm-time", JSON.stringify(confirmTime));
      setLoadingFormSms(false);
      setIsSmsForm(true);
    } catch (error) {
      console.error("Произошла ошибка, попробуйте позже: ", error);
    }
  };

  // Состояние текстового поля с логическим выражением
  const [isSuccess, setIsSuccess] = useState(false);
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

  // Обновляем inputValue когда меняется содержимое отдельных инпутов
  useEffect(() => {
    const inputValueCode = codes.join("");
    if (inputValueCode.length === 4) {
      setIsSuccess(false);
      update(inputValueCode);
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

  const update = async (secretCode: string) => {
    const id = student?.id;
    const userId = student?.userId;
    const phone = to;
    const oldPhone = student?.phone;
    const status = student?.status;
    const role: Role = "student";

    if (id && userId && oldPhone && status) {
      try {
        const token = await dispatch(
          getToken({ phone: oldPhone, secretCode, role })
        ).unwrap();
        setErrorInput(false);
        setError(true);
        if (token) {
          const updatePhone = await dispatch(
            updatePhoneUser({ id: userId, phone, secretCode })
          ).unwrap();

          if (updatePhone) {
            dispatch(getCurrentStudent());
          }
        } else {
          setErrorInput(true);
        }
      } catch (error) {
        setError(true); // Показываем ошибку пользователю
      }
    }
  };

  const close = () => {
    dispatch(setIsModalPhone(false));
    dispatch(setScrollY(0));
    dispatch(setStatusUpdateUser(false));
  };

  return (
    <>
      {!isSmsForm && !statusUpdateUser && (
        <div>
          <div className={styles.description}>
            На указанный номер придёт проверочный код для подтверждения
          </div>
          <div className={styles.inputContainer}>
            <span
              className={clsx(componentStyles.inputPhoneNumberPrefix, {
                [componentStyles.visible]: isFocused || inputValue.length > 0,
              })}
            >
              +7
            </span>
            <input
              id="studentPhoneNumber"
              type="tel"
              placeholder="Введите номер телефона"
              autoComplete="off"
              value={inputValue}
              onChange={handleInputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={clsx(componentStyles.inputPhoneNumber, {
                [componentStyles.focused]: isFocused || inputValue.length > 0,
                [componentStyles.errorInput]: errorInput,
              })}
              maxLength={15}
            />
          </div>
          <div
            className={clsx(
              componentStyles.sendAgainContainer,
              isTimerActive && (minutes !== 0 || seconds !== 0)
                ? ""
                : componentStyles.sendAgainActive
            )}
          >
            {isTimerActive &&
              (minutes !== 0 || seconds !== 0) &&
              `Изменить телефон можно через ${formatTime(minutes)}:
            ${formatTime(seconds)}`}
          </div>
          {error && (
            <span>
              🤔 Ммм... этот номер не сработает. Давайте попробуем другой!
            </span>
          )}
          <div className={styles.button}>
            <button
              onClick={onClickSms}
              type="button"
              disabled={
                inputValue.length < 15 ||
                errorInput ||
                minutes !== 0 ||
                seconds !== 0 ||
                loadingFormSms
              }
            >
              Изменить
              {loadingFormSms && (
                <div className={componentStyles.spinner}>
                  <Spinner />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {isSmsForm && !statusUpdateUser && (
        <div>
          <div className={styles.description}>
            Отправили код на номер +7 {inputValue}
          </div>
          <div className={styles.inputContainer}>
            <div className={componentStyles.inputCodeConfirmContainer}>
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
                    componentStyles.inputCodeConfirm,
                    errorInput ? componentStyles.errorInput : ""
                  )}
                  disabled={index !== activeIndex}
                />
              ))}
            </div>
          </div>

          <div
            className={clsx(
              componentStyles.sendAgainContainer,
              isTimerActive && (minutes !== 0 || seconds !== 0)
                ? ""
                : componentStyles.sendAgainActive
            )}
          >
            {isTimerActive && (minutes !== 0 || seconds !== 0) ? (
              `Отправить код ещё раз через ${formatTime(minutes)}:
            ${formatTime(seconds)}`
            ) : (
              <span onClick={onClickSms}>Отправить код ещё раз</span>
            )}
          </div>

          <div className={styles.button}>
            <button
              onClick={onClickSms}
              type="button"
              disabled={codes.join("").length < 4 || !isSuccess || updateUser}
            >
              Изменить
              {updateUser && (
                <div className={componentStyles.spinner}>
                  <Spinner />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {statusUpdateUser && (
        <div>
          <div className={styles.description}>
            Номер телефона изменён на +7 {inputValue} <br></br>Всё прошло
            успешно ✅
          </div>

          <div className={styles.button}>
            <button onClick={close} type="button">
              Отлично
            </button>
          </div>
        </div>
      )}
    </>
  );
};
