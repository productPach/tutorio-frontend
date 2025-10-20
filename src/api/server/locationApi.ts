import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

// // Получение списка всех городов
// export const fetchGetAllCities = async () => {
//   try {
//     const response = await fetch(`${baseUrl}cities`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // Проверка, был ли запрос успешным
//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     // Парсинг JSON
//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Ошибка при получении данных городов:", error);
//     throw error; // Чтобы обработать ошибку в вызывающем коде, если необходимо
//   }
// }
// Получение списка всех городов
export const fetchGetAllCities = async () => {
  try {
    const response = await httpClient.get(`cities`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при получении данных городов:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// Определяет регион пользователя через backend
export const fetchDetectUserRegion = async () => {
  try {
    const response = await httpClient.get("region");
    return response.data; // объект City из БД
  } catch (error: any) {
    console.error(
      "❌ Ошибка при определении региона пользователя:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};