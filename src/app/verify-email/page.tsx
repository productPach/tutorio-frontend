"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/store/features/tutorSlice";
import { useAppDispatch } from "@/store/store";
import { io } from "socket.io-client";
import { host, port } from "@/api/server/configApi";

const socket = io(`${host}${port}`);

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Отсутствует токен для подтверждения.");
      setIsLoading(false);
      return;
    }

    dispatch(verifyEmail({ token }))
      .unwrap()
      .then(() => {
        setIsVerified(true);
        if (token) {
          socket.emit("verifyEmail", token); // 🔹 Передаем токен
        }
      })
      .catch(() => {
        setError("Произошла ошибка при верификации почты.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      socket.off("emailVerified");
    };
  }, [token, dispatch]);

  // 🔹 Ожидаем ответ от сервера через сокет
  useEffect(() => {
    const handleVerified = ({ tutorId }: { tutorId: string }) => {
      console.log("Email подтвержден для ID:", tutorId);
    };

    const handleError = ({ error }: { error: string }) => {
      setError(error);
    };

    socket.on("emailVerified", handleVerified);
    socket.on("emailVerificationError", handleError);

    return () => {
      socket.off("emailVerified", handleVerified);
      socket.off("emailVerificationError", handleError);
    };
  }, []);

  if (isLoading) return <div>Загрузка...</div>;
  if (isVerified) return <div>Ваша почта успешно верифицирована!</div>;

  return <div>{error}</div>;
}
