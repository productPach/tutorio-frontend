import {
  fetchCreateStudent,
  fetchCurrentStudent,
  fetchDeleteRequest,
  fetchUpdateStudent,
  fetchVerifyEmail,
} from "@/api/server/studentApi";
import { Student } from "@/types/types";
import {
  getStudentFromLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getCurrentStudent = createAsyncThunk<Student, void>(
  "student/current",
  async () => {
    try {
      const response = await fetchCurrentStudent();
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
  {
    name: string;
    phone: string;
    avatarUrl: string;
    region: string;
  }
>("student/create", async ({ name, phone, avatarUrl, region }) => {
  try {
    const response = await fetchCreateStudent(
      name,
      phone,
      avatarUrl,
      region
    );
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
    lastOnline?: Date;
  }
>("student/update", async ({ id, status, ...optionalFields }) => {
  try {
    const dataToUpdate = {
      id,
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
  { studentId: string; answer: string; } // Входные параметры
>(
  "student/deleteRequest",
  async ({ studentId, answer }, { rejectWithValue }) => {
    try {
      await fetchDeleteRequest(studentId, answer);
      return true; // Успешный запрос
    } catch (error) {
      console.error("Ошибка удаления ученика:", error);
      return rejectWithValue(false); // Возвращаем false при ошибке
    }
  }
);

// Асинхронный экшен для верификации почты
export const verifyEmailStudent = createAsyncThunk<
  void, // Возвращаемое значение
  { token: string }, // Параметры
  { rejectValue: string } // Тип ошибки
>("student/verifyEmail", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await fetchVerifyEmail(token); // Отправляем запрос на сервер

    if (response.message === "Email подтверждён") {
      // Возвращаем пустое значение, так как экшен типа void
      return;
    } else {
      // Если ошибка, возвращаем ошибку через rejectWithValue
      return rejectWithValue(response.error || "Что-то пошло не так");
    }
  } catch (error: unknown) {
    console.error(error);
    // Проверяем тип ошибки и возвращаем корректное сообщение
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Ошибка верификации");
    } else {
      return rejectWithValue("Неизвестная ошибка");
    }
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
      removeLocalStorage("student");
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
        }
      )
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.updateStatus = "loading";
      })
      .addCase(updateStudent.rejected, (state) => {
        state.loading = false;
        state.updateStatus = "failed";
      })
      .addCase(verifyEmailStudent.fulfilled, (state) => {
        if (state.student) {
          state.student.isVerifedEmail = true; // Обновляем поле isVerifedEmail
          setLocalStorage("student", state.student);
        }
      })
      .addCase(verifyEmailStudent.rejected, (state, action) => {
        state.updateStatus = "failed";
        console.error(action.payload); // Логируем ошибку
      })
      .addCase(deleteStudentRequest.pending, (state) => {
        state.deleteRequest = false;
        state.loading = true;
      })
      .addCase(deleteStudentRequest.fulfilled, (state) => {
        state.deleteRequest = true; // Успешный запрос
        state.loading = false;
      })
      .addCase(deleteStudentRequest.rejected, (state) => {
        state.deleteRequest = false; // Ошибка, не удалилось
        state.loading = false;
      });
  },
});

export const { setStudent, setStudentLogout, resetDeleteRequest } =
  studentSlice.actions;
export const studentReducer = studentSlice.reducer;
