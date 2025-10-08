import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGetAllSubjects, fetchGetGoalsBySubject } from "@/api/server/subjectApi";
import { Goal, Subject } from "@/types/types";



// Получение всех топиков
export const getAllSubjects = createAsyncThunk<
  Subject[],
  void,
  { rejectValue: string }
>("subject/getAllSubjects", async (_, { rejectWithValue }) => {
  try {
    return await fetchGetAllSubjects();
  } catch (error: any) {
    console.error("Ошибка загрузки предметов:", error);
    return rejectWithValue(error.message || "Ошибка при загрузке предметов");
  }
});

// --- Получение целей по конкретному предмету ---
export const getGoalsBySubject = createAsyncThunk<
  Goal[],
  string, // subjectId
  { rejectValue: string }
>("subject/getGoalsBySubject", async (subjectId, { rejectWithValue }) => {
  try {
    return await fetchGetGoalsBySubject(subjectId);
  } catch (error: any) {
    console.error(`Ошибка загрузки целей для предмета ${subjectId}:`, error);
    return rejectWithValue(error.message || "Ошибка при загрузке целей");
  }
});

type subjectState = {
  subjects: Subject[];
  goals: Goal[];
  loading: boolean;
};

const initialState: subjectState = {
  subjects: [],
  goals: [],
  loading: false,
};

const sudjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Предметы ---
      .addCase(getAllSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllSubjects.fulfilled,
        (state, action: PayloadAction<Subject[]>) => {
          state.subjects = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAllSubjects.rejected, (state) => {
        state.loading = false;
      })

       // --- Цели по предмету ---
      .addCase(getGoalsBySubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGoalsBySubject.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.goals = action.payload;
        state.loading = false;
      })
      .addCase(getGoalsBySubject.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const subjectReducer = sudjectSlice.reducer;
