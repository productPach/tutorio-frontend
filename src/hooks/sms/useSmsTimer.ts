import { baseUrl } from "@/api/server/configApi";
import { useState, useEffect, useRef } from "react";

/**
 * Хук управления таймером повторной отправки SMS
 *
 * @param {string} phone - номер телефона
 */
export const useSmsTimer = (phone?: string) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ==== Вспомогательная функция для вычисления оставшегося времени ====
  const calcRemainingSeconds = (retryAvailableAt: string | Date) => {
    const now = new Date().getTime();
    const retry = new Date(retryAvailableAt).getTime();
    return Math.max(0, Math.ceil((retry - now) / 1000));
  };

  // ==== Запрос на отправку SMS ====
  const sendSms = async () => {
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}sms/secret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.retryAvailableAt) {
          // Уже есть ограничение → продолжаем таймер
          const remaining = calcRemainingSeconds(data.retryAvailableAt);
          setSecondsLeft(remaining);
          setIsActive(remaining > 0);
        }
        throw new Error(data.error || "Ошибка при отправке SMS");
      }

      // Всё успешно: сохраняем время в localStorage (опционально)
      const retryAt = data.retryAvailableAt;
      localStorage.setItem("sms_retry_at", retryAt);

      const remaining = calcRemainingSeconds(retryAt);
      setSecondsLeft(remaining);
      setIsActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==== Автоматический отсчёт ====
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft <= 0) {
      setIsActive(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  // ==== Восстановление состояния при перезагрузке ====
  useEffect(() => {
    const retryAt = localStorage.getItem("sms_retry_at");
    if (retryAt) {
      const remaining = calcRemainingSeconds(retryAt);
      if (remaining > 0) {
        setSecondsLeft(remaining);
        setIsActive(true);
      } else {
        localStorage.removeItem("sms_retry_at");
      }
    }
  }, []);

  return {
    sendSms, // функция для старта
    isActive, // идёт ли отсчёт
    secondsLeft, // сколько секунд осталось
    loading, // идёт ли запрос
  };
};
