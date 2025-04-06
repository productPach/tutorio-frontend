import { baseUrl } from "./configApi";

// Создание чата
export const fetchCreateChat = async (
    tutorId: string,
    studentId: string,
    orderId: string,
    initiatorRole: "student" | "tutor",
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
        initiatorRole,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при создании чата");
    }
  
    const data = await response.json();
    return data;
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
  