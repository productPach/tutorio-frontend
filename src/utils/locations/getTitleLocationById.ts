import { City } from "@/types/types";

interface TitleWithLine {
    title: string;
    lineNumber?: string; // lineNumber может быть undefined, если это не метро
    cityPrefix?: string;
  }

// Функция для поиска title по id
// export const findLocTitleById = (id: string, locations: City[]): TitleWithLine | null => {
//     for (const city of locations) {
//         // Поиск по массиву метро в каждом районе
//         for (const district of city.districts) {
//           const metro = district.metros.find((metro) => metro.id === id);
//           if (metro) {
//             return { title: metro.title, lineNumber: metro.lineNumber }; // Возвращаем title и lineNumber
//           }
//         }
    
//         // Поиск по массиву regionalCities
//         const regionalCity = city.regionalCities.find((city) => city.id === id);
//         if (regionalCity) {
//           return { title: regionalCity.title }; // Возвращаем только title, lineNumber не применимо
//         }
//       }
    
//       // Если ничего не найдено, возвращаем null
//       return null;
//     }
export const findLocTitleById = (
  id: string,
  locations: City[]
): TitleWithLine | null => {
  for (const city of locations) {
    // Поиск в метро города
    const metro = city.metros.find((metro) => metro.id === id);
    if (metro) {
      return { title: metro.title, lineNumber: metro.lineNumber, cityPrefix: metro.cityPrefix };
    }

    // Поиск по районам
    const district = city.districts.find((d) => d.id === id);
    if (district) {
      return { title: district.title };
    }

    // Поиск в региональных городах
    const regionalCity = city.regionalCities.find((rc) => rc.id === id);
    if (regionalCity) {
      return { title: regionalCity.title };
    }
  }

  // Если ничего не найдено, возвращаем null
  return null;
};


// export const findLocTitlesByIds = (ids: string[], locations: City[]): (TitleWithLine | string)[] => {
//       return ids.map((id) => {
//         for (const city of locations) {
//           // Поиск по массиву метро в каждом районе
//           for (const district of city.districts) {
//             const metro = district.metros.find((metro) => metro.id === id);
//             if (metro) {
//               // Возвращаем объект типа TitleWithLine, если это метро
//               return { title: metro.title, lineNumber: metro.lineNumber || undefined };
//             }
//           }
    
//           // Поиск по массиву regionalCities
//           const regionalCity = city.regionalCities.find((city) => city.id === id);
//           if (regionalCity) {
//             // Возвращаем только title для регионального города
//             return regionalCity.title;
//           }
//         }
    
//         // Если ничего не найдено, возвращаем строку, а не null
//         return ''; // или другой дефолтный вариант, который нужно вернуть, например, "Не найдено"
//       });
//     };
export const findLocTitlesByIds = (
  ids: string[],
  locations: City[]
): (TitleWithLine | string)[] => {
  return ids.map((id) => {
    for (const city of locations) {
      // Поиск метро в городе
      const metro = city.metros.find((metro) => metro.id === id);
      if (metro) {
        return {
          title: metro.title,
          lineNumber: metro.lineNumber || undefined,
          cityPrefix: metro.cityPrefix,
        };
      }

      // Поиск по районам
      const district = city.districts.find((d) => d.id === id);
      if (district) {
        return district.title;
      }

      // Поиск по региональным городам
      const regionalCity = city.regionalCities.find((rc) => rc.id === id);
      if (regionalCity) {
        return regionalCity.title;
      }
    }

    // Если ничего не найдено, возвращаем пустую строку
    return '';
  });
};




    // export const findLocTitleByIdWithDistrict = (
    //   id: string,
    //   locations: City[]
    // ): TitleWithLine | null => {
    //   for (const city of locations) {
    //     // Поиск в метро
    //     for (const district of city.districts) {
    //       const metro = district.metros.find((metro) => metro.id === id);
    //       if (metro) {
    //         return { title: metro.title, lineNumber: metro.lineNumber, cityPrefix: metro.cityPrefix };
    //       }
    //     }
    
    //     // Поиск по районам (districts)
    //     const district = city.districts.find((d) => d.id === id);
    //     if (district) {
    //       return { title: district.title };
    //     }
    
    //     // Поиск в региональных городах
    //     const regionalCity = city.regionalCities.find((rc) => rc.id === id);
    //     if (regionalCity) {
    //       return { title: regionalCity.title };
    //     }
    //   }
    
    //   return null;
    // };
    export const findLocTitleByIdWithDistrict = (
  id: string,
  locations: City[]
): TitleWithLine | null => {
  for (const city of locations) {
    // Поиск в метро (теперь напрямую у города)
    const metro = city.metros.find((m) => m.id === id);
    if (metro) {
      return {
        title: metro.title,
        lineNumber: metro.lineNumber,
        cityPrefix: metro.cityPrefix,
      };
    }

    // Поиск по районам
    const district = city.districts.find((d) => d.id === id);
    if (district) {
      return { title: district.title };
    }

    // Поиск в региональных городах
    const regionalCity = city.regionalCities.find((rc) => rc.id === id);
    if (regionalCity) {
      return { title: regionalCity.title };
    }
  }

  return null;
};
