import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Topic, Theme } from "@/types/types";
import {
  fetchCreateTheme,
  fetchCreateTopic,
  fetchDeleteTheme,
  fetchDeleteTopic,
  fetchGetAllTopics,
  fetchGetThemeById,
  fetchGetThemesByTopic,
  fetchGetTopicById,
  fetchUpdateTheme,
  fetchUpdateTopic,
} from "@/api/server/wikiApi";

// Создание нового топика
export const createTopic = createAsyncThunk<
  Topic,
  {
    topic: Omit<Topic, "id" | "createdAt" | "updatedAt" | "themes">;
    token: string;
  }
>("wiki/createTopic", async ({ topic, token }) => {
  try {
    return await fetchCreateTopic(token, topic);
  } catch (error) {
    console.error("Ошибка создания топика:", error);
    throw error;
  }
});

// Получение всех топиков
export const getAllTopics = createAsyncThunk<
  Topic[],
  string,
  { rejectValue: string }
>("wiki/getAllTopics", async (token, { rejectWithValue }) => {
  try {
    return await fetchGetAllTopics(token);
  } catch (error: any) {
    console.error("Ошибка загрузки топиков:", error);
    return rejectWithValue(error.message || "Ошибка при загрузке топиков");
  }
});

// Получение топика по ID
export const getTopicById = createAsyncThunk<
  Topic,
  { id: string; token: string },
  { rejectValue: string }
>("wiki/getTopicById", async ({ id, token }, { rejectWithValue }) => {
  try {
    return await fetchGetTopicById(id, token);
  } catch (error: any) {
    console.error("Ошибка загрузки топика:", error);
    return rejectWithValue(error.message || "Ошибка при загрузке топика");
  }
});

// Обновление топика
export const updateTopic = createAsyncThunk<
  Topic,
  { id: string; updatedTopic: Partial<Topic>; token: string }
>(
  "wiki/updateTopic",
  async ({ id, updatedTopic, token }, { rejectWithValue }) => {
    try {
      return await fetchUpdateTopic(id, updatedTopic, token);
    } catch (error: any) {
      console.error("Ошибка обновления топика:", error);
      return rejectWithValue(error.message || "Ошибка при обновлении топика");
    }
  }
);

// Удаление топика
export const deleteTopic = createAsyncThunk<
  string,
  { id: string; token: string }
>("wiki/deleteTopic", async ({ id, token }, { rejectWithValue }) => {
  try {
    await fetchDeleteTopic(id, token);
    return id;
  } catch (error: any) {
    console.error("Ошибка удаления топика:", error);
    return rejectWithValue(error.message || "Ошибка при удалении топика");
  }
});

// Получение тем для конкретного топика
export const getThemesByTopic = createAsyncThunk<
  { topicId: string; themes: Theme[] },
  { topicId: string; token: string }
>("wiki/getThemesByTopic", async ({ topicId, token }, { rejectWithValue }) => {
  try {
    const themes = await fetchGetThemesByTopic(topicId, token);
    return { topicId, themes };
  } catch (error: any) {
    console.error("Ошибка загрузки тем:", error);
    return rejectWithValue(error.message || "Ошибка при загрузке тем");
  }
});

// Создание новой темы
export const createTheme = createAsyncThunk<
  Theme,
  {
    topicId: string;
    newTheme: Omit<Theme, "id" | "createdAt" | "updatedAt">;
    token: string;
  }
>(
  "wiki/createTheme",
  async ({ topicId, newTheme, token }, { rejectWithValue }) => {
    try {
      return await fetchCreateTheme(topicId, newTheme, token);
    } catch (error: any) {
      console.error("Ошибка создания темы:", error);
      return rejectWithValue(error.message || "Ошибка при создании темы");
    }
  }
);

// Получение темы по ID
export const getThemeById = createAsyncThunk<
  Theme,
  { themeId: string; token: string }
>("wiki/getThemeById", async ({ themeId, token }, { rejectWithValue }) => {
  try {
    return await fetchGetThemeById(themeId, token);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Обновление темы
export const updateTheme = createAsyncThunk<
  Theme,
  { themeId: string; updatedTheme: Partial<Theme>; token: string }
>(
  "wiki/updateTheme",
  async ({ themeId, updatedTheme, token }, { rejectWithValue }) => {
    try {
      return await fetchUpdateTheme(themeId, updatedTheme, token);
    } catch (error: any) {
      console.error("Ошибка обновления темы:", error);
      return rejectWithValue(error.message || "Ошибка при обновлении темы");
    }
  }
);

// Удаление темы
export const deleteTheme = createAsyncThunk<
  { topicId: string; themeId: string },
  { topicId: string; themeId: string; token: string }
>(
  "wiki/deleteTheme",
  async ({ topicId, themeId, token }, { rejectWithValue }) => {
    try {
      await fetchDeleteTheme(themeId, token);
      return { topicId, themeId };
    } catch (error: any) {
      console.error("Ошибка удаления темы:", error);
      return rejectWithValue(error.message || "Ошибка при удалении темы");
    }
  }
);

type wikiState = {
  topics: Topic[];
  themes: Theme[];
  loading: boolean;
};

const initialState: wikiState = {
  topics: [],
  themes: [],
  loading: false,
};

const wikiSlice = createSlice({
  name: "wiki",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Топики ---
      .addCase(getAllTopics.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllTopics.fulfilled,
        (state, action: PayloadAction<Topic[]>) => {
          state.topics = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAllTopics.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.topics.push(action.payload);
      })
      .addCase(updateTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        const index = state.topics.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.topics[index] = action.payload;
      })
      .addCase(
        deleteTopic.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.topics = state.topics.filter(
            (topic) => topic.id !== action.payload
          );
        }
      )

      // --- Темы ---
      .addCase(
        getThemesByTopic.fulfilled,
        (
          state,
          action: PayloadAction<{ topicId: string; themes: Theme[] }>
        ) => {
          const topic = state.topics.find(
            (t) => t.id === action.payload.topicId
          );
          if (topic) {
            topic.themes = action.payload.themes;
          }
          // Обновляем глобальный список тем
          state.themes = action.payload.themes;
        }
      )
      .addCase(createTheme.fulfilled, (state, action: PayloadAction<Theme>) => {
        const topic = state.topics.find((t) => t.id === action.payload.topicId);
        if (topic) {
          topic.themes = topic.themes || []; // Если undefined, то создаем пустой массив
          topic.themes.push(action.payload);
        }
      })
      .addCase(updateTheme.fulfilled, (state, action: PayloadAction<Theme>) => {
        state.topics.forEach((topic) => {
          if (!topic.themes) return; // Если тем нет, пропускаем топик

          const index = topic.themes.findIndex(
            (theme) => theme.id === action.payload.id
          );
          if (index !== -1) {
            topic.themes[index] = action.payload;
          }
        });
      })
      .addCase(
        deleteTheme.fulfilled,
        (
          state,
          action: PayloadAction<{ topicId: string; themeId: string }>
        ) => {
          const topic = state.topics.find(
            (t) => t.id === action.payload.topicId
          );
          if (topic?.themes) {
            topic.themes = topic.themes.filter(
              (theme) => theme.id !== action.payload.themeId
            );
          }
        }
      );
  },
});

export const wikiReducer = wikiSlice.reducer;
