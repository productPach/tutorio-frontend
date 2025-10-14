"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "../../SignInTutor/SignInTutor.module.css";
import animation from "../../../../app/sign-in-tutor/layout.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import ReCaptcha from "@/components/reCapcha/reCapcha";
import { formatPhoneNumber } from "@/utils/phoneFormat/phoneFormat";
import Link from "next/link";
import { useSmsTimer } from "@/hooks/sms/useSmsTimer";
import { fetchExistUser } from "@/api/server/userApi";
import { fetchExistStudent } from "@/api/server/studentApi";

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

export const PhoneInputForms: React.FC<ComponentRenderProps> = ({
  id,
  typeForm,
  question,
  description,
  placeholder,
  nextPage,
}) => {
  const route = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [to, setTo] = useState("");
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

  // useEffect(() => {
  //   if (to) {
  //     localStorage.setItem("origin-phone", JSON.stringify(to));
  //   }
  // }, [to]);

  const handleVerify = (token: string | null) => setVerified(!!token);

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setInputValue(formattedPhoneNumber.formatted);
    setErrorInput(false);
    setTo(formattedPhoneNumber.original);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Достаём данные из localStorage ОДИН раз
  const [dataUser, setDataUser] = useState<Order[]>([]);
  const [originPhone, setOriginPhone] = useState<string | null>(null);
  const containsClassProperty =
    dataUser && dataUser.some((obj) => obj.hasOwnProperty(typeForm));

  useEffect(() => {
    const getDataUserLS = localStorage.getItem("current-user");
    const parsedUser = getDataUserLS ? JSON.parse(getDataUserLS) : [];
    setDataUser(parsedUser);

    const getOriginPhone = localStorage.getItem("origin-phone");
    setOriginPhone(getOriginPhone ? JSON.parse(getOriginPhone) : null);
  }, []);

  useEffect(() => {
    const currentDataUser = dataUser && dataUser.find((obj) => obj.id === id);
    const valueProperty = currentDataUser ? currentDataUser[typeForm] : "";
    const valuePropertyOrigin = originPhone ? originPhone : "";
    setInputValue(valueProperty);
    setTo(valuePropertyOrigin);
  }, [typeForm, dataUser, id, originPhone]);

  const handleNextStep = useCallback(
    (link: string, inputValue: string, originValue: string) => {
      setIsDisabled(true);
      setIsVisible(false);

      // Кладем в LS оригинальный номер телефона без форматирования
      localStorage.setItem("origin-phone", JSON.stringify(originValue));

      const newData = { id: id, [typeForm]: inputValue };

      if (containsClassProperty) {
        const indexOfArray = dataUser.findIndex((obj) =>
          obj.hasOwnProperty(typeForm)
        );
        const filterDataUser = dataUser.filter(
          (obj, index) => index < indexOfArray
        );
        const dataToSave = [...filterDataUser, newData];
        localStorage.setItem("current-user", JSON.stringify(dataToSave));
      } else {
        localStorage.setItem("current-user", JSON.stringify([newData]));
      }

      setTimeout(() => route.push(link), 400);
    },
    [route, typeForm, dataUser, containsClassProperty, id]
  );

  const handlePrevStep = () => {
    setIsDisabled(true);
    setIsVisible(false);
    setTimeout(() => route.back(), 400);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setIsShowTimer(true);
  }, []);

  const onClickSms = async () => {
    // Проверяем есть ли такой ученик. Если нет, тогда не даем идти дальше
    const existUser = await fetchExistStudent(to);
    if (existUser) {
      setErrorInput(true);
      return;
    }
    setIsShowTimer(false);
    await sendSms();
    handleNextStep(nextPage, inputValue, to);
  };

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
            placeholder={placeholder}
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
        {errorInput && (
          <div className={styles.errorInputText}>
            Ой! Кажется, ученика с таким номером не существует 🤔 <br></br>
            Проверьте ещё раз — вдруг закралась опечатка! ✨
          </div>
        )}
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
          className={styles.continueButton}
          disabled={
            inputValue.length < 15 || errorInput || !verified || isTimerActive
          }
        >
          Продолжить
        </button>
        <div className={styles.policyPrivacyContainer}>
          Нажимая на кнопку ты соглашаешься с условиями{" "}
          <Link target="blank" href={"/docs/agreement"}>
            пользовательского соглашения
          </Link>
        </div>
      </div>
    </div>
  );
};
