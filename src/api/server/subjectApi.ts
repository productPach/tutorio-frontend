import { Subject } from "@/types/types";
import { baseUrl } from "./configApi";

// Получение всех топиков
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