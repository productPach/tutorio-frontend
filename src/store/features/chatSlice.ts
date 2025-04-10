import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Chat, Message } from "@/types/types"; // Подставь нужные типы
import { fetchCreateChat, fetchGetChatById, fetchGetChatsByOrderId, fetchGetChatsByUserIdAndRole, fetchSendMessage, fetchUpdateMessage } from "@/api/server/chatApi";

type ChatStateType = {
  chat: Chat | null;
  chats: Chat[];
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
    orderId: string;
    themeOrder: string;
    text: string;
    token: string;
  }
>("chat/sendMessage", async ({ chatId, senderId, orderId, themeOrder, text, token }) => {
  const response = await fetchSendMessage(chatId, senderId, orderId, themeOrder, text, token);
  return response;
});

// Обновление сообщения
export const updateMessage = createAsyncThunk<
  Message,
  {
    messageId: string;
    text?: string;
    studentId: string;
    tutorId?: string;
    isRead?: boolean;
    token: string;
  }
>("chat/updateMessage", async ({ messageId, text, studentId, tutorId, isRead, token }) => {
  const response = await fetchUpdateMessage(messageId, text, studentId, tutorId, isRead, token);
  return response;
});

// Получение всех чатов по заказу
export const getChatsByOrderId = createAsyncThunk<
  Chat[], // что возвращаем
  { orderId: string; token: string } // что принимаем
>("chat/getByOrderId", async ({ orderId, token }) => {
  const response = await fetchGetChatsByOrderId(orderId, token);
  return response;
});


// Получение чата по ID
export const getChatById = createAsyncThunk<
  Chat, // что возвращаем
  { chatId: string; token: string } // что принимаем
>("chat/getById", async ({ chatId, token }) => {
  const response = await fetchGetChatById(chatId, token);
  return response;
});

// Получение всех чатов для пользователя (студента или репетитора)
export const getChatsByUserId = createAsyncThunk<
  Chat[], // что возвращаем
  { userId: string; role: "student" | "tutor"; token: string } // что принимаем
>("chat/getByUserId", async ({ userId, role, token }) => {
  const response = await fetchGetChatsByUserIdAndRole(userId, role, token);
  return response;
});


const initialState: ChatStateType = {
  chat: null,
  chats: [],
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<Chat | null>) => {
      state.chat = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    // Новый экшен для добавления сообщения в выбранный чат
    addMessageToChat: (state, action: PayloadAction<Message>) => {
      if (state.chat) {
        // Вместо push используем новый массив
        state.chat.messages = [...state.chat.messages, action.payload];
      }
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
        if (state.chat && state.chat.id === action.payload.id) {
          // Если чат уже существует, обновляем его, иначе добавляем новый
          state.chat = { ...state.chat, ...action.payload };
        } else {
          state.chat = action.payload; // новый чат
        }
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
        state.messages.push(action.payload); // добавляем новое сообщение
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "Не удалось отправить сообщение";
        console.error(action.error);
      })

      // updateMessage
      .addCase(updateMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        const updated = action.payload;
      
        // Если сообщение уже есть в chat
        const chatIndex = state.chat?.messages.findIndex((m) => m.id === updated.id);
      
        // Проверка на отсутствие сообщения в чате
        if (chatIndex !== undefined && chatIndex !== -1 && state.chat) {
          // Обновляем сообщение в самом объекте chat
          state.chat.messages[chatIndex] = updated;
        }
      
        // Также обновляем сам массив сообщений, если он отдельный
        const index = state.messages.findIndex((m) => m.id === updated.id);
        if (index !== -1) {
          state.messages[index] = updated; // обновляем сообщение
        }
      
        state.loading = false;
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "Не удалось обновить сообщение";
        console.error(action.error);
      })

      // --- getChatById ---
      .addCase(getChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatById.fulfilled, (state, action) => {
        state.chat = action.payload;
        state.loading = false;
      })
      .addCase(getChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка при загрузке чата";
      })

      // --- getChatsByOrderId ---
      .addCase(getChatsByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatsByOrderId.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(getChatsByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка при загрузке списка чатов";
      })
      
      // --- getChatsByUserId ---
      .addCase(getChatsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatsByUserId.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(getChatsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка при загрузке списка чатов";
      });
      
  },
});

export const { setChat, setMessages, addMessageToChat, resetChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
