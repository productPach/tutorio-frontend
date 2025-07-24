import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Chat, Message, TypeMessage, TypeRecipientRoleMessage } from "@/types/types"; // Подставь нужные типы
import { fetchCreateChat, fetchGetChatById, fetchGetChatsByOrderId, fetchGetChatsByUserIdAndRole, fetchSendMessage, fetchUpdateChat, fetchUpdateMessage } from "@/api/server/chatApi";

type ChatStateType = {
  chat: Chat | null;
  chats: Chat[];
  messages: Message[];
  loading: boolean;
  error: string | null;
};

// Создание чата
export const createChat = createAsyncThunk<
  Chat, // что возвращаем при успехе
  {
    tutorId: string;
    studentId: string;
    orderId: string;
    initiatorRole: "student" | "tutor";
    themeOrder: string;
    status: string;
    token: string;
  },
  {
    rejectValue: {
      status: number;
      message: string;
    };
  }
>(
  "chat/create",
  async (
    { tutorId, studentId, orderId, initiatorRole, themeOrder, status, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchCreateChat(
        tutorId,
        studentId,
        orderId,
        initiatorRole,
        themeOrder,
        status,
        token
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({
        status: error?.status || 500,
        message: error?.message || "Ошибка при создании чата",
      });
    }
  }
);

// Обновление чата
export const updateChat = createAsyncThunk<
  Chat, // что возвращаем
  {
    chatId: string;
    tutorHasAccess?: boolean;
    status?: string;
    token: string;
  }
>("chat/update", async ({ chatId, tutorHasAccess, status, token }) => {
  const response = await fetchUpdateChat(chatId, tutorHasAccess, status, token);
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
    type?: TypeMessage;
    recipientRole?: TypeRecipientRoleMessage;
  }
>("chat/sendMessage", async ({ chatId, senderId, orderId, themeOrder, text, token, type, recipientRole }) => {
  const response = await fetchSendMessage(chatId, senderId, orderId, themeOrder, text, token, type, recipientRole);
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
  { orderId: string; role: string, token: string } // что принимаем
>("chat/getByOrderId", async ({ orderId, role, token }) => {
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
        // Обновляем статус и доступ
        //state.chat.status = "Active";
        //state.chat.tutorHasAccess = true;
      }
    },
    // Экшен для обновления чата для ученика, чтобы сделать чат активным
    updateChatForAccept: (state) => {
      if (state.chat) {
        // Обновляем статус и доступ
        state.chat.status = "Active";
        state.chat.tutorHasAccess = true;
      }
    },
    // Экшен для обновления чата для ученика, чтобы вывести уведомления об отказе репетитора от заказа
    updateChatForReject: (state) => {
      if (state.chat) {
        // Обновляем статус и доступ
        state.chat.status = "Rejected";
        state.chat.tutorHasAccess = false;
      }
    },
    updateChatForContract: (state, action: PayloadAction<{ tutorId: string }>) => {
      if (state.chat) {
        if (!state.chat.order.contracts) {
          state.chat.order.contracts = [];
        }
        state.chat.order.contracts.push(action.payload);
      }
    },
    markMessagesAsRead: (state, action) => {
      const { chatId, messageIds } = action.payload;
      if (state.chat && state.chat.id === chatId) {
        state.chat.messages = state.chat.messages.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        );
      }
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
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
        // Обновляем чаты, добавляя новое сообщение и обновляя поле lastMessage
        const updatedChats = state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload],
                lastMessage: action.payload,  // Обновляем поле lastMessage
              }
            : chat
        );
        state.chats = updatedChats; // Обновляем список чатов
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

export const { setChat, setMessages, addMessageToChat, updateChatForAccept, updateChatForReject, updateChatForContract, markMessagesAsRead, setChats, resetChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;