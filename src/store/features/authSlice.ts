import { fetchGetToken } from "@/api/server/userApi";
import { SignInFormType, User } from "@/types/types";
import { removeCookie, setCookie } from "@/utils/cookies/cookies";
import { removeLocalStorage } from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getToken = createAsyncThunk<string, SignInFormType>(
  'auth/getToken',
  async ({ phone, secretCode }) => {
    try {
      const response = await fetchGetToken({ phone, secretCode });
      return response.token;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      return undefined; // Или выбросить ошибку, если это необходимо
    }
  }
);

type AuthStateType =  {
  user: null | User;
  token: null | string;
  isLoggedIn: boolean;
  loadingAuth: boolean;
}

const initialState: AuthStateType = {
  user: null,
  token: null,
  isLoggedIn: false,
  loadingAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.loadingAuth = false;
      removeCookie("user");
      removeLocalStorage("student");
    }
  },
  extraReducers(builder) {
    builder
    .addCase(getToken.fulfilled,
      (state, action: PayloadAction<string>) => {
        if (action.payload) { // Проверяем на наличие токена
          state.token = action.payload;
          state.isLoggedIn = true;
          setCookie("user", state.token, 30, {});
        } else {
          // Обработка ситуации, когда токен отсутствует
          state.isLoggedIn = false; // Не авторизован
          state.token = null; // Обнуляем токен
        }
        state.loadingAuth = false; // Завершаем загрузку
      })
    .addCase(getToken.pending,
      (state,) => {
        state.loadingAuth = true;
      })
    .addCase(getToken.rejected,
      (state) => {
        state.loadingAuth = false;
      })
  }
});

export const { setToken, setLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;