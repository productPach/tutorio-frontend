import { Chat } from "@/types/types";
import { baseUrl } from "./configApi";

// Создание чата
export const fetchCreateChat = async (
    tutorId: string,
    studentId: string,
    orderId: string,
    initiatorRole: "student" | "tutor",
    themeOrder: string,
    status: string,
    token: string
  ) => {
    const response = await fetch(`${baseUrl}chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tutorId,
        studentId,
        orderId,
        themeOrder,
        initiatorRole,
        status,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при создании чата");
    }
  
    const data = await response.json();
    return data;
  };

  // Обновление чата
export const fetchUpdateChat = async (
  chatId: string,
  tutorHasAccess?: boolean,
  status?: string,
  token?: string
): Promise<Chat> => {
  const res = await fetch(`${baseUrl}/chat`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chatId,
      ...(tutorHasAccess !== undefined ? { tutorHasAccess } : {}),
      ...(status !== undefined ? { status } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error("Не удалось обновить чат");
  }

  return res.json();
};


// Отправка сообщения
export const fetchSendMessage = async (
    chatId: string,
    senderId: string,
    orderId: string,
    themeOrder: string,
    text: string,
    token: string
  ) => {
    const response = await fetch(`${baseUrl}message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatId,
        senderId,
        orderId,
        themeOrder,
        text,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при отправке сообщения");
    }
  
    const data = await response.json();
    return data;
  };

// Обновление сообщения
export const fetchUpdateMessage = async (
  messageId: string,
  text?: string,
  studentId?: string,
  tutorId?: string,
  isRead?: boolean,
  token?: string
) => {
  const response = await fetch(`${baseUrl}message`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messageId,
      ...(text !== undefined ? { text } : {}),
      ...(isRead !== undefined ? { isRead } : {}),
      studentId,
      tutorId,
    }),
    
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при обновлении сообщения");
  }

  const data = await response.json();
  return data;
};

// Получение всех чатов по заказу
export const fetchGetChatsByOrderId = async (orderId: string, token?: string) => {
  const response = await fetch(`${baseUrl}order/${orderId}/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при получении чатов по заказу");
  }

  const data = await response.json();
  return data;
};

// Получение чата по ID
export const fetchGetChatById = async (chatId: string, token?: string) => {
  const response = await fetch(`${baseUrl}chat/${chatId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при получении чата");
  }

  const data = await response.json();
  return data;
};

// Получение всех чатов для пользователя (студента или репетитора)
export const fetchGetChatsByUserIdAndRole = async (
  userId: string,
  role: "student" | "tutor",
  token?: string
) => {
  const response = await fetch(`${baseUrl}user/${userId}/role/${role}/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при получении чатов для пользователя");
  }

  const data = await response.json();
  return data;
};

