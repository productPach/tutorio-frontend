// import { City, Subject, Tutor } from "@/types/types";
// import { baseUrl } from "./configApi";

// interface GetTutorsResponse {
//   city: City | null;
//   subject: Subject | null;
//   pagination: {
//     total: number;
//     page: number;
//     pages: number;
//   };
//   tutors: Tutor[];
// }

// export const fetchGetTutorsByFilters = async (
//   citySlug?: string,
//   subjectSlug?: string,
//   page: number = 1,
//   limit: number = 10
// ): Promise<GetTutorsResponse> => {
//   try {
//     // формируем query параметры
//     const params = new URLSearchParams();
//     if (citySlug) params.append("citySlug", citySlug);
//     if (subjectSlug) params.append("subjectSlug", subjectSlug);
//     params.append("page", page.toString());
//     params.append("limit", limit.toString());

//     const response = await fetch(`${baseUrl}landing/turors?${params.toString()}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     const data: GetTutorsResponse = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Ошибка при получении репетиторов:", error);
//     throw error;
//   }
// };

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

// export const fetchGetTutorsByFilters = async (
//   citySlug?: string,
//   subjectSlug?: string,
//   goalSlug?: string,
//   page: number = 1,
//   limit: number = 10
// ): Promise<GetTutorsResponse> => {
//   try {
//     const params = new URLSearchParams();
//     if (citySlug) params.append("citySlug", citySlug);
//     if (subjectSlug) params.append("subjectSlug", subjectSlug);
//     if (goalSlug) params.append("goalSlug", goalSlug);
//     params.append("page", page.toString());
//     params.append("limit", limit.toString());

//     const response = await fetch(`${baseUrl}landing/turors?${params.toString()}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     const data: GetTutorsResponse = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Ошибка при получении репетиторов:", error);
//     throw error;
//   }
// };

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