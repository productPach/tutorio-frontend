"use client";
import clsx from "clsx";
import styles from "../Match/Match.module.css";
import { useSmsTimer } from "@/hooks/sms/useSmsTimer";
import { Spinner } from "../Spinner/Spinner";

export const TimerSms = () => {
  // Достаем оригинальный телефон
  const getOriginPhone = localStorage.getItem("origin-phone");
  const originPhone: string = getOriginPhone ? JSON.parse(getOriginPhone) : "";

  const { sendSms, isActive, secondsLeft, loading } = useSmsTimer(originPhone);

  // Форматируем секунды в MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return `${pad(minutes)}:${pad(sec)}`;
  };

  return (
    <div
      className={clsx(
        styles.sendAgainContainer
        // isActive ? "" : styles.sendAgainActive
      )}
    >
      {loading ? (
        <div className={styles.sendingLoader}>
          <span>Отправляем код</span>
          <div className={styles.spinnerFotTimer}>
            <Spinner />
          </div>
        </div>
      ) : isActive ? (
        <>
          Отправить код ещё раз через{" "}
          <span className={styles.wsNoWrap}>{formatTime(secondsLeft)}</span>
        </>
      ) : (
        <div
          onClick={sendSms}
          className={styles.resendLink}
          style={{ cursor: "pointer" }}
        >
          Отправить код ещё раз
        </div>
      )}
    </div>
  );
};
