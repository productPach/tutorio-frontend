import { baseUrl } from "./configApi";

// Получение списка всех городов
export const fetchGetAllCities = async () => {
  try {
    const response = await fetch(`${baseUrl}cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Проверка, был ли запрос успешным
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    // Парсинг JSON
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при получении данных городов:", error);
    throw error; // Чтобы обработать ошибку в вызывающем коде, если необходимо
  }
}