import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCreateReview,
  fetchCreateComment,
  fetchReviewsByTutorId,
  fetchUpdateReview,
} from "@/api/server/reviewApi";
import { Comment, CreateCommentPayload, CreateReviewPayload, Review } from "@/types/types";


// ——— Асинхронные экшены ———

export const createReview = createAsyncThunk<
  Review,
  { payload: CreateReviewPayload },
  { rejectValue: string }
>("review/createReview", async ({ payload }, { rejectWithValue }) => {
  try {
    return await fetchCreateReview(payload);
  } catch (error: any) {
    console.error("Ошибка создания отзыва:", error);
    return rejectWithValue(error.message || "Ошибка при создании отзыва");
  }
});

export const createComment = createAsyncThunk<
  Comment,
  { payload: CreateCommentPayload },
  { rejectValue: string }
>("review/createComment", async ({ payload }, { rejectWithValue }) => {
  try {
    return await fetchCreateComment(payload);
  } catch (error: any) {
    console.error("Ошибка создания комментария:", error);
    return rejectWithValue(error.message || "Ошибка при создании комментария");
  }
});

export const updateReview = createAsyncThunk<
  Review,
  { id: string; payload: { message?: string; rating?: number } },
  { rejectValue: string }
>("review/updateReview", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await fetchUpdateReview(id, payload);
  } catch (error: any) {
    console.error("Ошибка обновления отзыва:", error);
    return rejectWithValue(error.message || "Ошибка при обновлении отзыва");
  }
});

export const getReviewsByTutorId = createAsyncThunk<
  Review[],
  string,
  { rejectValue: string }
>("review/getReviewsByTutorId", async (tutorId, { rejectWithValue }) => {
  try {
    return await fetchReviewsByTutorId(tutorId);
  } catch (error: any) {
    console.error("Ошибка получения отзывов:", error);
    return rejectWithValue(error.message || "Ошибка при получении отзывов");
  }
});

// ——— Слайс состояния ———

type ReviewState = {
  reviews: Review[];
  loading: boolean;
  error: string | null;
};

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null as string | null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<Review[]>) {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ——— Создание отзыва ———
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
        state.loading = false;
      })
      .addCase(createReview.rejected, (state) => {
        state.loading = false;
      })

      // ——— Создание комментария ———
      .addCase(createComment.fulfilled, (state, action) => {
        const comment = action.payload;
        if (!comment.reviewId) return; // безопасный выход
        const review = state.reviews.find((r) => r.id === comment.reviewId);
        if (review) {
          review.comments.push(comment);
        }
      })

      // ---- updateReview ----
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка обновления отзыва";
      })

      // ——— Загрузка отзывов репетитора ———
      .addCase(getReviewsByTutorId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsByTutorId.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loading = false;
      })
      .addCase(getReviewsByTutorId.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setReviews } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
