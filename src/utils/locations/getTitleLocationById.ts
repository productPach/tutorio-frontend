import { locations } from "./locations";

interface TitleWithLine {
    title: string;
    lineNumber?: string; // lineNumber может быть undefined, если это не метро
  }

// Функция для поиска title по id
export const findTitleById = (id: string): TitleWithLine | null => {
    for (const city of locations) {
        // Поиск по массиву метро в каждом районе
        for (const district of city.districts) {
          const metro = district.metros.find((metro) => metro.id === id);
          if (metro) {
            return { title: metro.title, lineNumber: metro.lineNumber }; // Возвращаем title и lineNumber
          }
        }
    
        // Поиск по массиву regionalCities
        const regionalCity = city.regionalCities.find((city) => city.id === id);
        if (regionalCity) {
          return { title: regionalCity.title }; // Возвращаем только title, lineNumber не применимо
        }
      }
    
      // Если ничего не найдено, возвращаем null
      return null;
    }

  export const findTitlesByIds = (ids: string[]): (string | null)[] => {
    return ids.map((id) => {
      for (const city of locations) {
        // Поиск по массиву метро в каждом районе
        for (const district of city.districts) {
          const metro = district.metros.find((metro) => metro.id === id);
          if (metro) return metro.title;
        }
  
        // Поиск по массиву regionalCities
        const regionalCity = city.regionalCities.find((city) => city.id === id);
        if (regionalCity) return regionalCity.title;
      }
  
      // Если ничего не найдено, возвращаем null для текущего id
      return null;
    });
  }