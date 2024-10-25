import { fetchCreateTutor, fetchCurrentTutor, fetchUpdateTutor } from "@/api/server/tutorApi";
import { District, Metro, RegionalCity, Tutor } from "@/types/types";
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
  { id: string, token: string, status: string, name?: string, email?: string, subject?: string[], region?: string, tutorPlace?: string[], tutorAdress?: string, tutorTrip?: string[] }
>("tutor/update", async ({ id, token, status, name, email, subject, region, tutorPlace, tutorAdress, tutorTrip }) => {
  try {
    const response = await fetchUpdateTutor(id, token, status, name, email ?? "", subject ?? [], region ?? "", tutorPlace ?? [], tutorAdress ?? "", tutorTrip ?? [] );
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

type TutorStateType = {
  tutor: null | Tutor;
  loading: boolean;
  selectedValuesCity: (District | Metro)[];
  selectedValuesArea: RegionalCity[];
};

// Получаем данные репетитора из localStorage, если они есть
const initialTutor = getTutorFromLocalStorage();

const initialState: TutorStateType = {
  tutor: initialTutor,
  loading: false,
  selectedValuesCity: [],
  selectedValuesArea: [],
};

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setTutor: (state, action: PayloadAction<Tutor>) => {
      state.tutor = action.payload;
    },
    setSelectedValuesCity: (state, action: PayloadAction<(District | Metro)[]>) => {
      state.selectedValuesCity = action.payload;
    },
    setSelectedValuesArea: (state, action: PayloadAction<RegionalCity[]>) => {
        state.selectedValuesArea = action.payload;
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
      );
  },
});

export const { setTutor, setSelectedValuesCity, setSelectedValuesArea } = tutorSlice.actions;
export const tutorReducer = tutorSlice.reducer;
