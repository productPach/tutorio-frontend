import { fetchGetAllOrders, fetchGetOrderById } from "@/api/server/orderApi";
import { Order } from "@/types/types";
import { getFiltersOrdersForTutorFromLocalStorage, setLocalStorage } from "@/utils/localStorage/localStorage";
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

export const getOrderById = createAsyncThunk<
  Order, // Тип возвращаемых данных
  { token: string; id: string },  // Тип ожидаемого аргумента - токен
  { rejectValue: string } // Тип для ошибки
>(
  'order/getOrdersById',
  async ({token, id}, { rejectWithValue }) => {
    try {
      // Запрос списка заказов
      const order = await fetchGetOrderById(token, id);
      return order; // Возвращаем массив заказов
    } catch (error) {
      // Обрабатываем ошибку и передаем ее сообщение через rejectWithValue
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при получении заказа';
      return rejectWithValue(errorMessage);
    }
  }
);

type OrdersStateType =  {
    orders: [] | Order[];
    loading: boolean;
    error: null | string;
    filters: {
      selectedPlaceFilters: string[];
      selectedGoalFilters: string[];
    };
    orderById: null | Order;
}

// Получаем данные репетитора из localStorage, если они есть
const initialFilters = getFiltersOrdersForTutorFromLocalStorage();

const initialState: OrdersStateType = {
    orders: [],
    loading: false,
    error: null as string | null,
    filters: {
      selectedPlaceFilters: initialFilters.placeFilters?.length > 0 ? initialFilters.placeFilters : [],
      selectedGoalFilters: initialFilters.goalFilters?.length > 0 ? initialFilters.goalFilters : [],
    },
    orderById: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderFilters(state, action: PayloadAction<{ placeFilters: string[]; goalFilters: string[] }>) {
      state.filters.selectedPlaceFilters = action.payload.placeFilters;
      state.filters.selectedGoalFilters = action.payload.goalFilters;
      setLocalStorage("place-filters-orders", state.filters.selectedPlaceFilters);
      setLocalStorage("goal-filters-orders", state.filters.selectedGoalFilters);
    },
    clearFilters(state) {
      state.filters.selectedPlaceFilters = [];
      state.filters.selectedGoalFilters = [];
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
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderById = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOrderFilters, clearFilters } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;