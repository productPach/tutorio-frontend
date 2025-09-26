import { removeAccessToken, setAccessToken } from "@/api/server/auth";
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

// ИЗМЕНЕНИЯ РЕФРЕШ ТОКЕНЫ 23 09 2025
// export const getToken = createAsyncThunk<string, SignInFormType>(
//   "auth/getToken",
//   async ({ phone, secretCode, role }) => {
//     try {
//       const response = await fetchGetToken({ phone, secretCode, role });
//       return response.token;
//     } catch (error) {
//       // Здесь можно вернуть undefined или обработать ошибку
//       console.error(error);
//       return undefined; // Или выбросить ошибку, если это необходимо
//     }
//   }
// );

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
      removeCookie("user");
      removeLocalStorage("student");
      removeLocalStorage("tutor");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getToken.fulfilled, (state, action) => {
          // Проверяем на наличие токена
          state.token = action.payload;
          //state.user = action.payload.user; // ДОБАВЛЕНО: ИЗМЕНЕНИЯ РЕФРЕШ ТОКЕНЫ 23 09 2025
          state.isLoggedIn = true;
          state.loadingAuth = false; // ДОБАВЛЕНО: ИЗМЕНЕНИЯ РЕФРЕШ ТОКЕНЫ 23 09 2025
          // По идее теперь для прода это не нужно, тк устанавливается на бэке
          // setCookie("user", state.token, 30, {});
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
      );
  },
});

export const { setToken, setRegionUser, setStatusUpdateUser, setLogout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
