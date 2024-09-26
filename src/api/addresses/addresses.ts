import { District, Metro } from "@/types/types";
import { locations } from "@/utils/locations/locations";

const token = "59e590bc5ae2c3975912f9ace2aedfe5f36014c4";

export const getAdressDadata = async (query: string) => {
  const response = await fetch(
    "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        query: query,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Не удалось отправить адрес");
  }
  const data = await response.json();
  return data;
};

// Метод для получения данных из районов и станций метро
export const getLocation = async (
  query: string,
  city: string, // Новый параметр для фильтрации по городу
  selectedValues: (District | Metro)[]
): Promise<(District | Metro)[]> => {
  const normalizedQuery = query.toLowerCase();
  const normalizedCity = city.toLowerCase();

  // Находим город по названию
  const cityData = locations.find(
    (location) => location.title.toLowerCase() === normalizedCity
  );

  // Если город не найден, возвращаем пустой массив
  if (!cityData) {
    return [];
  }

  // Фильтруем районы, которые соответствуют запросу
  const filteredDistricts: District[] = cityData.districts.filter((district) =>
    district.title.toLowerCase().includes(normalizedQuery)
  );

  // Собираем станции метро, которые соответствуют запросу
  const filteredMetros: Metro[] = cityData.districts
    .flatMap((district) => district.metros)
    .filter(
      (metro) => metro.title.toLowerCase().includes(normalizedQuery)
      // Поиск по линиям метро
      //||
      //metro.lineName.toLowerCase().includes(normalizedQuery)
    );

  // Объединяем результаты и фильтруем выбранные значения
  const combinedResults = [...filteredDistricts, ...filteredMetros].filter(
    (location) =>
      !selectedValues.some((selected) => selected.id === location.id)
  );

  return combinedResults.slice(0, 10); // Возвращаем не более 10 элементов
};

// export const getLocationInCityDadata = async (query: string, city: string) => {
//   const getAddressData = async () => {
//     const response = await fetch(
//       "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({
//           query: query,
//           locations: [{ city: city }],
//           count: 10,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Ошибка при получении данных");
//     }
//     return response.json();
//   };

//   const getMetroStations = async () => {
//     const response = await fetch(
//       "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/metro",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({
//           query: query,
//           filters: [
//             {
//               city: city,
//             },
//           ],
//           count: 10,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Ошибка при получении станций метро");
//     }
//     return response.json();
//   };

//   const getLocalities = async () => {
//     const response = await fetch(
//       "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({
//           query: query,
//           locations: [{ city: city }],
//           count: 10,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Ошибка при получении городов области");
//     }
//     return response.json();
//   };

//   try {
//     const [addressData, metroStationsData, localitiesData] = await Promise.all([
//       getAddressData(),
//       getMetroStations(),
//       getLocalities(),
//     ]);

//     // Фильтруем данные
//     const districts = addressData.suggestions.filter(
//       (item: any) => item.data.fias_level === "8" // Районы
//     );
//     const microdistricts = addressData.suggestions.filter(
//       (item: any) => item.data.fias_level === "9" // Микрорайоны
//     );
//     const localities = localitiesData.suggestions.filter(
//       (item: any) => item.data.fias_level === "6" // Города области
//     );

//     return {
//       districts: districts,
//       microdistricts: microdistricts,
//       metroStations: metroStationsData.suggestions,
//       localities: localities,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error("Ошибка при получении данных: " + error);
//   }
// };
