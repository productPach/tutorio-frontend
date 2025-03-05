import { LessonDuration, TutorSubjectPriceInput } from "@/types/types";
import { baseUrl } from "./configApi";

// Регистрация репетитора
export const fetchCreateTutor = async (phone: string, token: string) => {
  const response = await fetch(`${baseUrl}tutors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      phone: phone,
      status: "Rega: Fullname",
    }),
  });

  const data = await response.json();
  return data;
};

// Получение репетитора по токену
export const fetchCurrentTutor = async (token: string) => {
  const response = await fetch(`${baseUrl}currentTutor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Репетитора не существует");
  }

  const data = await response.json();
  return data;
};

// Изменение репетитора
export const fetchUpdateTutor = async (data: {
  id: string;
  token: string;
  status: string;
  name?: string;
  email?: string;
  telegram?: string;
  skype?: string;
  subject?: string[];
  subjectComments?: { subjectId: string; comment: string }[];
  region?: string;
  tutorPlace?: string[];
  tutorAdress?: string;
  tutorTrip?: string[];
  tutorTripCity?: string[];
  tutorTripCityData?: string;
  tutorTripArea?: string[];
  profileInfo?: string;
  experience?: string;
  isGroup?: boolean;
  isPublicProfile?: boolean;
  isStudentResponses?: boolean;
  isNotifications?: boolean;
  isNotificationsOrders?: boolean;
  isNotificationsResponse?: boolean;
  isNotificationsPromo?: boolean;
  isNotificationsSms?: boolean;
  isNotificationsEmail?: boolean;
  isNotificationsTelegram?: boolean;
  isNotificationsVk?: boolean;
}) => {
  const { id, token, ...fields } = data;

  const response = await fetch(`${baseUrl}tutors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields), // Отправляем только переданные поля
  });

  const responseData = await response.json();
  return responseData;
};

// Добавление новой цены по предмету
export const fetchAddSubjectPrice = async (data: TutorSubjectPriceInput & { tutorId: string; token: string }) => {
  const { token, ...fields } = data;

  const response = await fetch(`${baseUrl}tutorsSubjectPrice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });

  const responseData = await response.json();
  return responseData;
};

// Обновление цены по предмету
export const fetchUpdateSubjectPrice = async (data: { id: string; token: string; price?: number; duration?: LessonDuration }) => {
  const { id, token, ...fields } = data;

  const response = await fetch(`${baseUrl}tutorsSubjectPrice/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });

  const responseData = await response.json();
  return responseData;
};


// Обновление аватара репетитора
export const updateTutorAvatarApi = async (
  id: string,
  file: File,
  token: string
) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(`${baseUrl}tutors/${id}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при обновлении аватара");
  }

  return response.json();
};

// ОБРАЗОВНИЕ РЕПЕТИТОРА

// Создание нового образование
export const fetchCreateTutorEducation = async (
  tutorId: string,
  educationInfo: string,
  educationStartYear: string,
  educationEndYear: string | null,
  isShowDiplom: boolean,
  token: string,
  diploma: (File | null)[]
) => {
  const formData = new FormData();

  formData.append("tutorId", tutorId);
  formData.append("educationInfo", educationInfo);
  formData.append("educationStartYear", educationStartYear);
  if (educationEndYear !== null) {
    formData.append("educationEndYear", educationEndYear);
  }
  formData.append("isShowDiplom", isShowDiplom ? "true" : "false");

  // Добавляем файлы в formData
  diploma.forEach((file, index) => {
    if (file) {
      formData.append(`diploma`, file);
    }
  });

  const response = await fetch(`${baseUrl}tutorsEducation/${tutorId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании образования");
  }

  const data = await response.json();
  return data;
};


// Редактирование образования
export const fetchUpdateTutorEducation = async (
  tutorId: string,
  educationId: string,
  educationInfo: string,
  educationStartYear: string,
  educationEndYear: string | null,
  isShowDiplom: boolean,
  token: string,
  diploma: (File | null)[]
) => {
  const formData = new FormData();

  formData.append("tutorId", tutorId);
  formData.append("educationId", educationId);
  formData.append("educationInfo", educationInfo);
  formData.append("educationStartYear", educationStartYear);
  if (educationEndYear !== null) {
    formData.append("educationEndYear", educationEndYear);
  }
  formData.append("isShowDiplom", isShowDiplom ? "true" : "false");

  // Добавляем файлы диплома, если они есть
  diploma.forEach((file) => {
    if (file) {
      formData.append("diploma", file);
    }
  });

  const response = await fetch(`${baseUrl}tutorsEducation/${tutorId}/${educationId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при обновлении образования");
  }

  const data = await response.json();
  return data; // Возвращаем обновленные данные
};



// Удаление образования
// Функция для удаления места образования
export const fetchDeleteTutorEducation = async (
  tutorId: string,
  educationId: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${baseUrl}tutorsEducation/${tutorId}/${educationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Не удалось удалить место образования");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting education:", error);
    throw new Error("Произошла ошибка при удалении места образования");
  }
};


// Функция для удаления фото образования
export const fetchDeletePhotoTutorEducation = async (
  tutorId: string,
  educationId: string,
  fileName: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${baseUrl}tutorsFileEducation/${tutorId}/${educationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileName })  // Отправляем имя файла для удаления
      }
    );

    if (!response.ok) {
      throw new Error("Не удалось удалить фотографию");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при удалении фотографии:", error);
    throw new Error("Произошла ошибка при удалении фотографии");
  }
};

