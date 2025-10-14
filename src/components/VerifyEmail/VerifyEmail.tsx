"use client";
import styles from "./VerifyEmail.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/store/features/tutorSlice";
import { useAppDispatch } from "@/store/store";
import { io } from "socket.io-client";
import { host, port } from "@/api/server/configApi";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";
import { verifyEmailStudent } from "@/store/features/studentSlice";

interface DecodedToken {
  userId: string;
  email: string;
  userType: "tutor" | "student"; // Здесь указываем возможные значения для userType
}

const socket = io(`${host}${port}`);

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token); // Декодируем токен
      const userType = decodedToken.userType; // Получаем userType из payload токена

      // Вызываем нужный метод в зависимости от userType
      const action = userType === "tutor" ? verifyEmail : verifyEmailStudent;

      dispatch(action({ token }))
        .unwrap()
        .then(() => {
          setIsVerified(true);
          if (token) {
            socket.emit("verifyEmail", token); // 🔹 Передаем токен через сокет
          }
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      setError(true);
      setIsLoading(false);
    }

    return () => {
      socket.off("emailVerified");
    };
  }, [token, dispatch]);

  // 🔹 Ожидаем ответ от сервера через сокет
  useEffect(() => {
    const handleVerified = ({ tutorId }: { tutorId: string }) => {
      //console.log("Email подтвержден для ID:", tutorId);
    };

    const handleError = ({ error }: { error: string }) => {
      setError(true);
    };

    socket.on("emailVerified", handleVerified);
    socket.on("emailVerificationError", handleError);

    return () => {
      socket.off("emailVerified", handleVerified);
      socket.off("emailVerificationError", handleError);
    };
  }, []);

  // Функция для разделения текста по строкам
  const formatErrorText = (text: string | null) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => <div key={index}>{line}</div>);
  };

  const router = useRouter();

  const handleOnIndex = () => {
    router.push("../");
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (isVerified)
    return (
      <div className={clsx(styles.container, styles.center)}>
        <div className={styles.content_block}>
          <p className={styles.title}>
            🎉 Бам! Почта&nbsp;подтверждена!&nbsp;🚀
          </p>
          <p className={styles.description}>
            Ваш email теперь на&nbsp;связи!&nbsp;📩 Готовьтесь получать
            уведомления о&nbsp;новых заказах и&nbsp;откликах
            от&nbsp;учеников!&nbsp;💌<br></br>
            <br></br> Время для&nbsp;новых возможностей
            —&nbsp;не&nbsp;пропустите!&nbsp;⏰
          </p>
          <button
            onClick={() => handleOnIndex()}
            className={clsx(styles.content_block_button, styles.buttonYlw)}
          >
            На главную
          </button>
        </div>
      </div>
    );

  return (
    <div className={clsx(styles.container, styles.center)}>
      <div className={styles.content_block}>
        {error && (
          <>
            <p className={styles.title}>Упс,&nbsp;ошибка!&nbsp;😟</p>{" "}
            <p className={styles.description}>
              Мы попробуем разобраться.<br></br> Попробуйте позже
              или&nbsp;свяжитесь с&nbsp;нами!&nbsp;💬
            </p>
            <button
              onClick={() => handleOnIndex()}
              className={clsx(styles.content_block_button, styles.buttonYlw)}
            >
              На главную
            </button>
          </>
        )}
      </div>
    </div>
  );
}
