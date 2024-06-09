// Интерфейс для объекта предметов // mock object
export interface Subject {
  //userId: number;
  id: number;
  title: string;
  nextPage: string;
  //ompleted: boolean;
}

// mock object: Предметы

export const data = [
  {
    id: 0,
    title: "Алгебра",
    nextPage: "/app",
  },
  {
    id: 1,
    title: "Английский язык",
    nextPage: "/app",
  },
  {
    id: 2,
    title: "Арабский язык",
    nextPage: "/app",
  },
  {
    id: 3,
    title: "Астрономия",
    nextPage: "/app",
  },
  {
    id: 4,
    title: "Биология",
    nextPage: "/app",
  },
  {
    id: 5,
    title: "География",
    nextPage: "/app",
  },
  {
    id: 6,
    title: "Геометрия",
    nextPage: "/app",
  },
  {
    id: 7,
    title: "Естествознание",
    nextPage: "/app",
  },
  {
    id: 8,
    title: "Изобразительное искусство",
    nextPage: "/app",
  },
  {
    id: 9,
    title: "Информатика",
    nextPage: "/app",
  },
  {
    id: 10,
    title: "История",
    nextPage: "/app",
  },
  {
    id: 11,
    title: "Испанский язык",
    nextPage: "/app",
  },
  {
    id: 12,
    title: "Итальянский язык",
    nextPage: "/app",
  },
  {
    id: 13,
    title: "Китайский язык",
    nextPage: "/app",
  },
  {
    id: 14,
    title: "Краеведение",
    nextPage: "/app",
  },
  {
    id: 15,
    title: "Корейский язык",
    nextPage: "/app",
  },
  {
    id: 16,
    title: "Латынь",
    nextPage: "/app",
  },
  {
    id: 17,
    title: "Литература",
    nextPage: "/app",
  },
  {
    id: 18,
    title: "Математика",
    nextPage: "/app",
  },
  {
    id: 19,
    title: "МХК",
    nextPage: "/app",
  },
  {
    id: 20,
    title: "Музыка",
    nextPage: "/app",
  },
  {
    id: 21,
    title: "Начальная военная подготовка",
    nextPage: "/app",
  },
  {
    id: 22,
    title: "Немецкий язык",
    nextPage: "/app",
  },
  {
    id: 23,
    title: "Обществознание",
    nextPage: "/app",
  },
  {
    id: 24,
    title: "Португальский язык",
    nextPage: "/app",
  },
  {
    id: 25,
    title: "Проектирование",
    nextPage: "/app",
  },
  {
    id: 26,
    title: "Рисование",
    nextPage: "/app",
  },
  {
    id: 27,
    title: "Риторика",
    nextPage: "/app",
  },
  {
    id: 28,
    title: "Русский язык",
    nextPage: "/app",
  },
  {
    id: 29,
    title: "Статистика",
    nextPage: "/app",
  },
  {
    id: 30,
    title: "Технология",
    nextPage: "/app",
  },
  {
    id: 31,
    title: "Физика",
    nextPage: "/app",
  },
  {
    id: 32,
    title: "Философия",
    nextPage: "/app",
  },
  {
    id: 33,
    title: "Французский язык",
    nextPage: "/app",
  },
  {
    id: 34,
    title: "Химия",
    nextPage: "/app",
  },
  {
    id: 35,
    title: "Хинди",
    nextPage: "/app",
  },
  {
    id: 36,
    title: "Черчение",
    nextPage: "/app",
  },
  {
    id: 37,
    title: "Экология",
    nextPage: "/app",
  },
  {
    id: 38,
    title: "Экономика",
    nextPage: "/app",
  },
  {
    id: 39,
    title: "Японский язык",
    nextPage: "/app",
  },
  {
    id: 40,
    title: "Английский для детей",
    nextPage: "/app",
  },
  {
    id: 41,
    title: "Английский для взрослых",
    nextPage: "/app",
  },
];

// Запрос для получения списка предметов // mock object // Перенести фильтрацию на сторону сервера
export const getSubjectListForSearch = async (subject: string) => {
  //   const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  //   if (!response.ok) {
  //     throw new Error("Ошибка в получении списка предметов");
  //   }

  //  const data = await response.json();

  const result = await data.filter((item: Subject) => {
    const stopWords = ["по", "п"];
    const queryWords = subject
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "" && !stopWords.includes(word));
    return (
      subject &&
      queryWords.every((word) => item.title.toLowerCase().includes(word))
    );

    // return (
    //   subject &&
    //   item &&
    //   item.title &&
    //   item.title.toLowerCase().includes(subject.toLowerCase())
    // );
  });

  return result;
};
