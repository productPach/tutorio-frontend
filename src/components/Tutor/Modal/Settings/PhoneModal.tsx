"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import clsx from "clsx";
import styles from "../Profil/Fio/Fio.module.css";
import componentStyles from "./Settings.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getCurrentTutor } from "@/store/features/tutorSlice";
import {
  setIsModalPhone,
  setIsSheetPhone,
  setScrollY,
} from "@/store/features/modalSlice";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import { useSmsTimer } from "@/hooks/sms/useSmsTimer";
import { Spinner } from "@/components/Spinner/Spinner";
import { fetchExistUser } from "@/api/server/userApi";
import { baseUrl } from "@/api/server/configApi";
import httpClient from "@/api/server/httpClient";

export const PhoneModal = () => {
  const dispatch = useAppDispatch();
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const statusUpdateUser = useAppSelector(
    (state) => state.auth.statusUpdateUser
  );

  const [inputValue, setInputValue] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [isSmsForm, setIsSmsForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [codes, setCodes] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingFormSms, setLoadingFormSms] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // === Хук таймера ===
  const {
    sendSms,
    isActive,
    secondsLeft,
    loading: smsLoading,
  } = useSmsTimer(to);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return `${pad(minutes)}:${pad(sec)}`;
  };

  // === Ввод телефона ===
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const formatted = formatPhoneNumber(e.target.value);
    setInputValue(formatted.formatted);
    setTo(formatted.original);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // === Отправляем SMS ===
  const onClickSms = async () => {
    if (!to) return;
    try {
      // === Проверяем существует ли пользователь с этим номером ===
      const phoneAvailable = await fetchExistUser(to);
      if (!phoneAvailable) {
        setError(true); // номер уже занят
        setLoadingFormSms(false);
        return;
      }

      setLoadingFormSms(true);
      await sendSms();
      setIsSmsForm(true);
    } catch (err) {
      console.error("Ошибка при отправке SMS:", err);
      setError(true);
    } finally {
      setLoadingFormSms(false);
    }
  };

  // === Обработка кода ===
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
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        setCodes(newCodes);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  // === Отправляем код на сервер ===
  useEffect(() => {
    const code = codes.join("");
    if (code.length === 4) verifyCode(code);
  }, [codes]);

  const verifyCode = async (code: string) => {
    try {
      setVerifyLoading(true);
      const response = await httpClient.post("/sms/verify-update", {
        oldPhone: tutor?.phone,
        newPhone: to,
        code,
      });

      if (!response.data.success) {
        setErrorInput(true);
        return;
      }

      // Успех — обновляем профиль
      await dispatch(getCurrentTutor());
      setIsSuccess(true);
    } catch (err) {
      console.error("Ошибка при проверке кода:", err);
      setErrorInput(true);
    } finally {
      setVerifyLoading(false);
    }
  };

  const close = () => {
    dispatch(setIsModalPhone(false));
    dispatch(setIsSheetPhone(false));
    dispatch(setScrollY(0));
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
              isActive ? "" : componentStyles.sendAgainActive
            )}
          >
            {isActive
              ? `Изменить телефон можно через ${formatTime(secondsLeft)}`
              : ""}
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
                smsLoading ||
                loadingFormSms ||
                isActive
              }
            >
              Изменить
              {(smsLoading || loadingFormSms) && (
                <div className={componentStyles.spinner}>
                  <Spinner />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {isSmsForm && !isSuccess && (
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
                  onKeyPress={(e) => handleKeyPress(e)}
                  className={clsx(
                    componentStyles.inputCodeConfirm,
                    errorInput && componentStyles.errorInput
                  )}
                  disabled={index !== activeIndex}
                />
              ))}
            </div>
          </div>

          <div
            className={clsx(
              componentStyles.sendAgainContainer,
              isActive ? "" : componentStyles.sendAgainActive
            )}
          >
            {isActive ? (
              `Отправить код ещё раз через ${formatTime(secondsLeft)}`
            ) : (
              <span onClick={onClickSms}>Отправить код ещё раз</span>
            )}
          </div>

          <div className={styles.button}>
            <button
              onClick={() => verifyCode(codes.join(""))}
              type="button"
              disabled={
                codes.join("").length < 4 || verifyLoading || !isSuccess
              }
            >
              Подтвердить
              {verifyLoading && (
                <div className={componentStyles.spinner}>
                  <Spinner />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div>
          <div className={styles.description}>
            Номер телефона изменён на +7 {inputValue} <br /> Всё прошло успешно
            ✅
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
