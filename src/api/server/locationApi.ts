import { City } from "@/types/types";
import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

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
export const fetchGetCityById = async (cityId: string): Promise<City> => {
  try {
    const response = await fetch(`${baseUrl}cities/${cityId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const cityData = await response.json();
    return cityData
    
  } catch (error) {
    console.error("Ошибка при получении slug города:", error);
    throw error;
  }
};

// type GetCityBySlug = {
//   title: string,
//   region_name_dative: string,
// }

// Получение города по ID (пока используем только для мидлвара подставления slug в url - spb/ekb/kzn/novgorod и тд)
export const fetchGetCityBySlug = async (slug: string): Promise<City> => {
  try {
    const response = await fetch(`${baseUrl}city-slug/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const cityData = await response.json();
    return cityData;
    
  } catch (error) {
    console.error("Ошибка при получении города по slug:", error);
    return {
      id: '',
      title: 'Москва',
      area: 'Московская область',
      shortTitle: 'Москва и область',
      slug: 'msk',
      region_name_dative: 'Москве и области',
      metros: [],
      districts: [],
      regionalCities: [],
    } // ✅ Фолбэк на Москву при ошибке
    //  throw error;
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

// interface FetchRegionParams {
//   set_cookie?: boolean;
//   region_id?: string;
// }

// export async function fetchDetectUserRegion(params?: FetchRegionParams) {
//   try {
//     const urlParams = new URLSearchParams();
    
//     if (params?.set_cookie) urlParams.append('set_cookie', 'true');
//     if (params?.region_id) urlParams.append('region_id', params.region_id);
    
//     const queryString = urlParams.toString();
//     const url = `${baseUrl}region${queryString ? `?${queryString}` : ''}`;
    
//     // ✅ На сервере передаем куки из headers
//     const headers: HeadersInit = {};
    
//     if (typeof window === 'undefined') {
//       // Это SSR - получаем куки из next/headers
//       const { cookies } = await import('next/headers');
//       const cookieStore = await cookies();
//       const regionCookie = await cookieStore.get('region-id');
      
//       console.log('🔍 SSR Debug - regionCookie:', regionCookie); // ✅ Логи
      
//       if (regionCookie) {
//         headers.Cookie = `region-id=${regionCookie.value}`;
//         console.log('🍪 SSR: Передаем куку в API:', regionCookie.value);
//       } else {
//         console.log('❌ SSR: Кука region-id не найдена');
//       }
//     } else {
//       console.log('🌐 Клиентский запрос');
//     }
    
//     console.log('🔍 Заголовки запроса:', headers); // ✅ Логи
    
//     const res = await fetch(url, { 
//       headers,
//       cache: 'no-store'
//     });
    
//     if (!res.ok) throw new Error(`Status: ${res.status}`);
//     return await res.json();
//   } catch (err) {
//     console.error("Ошибка fetchDetectUserRegion:", err);
//     throw err;
//   }
// }

// Тип ответа от API при определении региона
export type DetectRegionResponse = {
  city: City; // Объект города из базы
  askUserConfirmation: boolean; // Флаг — нужно ли спрашивать пользователя
};

// ✅ Обновлённая функция получения региона пользователя
// Теперь принимает slug (например, "spb") и опционально test_ip для тестов
export const fetchDetectUserRegion = async (slug?: string, test_ip?: string) => {
  try {
    // Создаём объект query-параметров
    const urlParams = new URLSearchParams();

    // 🔹 Передаём текущий slug региона (например "spb" или пустую строку, если "/")
    if (slug) urlParams.append("slug", slug);

    // 🔹 test_ip — используется только в dev для тестирования
    if (test_ip) urlParams.append("test_ip", test_ip);

    // Собираем строку запроса
    const queryString = urlParams.toString();
    const url = `${baseUrl}region${queryString ? `?${queryString}` : ""}`;

    // 🚀 Делаем запрос без кеширования, чтобы всегда получать актуальные данные
    const res = await fetch(url, { cache: "no-store" });

    // Проверяем ответ
    if (!res.ok) throw new Error(`Status: ${res.status}`);

    // Парсим JSON
    const data: DetectRegionResponse = await res.json();

    // Возвращаем полученный объект
    return data;
  } catch (err) {
    console.error("❌ Ошибка fetchDetectUserRegion:", err);
    throw err;
  }
};
