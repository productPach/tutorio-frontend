import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

// Функция для правильного склонения времени (минут, часов и дней)
const getTimeDeclension = (count: number, unit: string): string => {
  const getDeclension = (n: number, forms: [string, string, string]) => {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod10 === 1 && mod100 !== 11) return forms[0];      // 1 минута
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return forms[1]; // 2-4 минуты
    return forms[2]; // 5+ минут
  };

  if (unit === "minute") {
    if (count <= 0) return "только что"; // Если разница меньше или равна 0 минут, возвращаем "только что"
    return `${count} ${getDeclension(count, ["минута", "минуты", "минут"])} назад`;
  }

  if (unit === "hour") {
    if (count <= 0) return "только что"; // Если разница меньше или равна 0 часов, возвращаем "только что"
    return `${count} ${getDeclension(count, ["час", "часа", "часов"])} назад`;
  }

  if (unit === "day") {
    if (count <= 0) return "только что"; // Если разница меньше или равна 0 дней, возвращаем "только что"
    return `${count} ${getDeclension(count, ["день", "дня", "дней"])} назад`;
  }

  return "";
};

// Функция для получения времени, прошедшего с момента указанной даты
export const formatTimeAgo = (date: string | Date): string => {
  const dateString = typeof date === "string" ? new Date(date) : date;

  // Получаем разницу во времени
  const diffInMilliseconds = new Date().getTime() - dateString.getTime();

  // Если разница отрицательная, возвращаем "только что"
  if (diffInMilliseconds < 0) {
    return "только что";
  }

  // Вычисляем разницу в минутах, часах и днях
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
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

