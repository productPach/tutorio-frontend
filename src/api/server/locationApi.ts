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
// export const fetchDetectUserRegion = async () => {
//   try {
//     const response = await httpClient.get("region");
//     return response.data; // объект City из БД
//   } catch (error: any) {
//     console.error(
//       "❌ Ошибка при определении региона пользователя:",
//       error.response?.status,
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

interface FetchRegionParams {
  set_cookie?: boolean;
  region_id?: string;
}

// export async function fetchDetectUserRegion(params?: FetchRegionParams) {
//   try {
//     const res = await fetch(`${baseUrl}region`);
//     if (!res.ok) throw new Error(`Status: ${res.status}`);
//     return await res.json();
//   } catch (err) {
//     console.error("Ошибка fetchDetectUserRegion:", err);
//     throw err;
//   }
// }

export async function fetchDetectUserRegion(params?: FetchRegionParams) {
  try {
    const urlParams = new URLSearchParams();
    
    if (params?.set_cookie) urlParams.append('set_cookie', 'true');
    if (params?.region_id) urlParams.append('region_id', params.region_id);
    
    const queryString = urlParams.toString();
    const url = `${baseUrl}region${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Ошибка fetchDetectUserRegion:", err);
    throw err;
  }
}