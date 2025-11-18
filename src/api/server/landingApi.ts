import { City, Subject, Tutor, Goal } from "@/types/types";
import { baseUrl } from "./configApi";

interface GetTutorsResponse {
  city: City | null;
  subject: Subject | null;
  goal: Goal | null;
  place: {
    slug: string;
    title: string;
  }
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  tutors: Tutor[];
}

export const fetchGetTutorsByFilters = async (
  citySlug?: string,
  subjectSlug?: string,
  goalSlug?: string,
  placeSlug?: string, // ← добавляем новый параметр
  page: number = 1,
  limit: number = 10
): Promise<GetTutorsResponse> => {
  try {
    const params = new URLSearchParams();
    if (citySlug) params.append("citySlug", citySlug);
    if (subjectSlug) params.append("subjectSlug", subjectSlug);
    if (goalSlug) params.append("goalSlug", goalSlug);
    if (placeSlug) params.append("placeSlug", placeSlug); // ← добавляем в запрос
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await fetch(`${baseUrl}landing/turors?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data: GetTutorsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении репетиторов:", error);
    throw error;
  }
};


export interface SubjectWithTutor {
  id: string;
  title: string;
  for_chpu: string;
}

export const fetchSubjectsWithTutors = async (region?: string): Promise<SubjectWithTutor[]> => {
  try {
    const url = `${baseUrl}landing/subjects${region ? `?region=${region}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // SSR / ISR корректно
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data: SubjectWithTutor[] = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении предметов sitemap:", error);
    throw error;
  }
};


export interface GoalWithTutor {
  id: string;
  title: string;
  goalSlug?: string;
  // можно добавить другие поля, если нужно на фронте
}

export const fetchGoalsWithTutors = async (
  subjectSlug: string,
  region?: string
): Promise<GoalWithTutor[]> => {
  try {
    const url = `${baseUrl}landing/subject-goals?subjectSlug=${encodeURIComponent(
      subjectSlug
    )}${region ? `&region=${encodeURIComponent(region)}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // SSR / ISR корректно
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data: GoalWithTutor[] = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Ошибка при получении целей и форматов для предмета ${subjectSlug}:`,
      error
    );
    throw error;
  }
};

export interface SubjectFormatsAvailability {
  remote: boolean;
  atTutor: boolean;
  atStudent: boolean;
}

export const fetchSubjectFormatsAvailability = async (
  subjectSlug: string,
  region?: string
): Promise<SubjectFormatsAvailability> => {
  try {
    if (!subjectSlug) {
      throw new Error("Нет subjectSlug");
    }

    const url = `${baseUrl}landing/subject-format?subjectSlug=${subjectSlug}${
      region ? `&region=${region}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // важно для SSR / ISR
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data: SubjectFormatsAvailability = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении доступности форматов:", error);
    throw error;
  }
};
