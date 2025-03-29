import { fetchGetToken, fetchUpdatePhoneUser } from "@/api/server/userApi";
import {
  SignInFormType,
  UpdatePhoneUser,
  User,
  UserRegion,
} from "@/types/types";
import { removeCookie, setCookie } from "@/utils/cookies/cookies";
import {
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getToken = createAsyncThunk<string, SignInFormType>(
  "auth/getToken",
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

export const updatePhoneUser = createAsyncThunk<boolean, UpdatePhoneUser>(
  "user/updatePhoneUser",
  async ({ id: userId, token, phone, secretCode }, { rejectWithValue }) => {
    try {
      return await fetchUpdatePhoneUser({
        id: userId,
        token,
        phone,
        secretCode,
      });
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Произошла неизвестная ошибка");
    }
  }
);

type AuthStateType = {
  user: null | User;
  token: null | string;
  isLoggedIn: boolean;
  loadingAuth: boolean;
  regionUser: UserRegion | null;
  updateUser: boolean;
  statusUpdateUser: boolean;
  errorMessage: null | string;
};

const initialState: AuthStateType = {
  user: null,
  token: null,
  isLoggedIn: false,
  loadingAuth: false,
  regionUser: null,
  updateUser: false,
  statusUpdateUser: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRegionUser: (state, action: PayloadAction<UserRegion>) => {
      state.regionUser = action.payload;
    },
    setStatusUpdateUser: (state, action: PayloadAction<boolean>) => {
      state.statusUpdateUser = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.loadingAuth = false;
      removeCookie("user");
      removeLocalStorage("student");
      removeLocalStorage("tutor");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getToken.fulfilled, (state, action: PayloadAction<string>) => {
        if (action.payload) {
          // Проверяем на наличие токена
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
      .addCase(getToken.pending, (state) => {
        state.loadingAuth = true;
      })
      .addCase(getToken.rejected, (state) => {
        state.loadingAuth = false;
      })
      .addCase(updatePhoneUser.rejected, (state, action) => {
        state.updateUser = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(updatePhoneUser.pending, (state) => {
        state.updateUser = true;
      })
      .addCase(
        updatePhoneUser.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          if (action.payload === true) {
            state.updateUser = false;
            state.statusUpdateUser = true;
          }
        }
      );
  },
});

export const { setToken, setRegionUser, setStatusUpdateUser, setLogout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
