import { District, Metro, RegionalCity } from "@/types/types";

const token = "59e590bc5ae2c3975912f9ace2aedfe5f36014c4";

export const getAdressDadata = async (query: string) => {
  const response = await fetch(
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
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
// export const getLocation = async (
//   query: string,
//   city: string, // Новый параметр для фильтрации по городу
//   selectedValues: (District | Metro | RegionalCity)[],
//   locations: { title: string; districts: District[]; regionalCities: RegionalCity[] }[] // Добавляем параметр locations
// ): Promise<{ districts: District[]; metros: Metro[]; regionalCities: RegionalCity[] }> => {
//   const normalizedQuery = query.toLowerCase();
//   const normalizedCity = city.toLowerCase();

//   // Находим город по названию
//   const cityData = locations.find(
//     (location) => location.title.toLowerCase() === normalizedCity
//   );

//   // Если город не найден, возвращаем пустой массив
//   if (!cityData) {
//     return { districts: [], metros: [], regionalCities: [] };
//   }

//   // Фильтруем районы, которые соответствуют запросу
//   const filteredDistricts: District[] = cityData.districts.filter((district) =>
//     district.title.toLowerCase().includes(normalizedQuery)
//   );

//   // Собираем станции метро, которые соответствуют запросу
//   const filteredMetros: Metro[] = cityData.districts
//     .flatMap((district) => district.metros)
//     .filter(
//       (metro) => metro.title.toLowerCase().includes(normalizedQuery)
//       // Поиск по линиям метро
//       //||
//       //metro.lineName.toLowerCase().includes(normalizedQuery)
//     );

//   // Фильтруем областные города, которые соответствуют запросу
//   const filteredRegionalCities: RegionalCity[] = cityData.regionalCities.filter((regionalCity) =>
//     regionalCity.title.toLowerCase().includes(normalizedQuery)
//   );

//   // Объединяем результаты и фильтруем выбранные значения
//   // const combinedResults = [...filteredDistricts, ...filteredMetros].filter(
//   //   (location) =>
//   //     !selectedValues.some((selected) => selected.id === location.id)
//   // );

//   // return combinedResults.slice(0, 10); // Возвращаем не более 10 элементов

//   return {
//     districts: filteredDistricts,
//     metros: filteredMetros,
//     regionalCities: filteredRegionalCities,
//   };
// };
// Метод для получения данных из районов и станций метро
export const getLocation = async (
  query: string,
  city: string,
  selectedValues: (District | Metro | RegionalCity)[],
  locations: { title: string; districts: District[]; regionalCities: RegionalCity[] }[]
): Promise<{
  districts: (District & { title: string; displayType: string })[];
  metros: (Metro & { displayTitle: string; displayType: string })[];
  regionalCities: (RegionalCity & { displayTitle: string; displayType: string })[];
}> => {
  const normalizedQuery = query.toLowerCase();
  const normalizedCity = city.toLowerCase();

  const cityData = locations.find(
    (location) => location.title.toLowerCase() === normalizedCity
  );

  if (!cityData) {
    return { districts: [], metros: [], regionalCities: [] };
  }

  const filteredDistricts = cityData.districts
    .filter((district) => district.title.toLowerCase().includes(normalizedQuery))
    .map((district) => ({
      ...district,
      title: district.title,
      displayType:
        district.type === "Area"
          ? "район"
          : district.type === "Microarea"
          ? "микрорайон"
          : "",
    }));

  const filteredMetros = cityData.districts
    .flatMap((district) => district.metros ?? [])
    .filter((metro) => metro.title.toLowerCase().includes(normalizedQuery))
    .map((metro) => ({
      ...metro,
      displayTitle: metro.title,
      displayType: "метро",
    }));

  const filteredRegionalCities = cityData.regionalCities
    .filter((rc) => rc.title.toLowerCase().includes(normalizedQuery))
    .map((rc) => ({
      ...rc,
      displayTitle: rc.title,
      displayType: "город",
    }));

  return {
    districts: filteredDistricts,
    metros: filteredMetros,
    regionalCities: filteredRegionalCities,
  };
};






// Метод для получения всех локаций города
export const getLocationForCity = async (
  city: string, // параметр для фильтрации по городу
  locations: { title: string; districts: District[]; regionalCities: RegionalCity[] }[] // Добавляем параметр locations
): Promise<(District | Metro)[]> => {
  const normalizedCity = city.toLowerCase();

  // Находим город по названию
  const cityData = locations.find(
    (location) => location.title.toLowerCase() === normalizedCity
  );

  // Если город не найден, возвращаем пустой массив
  if (!cityData) {
    return [];
  }

  // Собираем и преобразуем районы в формат District
  const filteredDistricts: District[] = cityData.districts.map((district) => ({
    id: district.id,
    title: district.title,
    type: district.type,
    metros: district.metros
    // Добавьте другие поля, если необходимо
  }));

  // Собираем и преобразуем станции метро в формат Metro
  const filteredMetros: Metro[] = cityData.districts
    .flatMap((district) => district.metros)
    .map((metro) => ({
      id: metro.id,
      title: metro.title,
      color: metro.color, // Предполагаем, что эти поля есть
      lineName: metro.lineName,
      lineNumber: metro.lineNumber,
    }));

  // Возвращаем объединённый массив районов и метро
  return [...filteredDistricts, ...filteredMetros];
};

