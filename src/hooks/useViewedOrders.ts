import { useEffect } from "react";

const STORAGE_KEY = "viewedOrders";
const EXPIRATION_DAYS = 30;
const MS_IN_DAY = 86400000;

interface ViewedOrder {
  id: string;
  timestamp: number; // ms
}

const getStoredOrders = (): ViewedOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders: ViewedOrder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const useViewedOrders = () => {
  useEffect(() => {
    // Чистим устаревшие заказы при монтировании
    const now = Date.now();
    const freshOrders = getStoredOrders().filter(
      (o) => now - o.timestamp < EXPIRATION_DAYS * MS_IN_DAY
    );
    saveOrders(freshOrders);
  }, []);

  const markAsViewed = (id: string) => {
    const now = Date.now();
    const existing = getStoredOrders();
    if (!existing.find((o) => o.id === id)) {
      existing.push({ id, timestamp: now });
      saveOrders(existing);
    }
  };

  const isViewed = (id: string): boolean => {
    return getStoredOrders().some((o) => o.id === id);
  };

  const clearViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { markAsViewed, isViewed, clearViewed };
};
