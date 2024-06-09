import { data } from "@/utils/listSubjects";

// Интерфейс для объекта предметов // mock object
export interface Subject {
  //userId: number;
  id: number;
  title: string;
  nextPage: string;
  //ompleted: boolean;
}

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
