import { fetchCurrentStudent } from "@/api/server/studentApi";
import { Student } from "@/types/types";
import { setLocalStorage } from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getCurrentStudent = createAsyncThunk<Student, string>(
  'student/current',
  async (token) => {
    try {
      const response = await fetchCurrentStudent(token);
      return response;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      return undefined; // Или выбросить ошибку, если это необходимо
    }
  }
);

type StudentStateType =  {
    student: null | Student;
    loading: boolean;
}

const initialState: StudentStateType = {
    student: null,
    loading: false,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Student>) => {
      state.student = action.payload;
    },
  },
  extraReducers(builder) {
    builder
    .addCase(getCurrentStudent.fulfilled,
      (state, action: PayloadAction<Student>) => {
        if (action.payload) { // Проверяем на наличие данных
          state.student = action.payload;
          setLocalStorage("student", state.student);
        } else {
          state.student = null; // Обнуляем студента
        }
        state.loading = false; // Завершаем загрузку
      })
    .addCase(getCurrentStudent.pending,
      (state,) => {
        state.loading = true;
      })
    .addCase(getCurrentStudent.rejected,
      (state) => {
        state.loading = false;
      })
  }
});

export const { setStudent } = studentSlice.actions;
export const studentReducer = studentSlice.reducer;