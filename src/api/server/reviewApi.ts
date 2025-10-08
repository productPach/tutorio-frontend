import { CreateCommentPayload, CreateReviewPayload } from "@/types/types";
import { baseUrl } from "./configApi";
import httpClient from "./httpClient";



// export const fetchCreateReview = async (
//   token: string,
//   payload: CreateReviewPayload
// ) => {
//   try {
//     const response = await fetch(`${baseUrl}review`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при создании отзыва:", error);
//     throw error;
//   }
// };
// Создание отзыва
export const fetchCreateReview = async (payload: CreateReviewPayload) => {
  try {
    const response = await httpClient.post(`review`, payload);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании отзыва:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// export const fetchCreateComment = async (
//   token: string,
//   payload: CreateCommentPayload
// ) => {
//   try {
//     const response = await fetch(`${baseUrl}comment`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при создании комментария:", error);
//     throw error;
//   }
// };
// Создание комментария
export const fetchCreateComment = async (payload: CreateCommentPayload) => {
  try {
    const response = await httpClient.post(`comment`, payload);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании комментария:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// export const fetchUpdateReview = async (
//   token: string,
//   reviewId: string,
//   payload: {
//     message?: string;
//     rating?: number;
//   }
// ) => {
//   try {
//     const response = await fetch(`${baseUrl}review/${reviewId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при обновлении отзыва:", error);
//     throw error;
//   }
// };
// Обновление отзыва
export const fetchUpdateReview = async (
  reviewId: string,
  payload: {
    message?: string;
    rating?: number;
  }
) => {
  try {
    const response = await httpClient.patch(`review/${reviewId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при обновлении отзыва ${reviewId}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


export const fetchReviewsByTutorId = async (tutorId: string) => {
  try {
    const response = await fetch(`${baseUrl}review/tutor/${tutorId}`);

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении отзывов репетитора:", error);
    throw error;
  }
};