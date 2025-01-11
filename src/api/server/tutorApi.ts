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
  subject?: string[];
  region?: string;
  tutorPlace?: string[];
  tutorAdress?: string;
  tutorTrip?: string[];
  profileInfo?: string;
}) => {
  const { id, token, ...fields } = data;

  const response = await fetch(`${baseUrl}tutors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields), // Сериализуем только поля для обновления
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
  educationStartYear: number,
  educationEndYear: number,
  educationDiplomUrl: string,
  isShowDiplom: boolean,
  token: string
) => {
  const response = await fetch(`${baseUrl}tutorsEducation/${tutorId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tutorId: tutorId,
      educationInfo: educationInfo,
      educationStartYear: educationStartYear,
      educationEndYear: educationEndYear ? educationEndYear : null,
      educationDiplomUrl: educationDiplomUrl ? educationDiplomUrl : null,
      isShowDiplom: isShowDiplom,
    }),
  });

  const data = await response.json();
  return data;
};

// Редактирование образования
export const fetchUpdateTutorEducation = async (data: {
  tutorId: string;
  educationId: string;
  token: string;
  educationInfo?: string;
  educationStartYear?: number;
  educationEndYear?: number;
  isShowDiplom?: boolean;
}) => {
  const { tutorId, educationId, token, ...fields } = data;
  const response = await fetch(
    `${baseUrl}tutorsEducation/${tutorId}/${educationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fields),
    }
  );

  const responseData = await response.json();
  return responseData;
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
