import { District, Metro, RegionalCity } from "@/types/types";
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
  selectedValues: (District | Metro | RegionalCity)[]
): Promise<{ districts: District[]; metros: Metro[]; regionalCities: RegionalCity[] }> => {
  const normalizedQuery = query.toLowerCase();
  const normalizedCity = city.toLowerCase();

  // Находим город по названию
  const cityData = locations.find(
    (location) => location.title.toLowerCase() === normalizedCity
  );

  // Если город не найден, возвращаем пустой массив
  if (!cityData) {
    return { districts: [], metros: [], regionalCities: [] };
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

  // Фильтруем областные города, которые соответствуют запросу
  const filteredRegionalCities: RegionalCity[] = cityData.regionalCities.filter((regionalCity) =>
    regionalCity.title.toLowerCase().includes(normalizedQuery)
  );

  // Объединяем результаты и фильтруем выбранные значения
  // const combinedResults = [...filteredDistricts, ...filteredMetros].filter(
  //   (location) =>
  //     !selectedValues.some((selected) => selected.id === location.id)
  // );

  // return combinedResults.slice(0, 10); // Возвращаем не более 10 элементов

  return {
    districts: filteredDistricts,
    metros: filteredMetros,
    regionalCities: filteredRegionalCities,
  };
};

// Метод для получения всех локаций города
export const getLocationForCity = async (
  city: string // параметр для фильтрации по городу
): Promise<{ id: string; title: string }[]> => {
  const normalizedCity = city.toLowerCase();

  // Находим город по названию
  const cityData = locations.find(
    (location) => location.title.toLowerCase() === normalizedCity
  );

  // Если город не найден, возвращаем пустой массив
  if (!cityData) {
    return [];
  }

  // Собираем и преобразуем районы в формат { id, title }
  const filteredDistricts: { id: string; title: string }[] = cityData.districts.map((district) => ({
    id: district.id,
    title: district.title
  }));

  // Собираем и преобразуем станции метро в формат { id, title }
  const filteredMetros: { id: string; title: string }[] = cityData.districts
    .flatMap((district) => district.metros)
    .map((metro) => ({
      id: metro.id,
      title: metro.title
    }));

  // Возвращаем объединённый массив районов и метро
  return [...filteredDistricts, ...filteredMetros];
};
