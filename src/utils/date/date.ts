import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

// Функция для правильного склонения времени (минут, часов и дней)
const getTimeDeclension = (count: number, unit: string): string => {
  if (unit === "minute") {
    if (count === 0) return "только что"; // Если 0 минут — показываем "только что"
    if (count === 1) return "минуту назад";
    if ([2, 3, 4].includes(count)) return `${count} минуты назад`;
    return `${count} минут назад`;
  }

  if (unit === "hour") {
    if (count === 1) return "час назад";
    if ([2, 3, 4].includes(count)) return `${count} часа назад`;
    return `${count} часов назад`;
  }

  if (unit === "day") {
    if (count === 1) return "день назад";
    if ([2, 3, 4].includes(count)) return `${count} дня назад`;
    return `${count} дней назад`;
  }

  return "";
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateString = typeof date === "string" ? new Date(date) : date;

  // Получаем разницу во времени с использованием formatDistanceToNow
  const distance = formatDistanceToNow(dateString, { addSuffix: true, locale: ru });

  // В зависимости от разницы времени, определяем, что именно мы склоняем
  const diffInMinutes = Math.floor((new Date().getTime() - dateString.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Если разница менее 60 минут, склоняем минуты
  if (diffInMinutes < 60) {
    return getTimeDeclension(diffInMinutes, "minute");
  }

  // Если разница менее 24 часов, склоняем часы
  if (diffInHours < 24) {
    return getTimeDeclension(diffInHours, "hour");
  }

  // Если разница более 24 часов, склоняем дни
  return getTimeDeclension(diffInDays, "day");
};
