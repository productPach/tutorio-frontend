import { fetchGetAllOrders } from "@/api/server/orderApi";
import { Order } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getAllOrders = createAsyncThunk<
  Order[], // Тип возвращаемых данных - массив заказов
  string,  // Тип ожидаемого аргумента - токен
  { rejectValue: string } // Тип для ошибки
>(
  'order/getAllOrders',
  async (token, { rejectWithValue }) => {
    try {
      // Запрос списка заказов
      const orders = await fetchGetAllOrders(token);
      return orders; // Возвращаем массив заказов
    } catch (error) {
      // Обрабатываем ошибку и передаем ее сообщение через rejectWithValue
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при получении заказов';
      return rejectWithValue(errorMessage);
    }
  }
);

type OrdersStateType =  {
    orders: [] | Order[];
    loading: boolean;
    error: null | string;
    filters: string[];
}

const initialState: OrdersStateType = {
    orders: [],
    loading: false,
    error: null as string | null,
    filters: []
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderFilters: (state, action: PayloadAction<string[]>) => {
      state.filters = action.payload; // Обновляем состояние фильтров
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // Записываем полученные заказы
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Обработка ошибки
      });
  },
});

export const { setOrderFilters } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;