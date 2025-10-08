import { Subject } from "@/types/types";
import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

// Получение всех предметов
export const fetchGetAllSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await fetch(`${baseUrl}subjects`, {
      method: "GET",
      headers: { "Content-Type": "application/json",
    },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении предметов:", error);
    throw error;
  }
};

// Получение целей по предмету
export const fetchGetGoalsBySubject = async (subjectId: string) => {
  try {
    const response = await httpClient.get(`subjects/${subjectId}/goals`);
    return response.data;
  } catch (error: any) {
    console.error(
      `❌ Ошибка при получении целей по предмету ${subjectId}:`,
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};
// Пример запроса
// const goals = await fetchGetGoalsBySubject("68d421eb2bbd2b616037fd56");
// console.log(goals);
