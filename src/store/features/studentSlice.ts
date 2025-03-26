import {
  fetchCreateStudent,
  fetchCurrentStudent,
  fetchDeleteRequest,
  fetchUpdateStudent,
} from "@/api/server/studentApi";
import { Student } from "@/types/types";
import { getStudentFromLocalStorage, setLocalStorage } from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getCurrentStudent = createAsyncThunk<Student, string>(
  "student/current",
  async (token) => {
    try {
      const response = await fetchCurrentStudent(token);
      return response;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      throw error;
    }
  }
);

export const createStudent = createAsyncThunk<
  Student,
  { name: string; phone: string; avatarUrl: string; region: string; token: string }
>("student/create", async ({ name, phone, avatarUrl, region, token }) => {
  try {
    const response = await fetchCreateStudent(name, phone, avatarUrl, region, token);
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

// Изменение студента
export const updateStudent = createAsyncThunk<
  Student,
  {
    id: string;
    token: string;
    status: string;
    name?: string;
    phone?: string;
    email?: string;
    isVerifedEmail?: boolean;
    telegram?: string;
    skype?: string;
    region?: string;
    isNotifications?: boolean;
    isNotificationsResponse?: boolean;
    isNotificationsPromo?: boolean;
    isNotificationsSms?: boolean;
    isNotificationsEmail?: boolean;
    isNotificationsTelegram?: boolean;
    isNotificationsVk?: boolean;
  }
>("student/update", async ({ id, token, status, ...optionalFields }) => {
  try {
    const dataToUpdate = {
      id,
      token,
      status,
      ...optionalFields,
    };

    const response = await fetchUpdateStudent(dataToUpdate);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Удаление запроса об удалении!! НЕДОДЕЛАНО!!!
export const deleteStudentRequest = createAsyncThunk<
  boolean, // Возвращаем true при успешном запросе
  { studentId: string; answer: string; token: string } // Входные параметры
>("tutor/deleteRequest", async ({ studentId, answer, token }, { rejectWithValue }) => {
  try {
    await fetchDeleteRequest(studentId, answer, token);
    return true; // Успешный запрос
  } catch (error) {
    console.error("Ошибка удаления репетитора:", error);
    return rejectWithValue(false); // Возвращаем false при ошибке
  }
});

type StudentStateType = {
  student: null | Student;
  updateStatus: string;
  loading: boolean;
  deleteRequest: boolean;
};

// Получаем данные репетитора из localStorage, если они есть
const initialStudent = getStudentFromLocalStorage();

const initialState: StudentStateType = {
  student: initialStudent,
  updateStatus: "idle", // idle | loading | success | failed
  loading: false,
  deleteRequest: false,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Student>) => {
      state.student = action.payload;
    },
    setStudentLogout: (state) => {
      state.student = null;
    },
    resetDeleteRequest: (state) => {
      state.deleteRequest = false; // Сбросить состояние
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        getCurrentStudent.fulfilled,
        (state, action: PayloadAction<Student>) => {
          if (action.payload) {
            // Проверяем на наличие данных
            state.student = action.payload;
            setLocalStorage("student", state.student);
          } else {
            state.student = null; // Обнуляем студента
          }
          state.loading = false; // Завершаем загрузку
        }
      )
      .addCase(getCurrentStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentStudent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(
        createStudent.fulfilled,
        (state, action: PayloadAction<Student>) => {
          state.student = action.payload;
          setLocalStorage("student", state.student);
        }
      )
      .addCase(
        updateStudent.fulfilled, 
        (state, action: PayloadAction<Student>) => {
          state.student = action.payload;
          state.loading = false;
          state.updateStatus = "success";
          setLocalStorage("student", state.student);
        })
      .addCase(
        updateStudent.pending, 
        (state) => {
          state.loading = true;
          state.updateStatus = "loading";
        })
      .addCase(
        updateStudent.rejected, 
        (state) => {
          state.loading = false;
          state.updateStatus = "failed";
        });
  },
});

export const { setStudent, setStudentLogout, resetDeleteRequest } = studentSlice.actions;
export const studentReducer = studentSlice.reducer;
