"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Импортируем для работы с параметрами URL
import { verifyEmail } from "@/store/features/tutorSlice"; // Импортируем экшен для верификации почты
import { useAppDispatch, useAppSelector } from "@/store/store";
import { io } from "socket.io-client";
import { host, port } from "@/api/server/configApi";

const socket = io(`${host}${port}`);

export default function VerifyEmailPage() {
  const searchParams = useSearchParams(); // Получаем параметры URL
  const token = searchParams.get("token"); // Извлекаем токен из параметров
  const tutor = useAppSelector((state) => state.tutor.tutor);
  const dispatch = useAppDispatch(); // Диспатчим экшен для обновления состояния репетитора

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      // Делаем запрос через экшен verifyEmail для верификации почты
      dispatch(verifyEmail({ token }))
        .unwrap() // Получаем результат выполнения экшена или ошибку
        .then(() => {
          setIsVerified(true); // Устанавливаем состояние верификации
          const tutorId = tutor?.id; // Предполагаем, что ответ содержит tutorId
          if (socket) {
            socket.emit("verifyEmail", tutorId); // Отправляем событие для подтверждения
          }
        })
        .catch((err: any) => {
          // Обрабатываем ошибку
          setError("Произошла ошибка при верификации почты.");
        })
        .finally(() => {
          setIsLoading(false); // Завершаем загрузку
        });
    }
  }, [token, dispatch, tutor?.id]); // Зависимость от token и dispatch для корректной работы

  if (isLoading) return <div>Загрузка...</div>;
  if (isVerified) return <div>Ваша почта успешно верифицирована!</div>;

  return <div>{error}</div>;
}
