import { baseUrl } from "./configApi";

// Получение ссылки для подключения Telegram
export const fetchConnectTelegramLink = async (tutorId: string): Promise<{ link: string }> => {
  try {
    const response = await fetch(`${baseUrl}telegram/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tutorId }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении ссылки Telegram:", error);
    throw error;
  }
};