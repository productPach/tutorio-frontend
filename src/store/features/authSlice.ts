import { getAccessToken, removeAccessToken, setAccessToken } from "@/api/server/auth";
import { fetchGetToken, fetchLogout, fetchRefreshToken, fetchUpdatePhoneUser } from "@/api/server/userApi";
import {
  SignInFormType,
  UpdatePhoneUser,
  User,
  UserRegion,
} from "@/types/types";
import { removeCookie } from "@/utils/cookies/cookies";
import {
  removeLocalStorage,
} from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getToken = createAsyncThunk(
  "auth/getToken",
  async ({ phone, secretCode, role }: SignInFormType, { rejectWithValue }) => {
    try {
      const response = await fetchGetToken({ phone, secretCode, role });
      // добавляем accessToken в localStorage
      setAccessToken(response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка авторизации");
    }
  }
);

export const updatePhoneUser = createAsyncThunk<boolean, UpdatePhoneUser>(
  "user/updatePhoneUser",
  async ({ id: userId, phone, secretCode }, { rejectWithValue }) => {
    try {
      return await fetchUpdatePhoneUser({
        id: userId,
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

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async ({ logoutAllDevices }: { logoutAllDevices?: boolean }, { rejectWithValue }) => {
    try {
      let token = getAccessToken();

      // Если токена нет или он протух, дергаем refresh
      if (!token) {
        try {
          token = await fetchRefreshToken(); // здесь мы получаем новый accessToken
          token && setAccessToken(token);
        } catch (refreshError) {
          // refresh не сработал → просто чистим состояние
          return rejectWithValue("Сессия истекла, необходимо авторизоваться заново");
        }
      }

      // После этого токен точно есть
      const response = await fetchLogout(token!, logoutAllDevices);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при выходе из системы");
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
      setAccessToken(action.payload); // ДОБАВЛЕНО: ИЗМЕНЕНИЯ РЕФРЕШ ТОКЕНЫ 23 09 2025
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
      removeAccessToken(); // ДОБАВЛЕНО: ИЗМЕНЕНИЯ РЕФРЕШ ТОКЕНЫ 23 09 2025
      removeLocalStorage("student");
      removeLocalStorage("tutor");
      removeLocalStorage("employee");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getToken.fulfilled, (state, action) => {
          // Проверяем на наличие токена
          state.token = action.payload;
          state.isLoggedIn = true;
          state.loadingAuth = false;
      })
      .addCase(getToken.pending, (state) => {
        state.loadingAuth = true;
        state.errorMessage = null;
      })
      .addCase(getToken.rejected, (state, action) => {
        state.loadingAuth = false;
        state.errorMessage = action.payload as string;
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;
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
      )
      // === LOGOUT ===
      .addCase(logoutUser.pending, (state) => {
        state.loadingAuth = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Вызываем редьюсер setLogout для очистки состояния
        authSlice.caseReducers.setLogout(state);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loadingAuth = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setToken, setRegionUser, setStatusUpdateUser, setLogout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
