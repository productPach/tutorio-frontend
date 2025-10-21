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

// Получение города по ID (пока используем только для мидлвара подставления slug в url - spb/ekb/kzn/novgorod и тд)
export const fetchGetCitySlugById = async (cityId: string): Promise<string> => {
  try {
    const response = await fetch(`${baseUrl}cities/${cityId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const cityData = await response.json();
    return cityData.slug || 'msk'; // ✅ Возвращаем slug или Москву по умолчанию
    
  } catch (error) {
    console.error("Ошибка при получении slug города:", error);
    return 'msk'; // ✅ Фолбэк на Москву при ошибке
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

export async function fetchDetectUserRegion(params?: FetchRegionParams) {
  try {
    const urlParams = new URLSearchParams();
    
    if (params?.set_cookie) urlParams.append('set_cookie', 'true');
    if (params?.region_id) urlParams.append('region_id', params.region_id);
    
    const queryString = urlParams.toString();
    const url = `${baseUrl}region${queryString ? `?${queryString}` : ''}`;
    
    // ✅ На сервере передаем куки из headers
    const headers: HeadersInit = {};
    
    if (typeof window === 'undefined') {
      // Это SSR - получаем куки из next/headers
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const regionCookie = await cookieStore.get('region-id');
      
      console.log('🔍 SSR Debug - regionCookie:', regionCookie); // ✅ Логи
      
      if (regionCookie) {
        headers.Cookie = `region-id=${regionCookie.value}`;
        console.log('🍪 SSR: Передаем куку в API:', regionCookie.value);
      } else {
        console.log('❌ SSR: Кука region-id не найдена');
      }
    } else {
      console.log('🌐 Клиентский запрос');
    }
    
    console.log('🔍 Заголовки запроса:', headers); // ✅ Логи
    
    const res = await fetch(url, { 
      headers,
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Ошибка fetchDetectUserRegion:", err);
    throw err;
  }
}