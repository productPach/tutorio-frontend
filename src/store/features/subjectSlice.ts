import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGetAllSubjects } from "@/api/server/subjectApi";
import { Subject } from "@/types/types";



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

type subjectState = {
  subjects: Subject[];
  loading: boolean;
};

const initialState: subjectState = {
  subjects: [],
  loading: false,
};

const sudjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Топики ---
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
  },
});

export const subjectReducer = sudjectSlice.reducer;
