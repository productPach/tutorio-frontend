"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../Match.module.css";
import animation from "../../../app/match/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import ReCaptcha from "@/components/reCapcha/reCapcha";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import { Spinner } from "@/components/Spinner/Spinner";
import Link from "next/link";
import { useSmsTimer } from "@/hooks/sms/useSmsTimer";
import { RegionalLink } from "@/components/RegionalLink/RegionalLink";

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

type Order = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  [key: string]: any;
};

export const PhoneInputForms: React.FC<ComponentRenderProps> = ({
  id,
  question,
  description,
  typeForm,
  answerArray,
}) => {
  const route = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [to, setTo] = useState("");
  const [errorNet, setErrorNet] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isShowTimer, setIsShowTimer] = useState(false);

  const {
    sendSms,
    isActive: isTimerActive,
    secondsLeft,
    loading,
  } = useSmsTimer(to);

  // Форматируем секунды в MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return `${pad(minutes)}:${pad(sec)}`;
  };

  // Достаем массив с данными заявки
  const getDataMatchLS = localStorage.getItem("currentMatch");
  const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];
  // Достаем оригинальный телефон
  const getOriginPhone = localStorage.getItem("origin-phone");
  const originPhone: string = getOriginPhone && JSON.parse(getOriginPhone);

  const containsClassProperty = dataMatch.some((obj) =>
    obj.hasOwnProperty(typeForm)
  );

  const handleVerify = (token: string | null) => setVerified(!!token);

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setInputValue(formattedPhoneNumber.formatted);
    setTo(formattedPhoneNumber.original);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleNextStep = useCallback(
    (link: string, inputValue: string, originValue: string) => {
      setIsDisabled(true);
      setIsVisible(false);

      // Кладем в LS оригинальный номер телефона без форматирования
      localStorage.setItem("origin-phone", JSON.stringify(originValue));

      const newData = {
        id: id,
        [typeForm]: inputValue,
      };

      if (containsClassProperty) {
        const indexOfArray = dataMatch.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );
        const filterDataMatch = dataMatch.filter(
          (obj, index) => index < indexOfArray
        );
        const dataToSave = [...filterDataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      } else {
        const dataToSave = [...dataMatch, newData];
        localStorage.setItem("currentMatch", JSON.stringify(dataToSave));
      }

      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm]
  );

  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    setTimeout(() => route.back(), 400);
  };

  useEffect(() => {
    setIsVisible(true);
    setIsShowTimer(true);
  }, []);

  useEffect(() => {
    const currentDataMatch = dataMatch.find((obj) => obj.id === id);
    const valueProperty = currentDataMatch ? currentDataMatch[typeForm] : "";
    const valuePropertyOrigin = originPhone ? originPhone : "";
    setInputValue(valueProperty);
    setTo(valuePropertyOrigin);
  }, [typeForm]);

  const nextPageProperty = answerArray[0].nextPage;

  const onClickSms = async () => {
    try {
      setErrorNet(false);
      setIsShowTimer(false);

      await sendSms();
      console.log(to);

      handleNextStep(nextPageProperty, inputValue, to);
    } catch (error) {
      console.error("Ошибка при отправке SMS:", error);
      setErrorNet(true);
    }
  };

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
          <div className={styles.description}>{description}</div>
          <div className={styles.inputContainer}>
            <span
              className={clsx(styles.inputPhoneNumberPrefix, {
                [styles.visible]: isFocused || inputValue.length > 0,
              })}
            >
              +7
            </span>
            <input
              id="studentPhoneNumber"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Введите номер телефона"
              autoComplete="off"
              value={inputValue}
              onChange={handleInputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={clsx(styles.inputPhoneNumber, {
                [styles.focused]: isFocused || inputValue.length > 0,
                [styles.errorInput]: errorInput,
              })}
              maxLength={15}
            />
          </div>
          {isShowTimer && secondsLeft > 0 ? (
            <div className={styles.sendAgainContainer}>
              Изменить телефон можно через{" "}
              <span className={styles.wsNoWrap}>{formatTime(secondsLeft)}</span>
            </div>
          ) : (
            <div className={styles.reCaptchaContainer}>
              <ReCaptcha onVerify={handleVerify} />
            </div>
          )}
        </div>
        <div className={clsx(styles.wrapButton, styles.forWrap)}>
          <button
            type="button"
            onClick={onClickSms}
            className={clsx(styles.continueButton, styles.positionInit)}
            disabled={
              inputValue.length < 15 || errorInput || !verified || isTimerActive
            }
          >
            Продолжить
            {loading && (
              <div className={styles.spinner}>
                <Spinner />
              </div>
            )}
          </button>
          <div className={styles.policyPrivacyContainer}>
            Нажимая на кнопку ты соглашаешься с условиями{" "}
            <RegionalLink target="blank" href="/docs/agreement">
              пользовательского соглашения
            </RegionalLink>
          </div>
        </div>
      </div>
    </>
  );
};
