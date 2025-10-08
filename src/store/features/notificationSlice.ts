import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchConnectTelegramLink } from "@/api/server/notificationApi";



// --- AsyncThunk для получения ссылки Telegram ---
export const getTelegramConnectLink = createAsyncThunk<
  { link: string },
  string,
  { rejectValue: string }
>(
  "telegram/getConnectLink",
  async (tutorId, { rejectWithValue }) => {
    try {
      return await fetchConnectTelegramLink(tutorId);
    } catch (error: any) {
      console.error("Ошибка получения ссылки Telegram:", error);
      return rejectWithValue(error.message || "Ошибка при получении ссылки Telegram");
    }
  }
);

// --- Тип состояния ---
type notificationState = {
  link: string | null;
  loading: boolean;
};

const initialState: notificationState = {
  link: null,
  loading: false,
};

// --- Slice ---
const notificationSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTelegramConnectLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTelegramConnectLink.fulfilled, (state, action: PayloadAction<{ link: string }>) => {
        state.link = action.payload.link;
        state.loading = false;
      })
      .addCase(getTelegramConnectLink.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const notificationReducer = notificationSlice.reducer;
