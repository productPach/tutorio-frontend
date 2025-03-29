"use client";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
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

      console.log(userType);

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

  if (isLoading) return <div>Загрузка...</div>;
  if (isVerified)
    return (
      <div className={clsx(styles.container, styles.center)}>
        <div className={styles.content_block}>
          <p className={styles.title}>🎉 Бам! Почта подтверждена! 🚀</p>
          <p className={styles.description}>
            Ваш email теперь на связи! 📩 Готовьтесь получать уведомления о
            новых заказах и откликах от учеников! 💌<br></br>
            <br></br> Время для новых возможностей — не пропустите! ⏰
          </p>
        </div>
      </div>
    );

  return (
    <div className={clsx(styles.container, styles.center)}>
      <div className={styles.content_block}>
        {error && (
          <>
            <p className={styles.title}>Упс, ошибка! 😟</p>{" "}
            <p className={styles.description}>
              Мы попробуем разобраться.<br></br> Попробуйте позже или свяжитесь
              с нами! 💬
            </p>
          </>
        )}
      </div>
    </div>
  );
}
