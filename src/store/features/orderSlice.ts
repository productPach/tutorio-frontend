import { fetchGetAllOrders, fetchGetOrderById, fetchOrdersByStudentId, fetchUpdateOrder } from "@/api/server/orderApi";
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

export const getOrdersByStudentId = createAsyncThunk<
  Order[], // Тип возвращаемых данных - массив заказов
  { token: string; studentId: string }, // Тип ожидаемого аргумента
  { rejectValue: string } // Тип для ошибки
>(
  'order/getOrdersByStudentId',
  async ({ token, studentId }, { rejectWithValue }) => {
    try {
      const orders = await fetchOrdersByStudentId(token, studentId);
      return orders;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при получении заказов студента';
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


// Обновление заказа студентом
export const updateOrder = createAsyncThunk<
  Order, // Возвращаемый объект — обновленный заказ
  {
    id: string;
    token: string;
    studentType?: string;
    studentYears?: string;
    studentClass?: string;
    studentCourse?: string;
    studentUniversity?: string;
    studentExam?: string;
    studyMethod?: string;
    studyProgramm?: string;
    deadline?: string;
    studentLevel?: string;
    tutorGender?: string;
    studentSchedule?: string[];
    studentPlace?: string[];
    studentAdress?: string;
    studentHomeLoc?: string;
    studentTrip?: string[];
    tutorType?: string;
    autoContactsOnResponse?: boolean;
    studentWishes?: string;
    responseCost?: number;
    status?: string;
  }
>("order/update", async ({ id, token, ...optionalFields }) => {
  try {
    const dataToUpdate = {
      id,
      token,
      ...optionalFields,
    };

    const response = await fetchUpdateOrder(dataToUpdate); // Предполагается, что fetchUpdateOrder делает запрос на сервер
    return response; // API возвращает обновленный заказ
  } catch (error) {
    console.error("Ошибка обновления заказа:", error);
    throw error;
  }
});

interface ScrollPayload {
  scrollPosition: number;
  scrollHeight: number;
}

type OrdersStateType =  {
    orders: [] | Order[];
    loading: boolean;
    error: null | string;
    filters: {
      selectedPlaceFilters: string[];
      selectedGoalFilters: string[];
    };
    orderById: null | Order;
    componentMenu: number;
    scrollPosition: number; // Положение скролла
  scrollHeight: number;   // Общая высота страницы
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
    componentMenu: 1,
    scrollPosition: 0, // Начальное положение скролла
  scrollHeight: 0,   // Начальная высота страницы
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
    setComponentMenu(state, action) {
      state.componentMenu = action.payload;
    },
    updateScrollPosition: (state, action: PayloadAction<ScrollPayload>) => {
      const { scrollPosition, scrollHeight } = action.payload;
      state.scrollPosition = scrollPosition;
      state.scrollHeight = scrollHeight;
    },
    setOrderById(state, action: PayloadAction<Order>) {
      state.orderById = action.payload;
    },
    clearOrderById(state) {
      state.orderById = null;
    },
    updateChatInOrder(state, action) {
      const { chatId, updatedChat } = action.payload;
      if (state.orderById) {
        const chatIndex = state.orderById.chats.findIndex((chat) => chat.id === chatId);
        if (chatIndex !== -1) {
          state.orderById.chats[chatIndex] = updatedChat;
        }
      }
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
      })
      .addCase(getOrdersByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByStudentId.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(getOrdersByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Произошла ошибка при загрузке заказов";
      })
      .addCase(
        updateOrder.fulfilled,
              (state, action: PayloadAction<Order>) => {
                if (state.orderById) {
                  state.orderById = action.payload;
                }
              }
            )
            ;
  },
});

export const { setOrderFilters, clearFilters, setComponentMenu, updateScrollPosition, setOrderById, clearOrderById, updateChatInOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;