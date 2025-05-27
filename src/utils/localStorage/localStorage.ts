// Установка значения в Local Storage
export const setLocalStorage = (key: string, value: string | object) => {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value); // Преобразуем объект в строку, если нужно
    localStorage.setItem(key, stringValue);
  };
  
  // Чтение значения из Local Storage
  export const getLocalStorage = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  };
  
  // Удаление значения из Local Storage
  export const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
  };
  
  // Функция загрузки студента из Local Storage
  export const getStudentFromLocalStorage = () => {
    const student = getLocalStorage("student");
    try {
      // Если это JSON-строка, парсим её
      return student ? JSON.parse(student) : null;
    } catch (error) {
      // Если произошла ошибка при парсинге, возвращаем строку как есть
      console.warn("Ошибка при парсинге JSON:", error);
      return student;
    }
  };

  // Функция загрузки репетитора из Local Storage
  export const getTutorFromLocalStorage = () => {
    const tutor = getLocalStorage("tutor");
    try {
      // Если это JSON-строка, парсим её
      return tutor ? JSON.parse(tutor) : null;
    } catch (error) {
      // Если произошла ошибка при парсинге, возвращаем строку как есть
      console.warn("Ошибка при парсинге JSON:", error);
      return tutor;
    }
  };
  
    // Функция загрузки фильтров на странице всех заказов в личном кабинете репетитора из Local Storage
    export const getFiltersOrdersForTutorFromLocalStorage = () => {
      try {
        const placeFilters = JSON.parse(getLocalStorage("place-filters-orders") || "[]");
        const goalFilters = JSON.parse(getLocalStorage("goal-filters-orders") || "[]");
        return { placeFilters, goalFilters };
      } catch (error) {
        console.warn("Ошибка при парсинге JSON:", error);
        return { placeFilters: [], goalFilters: [] }; // Возвращаем пустые массивы в случае ошибки
      }
    };