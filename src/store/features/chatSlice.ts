import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Chat, Message } from "@/types/types"; // Подставь нужные типы
import { fetchCreateChat, fetchSendMessage } from "@/api/server/chatApi";

type ChatStateType = {
  chat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
};

// Создание чата
export const createChat = createAsyncThunk<
  Chat, // что возвращаем
  {
    tutorId: string;
    studentId: string;
    orderId: string;
    initiatorRole: "student" | "tutor";
    token: string;
  }
>("chat/create", async ({ tutorId, studentId, orderId, initiatorRole, token }) => {
  const response = await fetchCreateChat(tutorId, studentId, orderId, initiatorRole, token);
  return response;
});

// Отправка сообщения
export const sendMessage = createAsyncThunk<
  Message,
  {
    chatId: string;
    senderId: string;
    text: string;
    token: string;
  }
>("chat/sendMessage", async ({ chatId, senderId, text, token }) => {
  const response = await fetchSendMessage(chatId, senderId, text, token);
  return response;
});

const initialState: ChatStateType = {
  chat: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<Chat>) => {
      state.chat = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    resetChat: (state) => {
      state.chat = null;
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createChat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chat = action.payload;
        state.loading = false;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = "Не удалось создать чат";
        console.error(action.error);
      })

      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "Не удалось отправить сообщение";
        console.error(action.error);
      });
  },
});

export const { setChat, setMessages, resetChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
