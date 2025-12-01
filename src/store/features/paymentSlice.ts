import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  BalanceTransaction,
  CreatePaymentResponse,
  Payment,
  WithdrawResponse,
} from "@/types/types";
import { fetchBalanceHistory, fetchCreatePayment, fetchPaymentStatus, fetchWithdrawBalance } from "@/api/server/paymentApi";
import { fetchUserBalance } from "@/api/server/userApi";


const mapPaymentStatusToTransactionStatus = (status: Payment["status"]): BalanceTransaction["status"] => {
  switch (status) {
    case "succeeded":
      return "success";
    case "pending":
    case "waiting_for_capture":
      return "pending";
    case "canceled":
      return "canceled";
    default:
      return "canceled";
  }
};

// --- Async Thunks ---

// Получение баланса полдьзователя
export const getUserBalance = createAsyncThunk<{ balance: number; updatedAt: string }, void>(
  "user/balance",
  async () => {
    try {
      const response = await fetchUserBalance();
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Создание платежа через ЮKassa
export const createPayment = createAsyncThunk<
  CreatePaymentResponse,
  number,
  { rejectValue: string }
>("payment/createPayment", async (amount, { rejectWithValue }) => {
  try {
    return await fetchCreatePayment(amount);
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка при создании платежа");
  }
});

// Получение статуса платежа
export const getPaymentStatus = createAsyncThunk<
  Payment,
  string,
  { rejectValue: string }
>("payment/getPaymentStatus", async (paymentId, { rejectWithValue }) => {
  try {
    return await fetchPaymentStatus(paymentId);
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка при получении статуса платежа");
  }
});

// Загрузка истории транзакций
export const loadBalanceHistory = createAsyncThunk<
  BalanceTransaction[],
  void,
  { rejectValue: string }
>("payment/loadBalanceHistory", async (_, { rejectWithValue }) => {
  try {
    return await fetchBalanceHistory();
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка при загрузке истории транзакций");
  }
});

// Списание средств с баланса
export const withdrawBalance = createAsyncThunk<
  WithdrawResponse,
  { amount: number; reason: string },
  { rejectValue: string }
>("payment/withdrawBalance", async ({ amount, reason }, { rejectWithValue }) => {
  try {
    return await fetchWithdrawBalance(amount, reason);
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка при списании с баланса");
  }
});

// --- Slice State ---
type PaymentState = {
  transactions: BalanceTransaction[];
  balance: number;
  loading: boolean;
  error: string | null;
};

const initialState: PaymentState = {
  transactions: [],
  balance: 0,
  loading: false,
  error: null,
};

// --- Slice ---
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // Можно вызвать из вебхука или вручную при успешном платежe
    addSuccessfulDeposit(state, action: PayloadAction<BalanceTransaction>) {
      state.transactions.unshift(action.payload);
      state.balance += action.payload.amount;
    },
    // Обновление баланса вручную (например при загрузке)
    setBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- Получение баланса пользователя ---
    builder
      .addCase(getUserBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        //state.updatedAt = action.payload.updatedAt;
      })
      .addCase(getUserBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки баланса";
      });
    // --- createPayment ---
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при создании платежа";
      });

    // --- getPaymentStatus ---
    builder
      .addCase(getPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPayment = action.payload;

        const index = state.transactions.findIndex(
            (t) => t.meta?.paymentId === updatedPayment.paymentId
        );

        if (index !== -1) {
            const mappedStatus = mapPaymentStatusToTransactionStatus(updatedPayment.status);
            state.transactions[index] = {
            ...state.transactions[index],
            status: mappedStatus,
            };

            if (mappedStatus === "success") {
            state.balance += updatedPayment.amount;
            }
        }
        })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при получении статуса платежа";
      });

    // --- loadBalanceHistory ---
    builder
      .addCase(loadBalanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBalanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        // state.balance = action.payload
        //   .filter((t) => t.status === "success")
        //   .reduce((sum, t) => sum + (t.type === "withdrawal" ? -t.amount : t.amount), 0);
      })
      .addCase(loadBalanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при загрузке истории транзакций";
      });

    // --- withdrawBalance ---
    builder
      .addCase(withdrawBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawBalance.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(withdrawBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при списании с баланса";
      });
  },
});

export const { addSuccessfulDeposit, setBalance } = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
