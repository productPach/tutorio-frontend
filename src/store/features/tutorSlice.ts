import { baseUrl } from "@/api/server/configApi";
import { fetchCreateTutor, fetchCurrentTutor, fetchUpdateTutor } from "@/api/server/tutorApi";
import { fetchShowWelcomeScreen, fetchWelcomeScreens } from "@/api/server/userApi";
import { District, Metro, RegionalCity, Tutor, UpdateTutorAvatarPayload, UpdateTutorAvatarResponse, WelcomeScreen } from "@/types/types";
import { getTutorFromLocalStorage, setLocalStorage } from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getCurrentTutor = createAsyncThunk<Tutor, string>(
  "tutor/current",
  async (token) => {
    try {
      const response = await fetchCurrentTutor(token);
      return response;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      throw error;
    }
  }
);

export const createTutor = createAsyncThunk<
  Tutor,
  { phone: string; token: string }
>("tutor/create", async ({ phone, token }) => {
  try {
    const response = await fetchCreateTutor(phone, token);
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

export const updateTutor = createAsyncThunk<
  Tutor,
  { id: string; token: string; status: string; name?: string; email?: string; subject?: string[]; region?: string; tutorPlace?: string[]; tutorAdress?: string; tutorTrip?: string[], profileInfo?: string; }
>("tutor/update", async ({ id, token, status, ...optionalFields }) => {
  try {
    // Базовый объект с обязательными полями
    const dataToUpdate = {
      id,
      token,
      status,
      ...(optionalFields.name !== undefined && { name: optionalFields.name }),
      ...(optionalFields.email !== undefined && { email: optionalFields.email }),
      ...(optionalFields.subject !== undefined && { subject: optionalFields.subject }),
      ...(optionalFields.region !== undefined && { region: optionalFields.region }),
      ...(optionalFields.tutorPlace !== undefined && { tutorPlace: optionalFields.tutorPlace }),
      ...(optionalFields.tutorAdress !== undefined && { tutorAdress: optionalFields.tutorAdress }),
      ...(optionalFields.tutorTrip !== undefined && { tutorTrip: optionalFields.tutorTrip }),
      ...(optionalFields.profileInfo !== undefined && { profileInfo: optionalFields.profileInfo }),
    };

    const response = await fetchUpdateTutor(dataToUpdate);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const updateTutorAvatar = createAsyncThunk<
  UpdateTutorAvatarResponse,
  UpdateTutorAvatarPayload // Используем обновленный интерфейс
>(
  "tutor/updateAvatar",
  async ({ id, file, token, croppedAreaPixels }) => {
    // Если файл отсутствует, выполняем удаление аватара
    if (!file) {
      const response = await fetch(`${baseUrl}tutors/${id}/avatar`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении аватара");
      }

      return response.json();
    }

    // Обновление аватара
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${baseUrl}tutors/${id}/avatar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении аватара");
    }

    return response.json();
  }
);

// Получение велком-скринов для репетитора
export const getWelcomeScreens = createAsyncThunk<
WelcomeScreen[],
  string
>("tutor/welcomeScreen", async (token) => {
  try {
    const response = await fetchWelcomeScreens(token);
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

// Просмотор велком-скрина
export const showWelcomeScreen = createAsyncThunk<
  { success: boolean; id: string }, // Возвращаемое значение
  {token: string; id: string}    // Параметры функции
>(
  "tutor/showWelcomeScreen",
  async ({ token, id }) => {
    try {
      const response = await fetchShowWelcomeScreen(token, id);
      return { success: response.success, id }; // Возвращаем успешность и ID
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);


type TutorStateType = {
  tutor: null | Tutor;
  loading: boolean;
  selectedValuesCity: (District | Metro)[];
  selectedValuesArea: RegionalCity[];
  supportMenu: boolean;
  welcomeScreens: null | WelcomeScreen[];
  hiddenScreens: string[]; // Добавляем скрытые экраны
};

// Получаем данные репетитора из localStorage, если они есть
const initialTutor = getTutorFromLocalStorage();

const initialState: TutorStateType = {
  tutor: initialTutor,
  loading: false,
  selectedValuesCity: [],
  selectedValuesArea: [],
  supportMenu: false,
  welcomeScreens: null,
  hiddenScreens: [],
};

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setTutor: (state, action: PayloadAction<Tutor>) => {
      state.tutor = action.payload;
    },
    setTutorLogout: (state) => {
      state.tutor = null;
    },
    setSelectedValuesCity: (state, action: PayloadAction<(District | Metro)[]>) => {
      state.selectedValuesCity = action.payload;
    },
    setSelectedValuesArea: (state, action: PayloadAction<RegionalCity[]>) => {
        state.selectedValuesArea = action.payload;
    },
    setSupportMenu: (state, action: PayloadAction<boolean>) => {
      state.supportMenu = action.payload;
  },
  addHiddenScreen(state, action: PayloadAction<string>) {
    // Добавляем id скрытого экрана в массив
    if (!state.hiddenScreens.includes(action.payload)) {
      state.hiddenScreens.push(action.payload);
    }
  },
  },
  extraReducers(builder) {
    builder
      .addCase(
        getCurrentTutor.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          if (action.payload) {
            // Проверяем на наличие данных
            state.tutor = action.payload;
            setLocalStorage("tutor", state.tutor);
          } else {
            state.tutor = null; // Обнуляем репетитора
          }
          state.loading = false; // Завершаем загрузку
        }
      )
      .addCase(getCurrentTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentTutor.rejected, (state) => {
        state.loading = false;
      })
      .addCase(
        createTutor.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          state.tutor = action.payload;
          setLocalStorage("tutor", state.tutor);
        }
      ).addCase(
        updateTutor.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          state.tutor = action.payload;
          setLocalStorage("tutor", state.tutor);
        }
      ).addCase(
        updateTutorAvatar.fulfilled, 
        (state, action) => {
        if (state.tutor && state.tutor.id === action.payload.id) {
          state.tutor.avatarUrl = action.payload.avatarUrl;
          setLocalStorage("tutor", state.tutor);
        }
      }).addCase(getWelcomeScreens.fulfilled, (state, action: PayloadAction<WelcomeScreen[]>) => {
        state.welcomeScreens = action.payload;
      })
      .addCase(showWelcomeScreen.fulfilled, (state, action) => {
        if (action.payload.success && state.welcomeScreens) {
          // Удаляем просмотренный велком-скрин по ID
          const updatedHiddenScreens = [...state.hiddenScreens, action.payload.id];
          state.hiddenScreens = updatedHiddenScreens;
          localStorage.setItem("hiddenScreens", JSON.stringify(updatedHiddenScreens)); // Обновляем в localStorage
        }
      });
  },
});

export const { setTutor, setTutorLogout, setSelectedValuesCity, setSelectedValuesArea, setSupportMenu, addHiddenScreen } = tutorSlice.actions;
export const tutorReducer = tutorSlice.reducer;
