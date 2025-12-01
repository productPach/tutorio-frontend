import { BalanceTransaction, CreatePaymentResponse, Payment, WithdrawResponse } from "@/types/types";
import httpClient from "./httpClient";

// --- Создание платежа ---
export const fetchCreatePayment = async (amount: number): Promise<CreatePaymentResponse> => {
  try {
    const response = await httpClient.post<CreatePaymentResponse>("/payments/create", { amount });
    return response.data;
  } catch (error: any) {
    console.error("❌ Ошибка при создании платежа:", error.response?.data || error.message);
    throw error;
  }
};

// --- Получение статуса платежа ---
export const fetchPaymentStatus = async (paymentId: string): Promise<Payment> => {
  try {
    const response = await httpClient.get<Payment>(`/payments/status?paymentId=${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Ошибка при получении статуса платежа:", error.response?.data || error.message);
    throw error;
  }
};

// --- История транзакций пользователя ---
export const fetchBalanceHistory = async (): Promise<BalanceTransaction[]> => {
  try {
    const response = await httpClient.get<BalanceTransaction[]>("/payments/history");
    return response.data;
  } catch (error: any) {
    console.error("❌ Ошибка при получении истории транзакций:", error.response?.data || error.message);
    throw error;
  }
};

// --- Списание средств с баланса ---
export const fetchWithdrawBalance = async (amount: number, reason: string): Promise<WithdrawResponse> => {
  try {
    const response = await httpClient.post<WithdrawResponse>("/balance/withdraw", { amount, reason });
    return response.data;
  } catch (error: any) {
    console.error("❌ Ошибка при списании с баланса:", error.response?.data || error.message);
    throw error;
  }
};