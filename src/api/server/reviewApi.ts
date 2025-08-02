import { CreateCommentPayload, CreateReviewPayload } from "@/types/types";
import { baseUrl } from "./configApi";



export const fetchCreateReview = async (
  token: string,
  payload: CreateReviewPayload
) => {
  try {
    const response = await fetch(`${baseUrl}review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании отзыва:", error);
    throw error;
  }
};

export const fetchCreateComment = async (
  token: string,
  payload: CreateCommentPayload
) => {
  try {
    const response = await fetch(`${baseUrl}comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании комментария:", error);
    throw error;
  }
};

export const fetchUpdateReview = async (
  token: string,
  reviewId: string,
  payload: {
    message?: string;
    rating?: number;
  }
) => {
  try {
    const response = await fetch(`${baseUrl}review/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении отзыва:", error);
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