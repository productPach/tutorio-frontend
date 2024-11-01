import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const formatTimeAgo = (date: string | Date): string => {
    const dateString = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateString, { addSuffix: true, locale: ru });
  };