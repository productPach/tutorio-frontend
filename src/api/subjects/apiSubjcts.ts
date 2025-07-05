import { Subject } from "@/types/types";

// Запрос для получения списка предметов // mock object // Перенести фильтрацию на сторону сервера
export const getSubjectListForSearch = async (subject: string, data: Subject[]) => {
  //   const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  //   if (!response.ok) {
  //     throw new Error("Ошибка в получении списка предметов");
  //   }

  //  const data = await response.json();

  const stopWords = ["п", "по", "с", "для"]; // Дополняем список стоп-слов

const result = data.filter((item: Subject) => {
  const queryWords = subject
    .toLowerCase()
    .split(" ")
    .filter((word) => word.trim() !== "" && !stopWords.includes(word));

  // Если после фильтрации queryWords пустой, пропускаем этот item
  if (queryWords.length === 0) {
    return false;
  }

  return queryWords.every((word) => {
    // Создаем регулярное выражение, которое ищет слово в начале строки или слова
    const regex = new RegExp(`(^|\\s)${word}`, "i");
    return regex.test(item.title.toLowerCase());
  });
});

return result;
};
