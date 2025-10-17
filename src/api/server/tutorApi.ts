import { Goal, LessonDuration, Tutor, TutorSubjectPriceInput } from "@/types/types";
import { baseUrl, getBackendUrl } from "./configApi";
import httpClient from "./httpClient";

// Регистрация репетитора
export const fetchCreateTutor = async (phone: string) => {
  // ❌ УДАЛЕНО: token из аргументов
  const response = await httpClient.post(`/tutors`, {
    phone: phone,
    status: "Rega: Fullname",
  });

  // ✅ ОБНОВЛЕНО: axios сам парсит JSON → сразу response.data
  return response.data;
};

// Получение репетитора по токену
export const fetchCurrentTutor = async () => {
  try {
    const response = await httpClient.get(`currentTutor`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка запроса currentTutor:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error("Репетитора не существует");
    }
    throw error;
  }
};

// Получение телефона репетитора по ID
export const fetchTutorPhoneById = async (id: string): Promise<string> => {
  try {
    const response = await httpClient.get(`tutors/${id}/phone`);
    return response.data.phone as string;
  } catch (error: any) {
    console.error('❌ Ошибка запроса tutors/${id}/phone:', error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить номер телефона репетитора");
  }
};

// Изменение репетитора
export const fetchUpdateTutor = async (data: {
  id: string;
  status?: string;
  name?: string;
  email?: string;
  phone?: string;
  isVerifedEmail?: boolean;
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
  lastOnline?: Date;
}) => {
  const { id, ...fields } = data;

  // ❌ Убрали token из headers
  const response = await httpClient.patch(`/tutors/${id}`, fields); // ✅ через httpClient

  return response.data; // ✅ axios сразу возвращает JSON
};

// Создание запроса на удаление репетитора
export const fetchDeleteRequest = async (tutorId: string, answer: string): Promise<void> => {
  try {
    await httpClient.post(`tutors/delete-request/${tutorId}`, { answer });
  } catch (error: any) {
    console.error(`❌ Ошибка запроса tutors/delete-request/${tutorId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при создании запроса на удаление");
  }
};

// Добавление новой цены по предмету
export const fetchAddSubjectPrice = async (
  data: TutorSubjectPriceInput & { tutorId: string }
) => {
  try {
    const response = await httpClient.post(`tutorsSubjectPrice`, data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка запроса tutorsSubjectPrice:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// Обновление цены по предмету
export const fetchUpdateSubjectPrice = async (data: {
  id: string;
  price?: number;
  duration?: LessonDuration;
}) => {
  try {
    const { id, ...fields } = data;
    const response = await httpClient.patch(`tutorsSubjectPrice/${id}`, fields);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка запроса tutorsSubjectPrice/${data.id}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// Проверка предметов репетитора на отсутствие цен по форматам
export const fetchTutorIncompletePrices = async (tutorId: string) => {
  try {
    const response = await httpClient.get(`tutors/${tutorId}/incompleteSubjectPrice`);
    return response.data; // { hasIncompletePrices: boolean, subjectsWithoutFullPrices: string[] }
  } catch (error: any) {
    console.error(
      `❌ Ошибка проверки неполных цен репетитора ${tutorId}:`,
      error.response?.status,
      error.response?.data || error.message
    );
    throw new Error("Не удалось получить информацию о ценах репетитора");
  }
};


// Обновление аватара репетитора
export const updateTutorAvatarApi = async (id: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await httpClient.put(`tutors/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка обновления аватара tutors/${id}/avatar:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при обновлении аватара");
  }
};

// Создание нового образования репетитора
export const fetchCreateTutorEducation = async (
  tutorId: string,
  educationInfo: string,
  educationStartYear: string,
  educationEndYear: string | null,
  isShowDiplom: boolean,
  diploma: (File | null)[]
) => {
  try {
    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("educationInfo", educationInfo);
    formData.append("educationStartYear", educationStartYear);
    if (educationEndYear !== null) {
      formData.append("educationEndYear", educationEndYear);
    }
    formData.append("isShowDiplom", isShowDiplom ? "true" : "false");

    diploma.forEach((file) => {
      if (file) formData.append("diploma", file);
    });

    const response = await httpClient.post(`tutorsEducation/${tutorId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка создания образования tutorsEducation/${tutorId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при создании образования");
  }
};

// Редактирование образования репетитора
export const fetchUpdateTutorEducation = async (
  tutorId: string,
  educationId: string,
  educationInfo: string,
  educationStartYear: string,
  educationEndYear: string | null,
  isShowDiplom: boolean,
  diploma: (File | null)[]
) => {
  try {
    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("educationId", educationId);
    formData.append("educationInfo", educationInfo);
    formData.append("educationStartYear", educationStartYear);
    if (educationEndYear !== null) {
      formData.append("educationEndYear", educationEndYear);
    }
    formData.append("isShowDiplom", isShowDiplom ? "true" : "false");

    diploma.forEach((file) => {
      if (file) formData.append("diploma", file);
    });

    const response = await httpClient.patch(`tutorsEducation/${tutorId}/${educationId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка обновления образования tutorsEducation/${tutorId}/${educationId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при обновлении образования");
  }
};

// Удаление образования репетитора
export const fetchDeleteTutorEducation = async (tutorId: string, educationId: string) => {
  try {
    const response = await httpClient.delete(`tutorsEducation/${tutorId}/${educationId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка удаления образования tutorsEducation/${tutorId}/${educationId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось удалить место образования");
  }
};

// Удаление фотографии образования репетитора
export const fetchDeletePhotoTutorEducation = async (
  tutorId: string,
  educationId: string,
  fileName: string
) => {
  try {
    const response = await httpClient.delete(`tutorsFileEducation/${tutorId}/${educationId}`, {
      data: { fileName }, // axios использует 'data' для тела DELETE запроса
    });

    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка удаления фотографии tutorsFileEducation/${tutorId}/${educationId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось удалить фотографию");
  }
};


interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string; // HTML не обязателен
}

export const sendEmail = async (emailData: EmailData) => {
  const response = await fetch(`${baseUrl}send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData), // Просто передаём параметры письма
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Ошибка при отправке письма: ${data.error || "Неизвестная ошибка"}`
    );
  }

  return data;
};

// Отправка письма подтверждения для репетитора
export const sendVerificationEmail = async (tutorId: string) => {
  try {
    const response = await httpClient.post(`send-verification-email`, {
      id: tutorId,
      userType: "tutor",
    });

    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка отправки письма send-verification-email:`, error.response?.status, error.response?.data || error.message);
    throw new Error(`Ошибка при отправке письма: ${error.response?.data?.error || "Неизвестная ошибка"}`);
  }
};

// Подтверждение email репетитора
export const fetchVerifyEmail = async (token: string) => {
  try {
    const response = await httpClient.get(`tutors/verify-email`, {
      params: { token }, // передаем токен в query-параметре
    });
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка подтверждения email:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// Получение всех репетиторов
export const fetchAllTutors = async () => {
  try {
    const response = await httpClient.get(`tutors`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка получения списка репетиторов:', error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить список репетиторов");
  }
};

// Получение репетитора по ID
export const fetchTutorById = async (id: string) => {
  try {
    const response = await httpClient.get(`tutors/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка получения репетитора ${id}:`, error.response?.status, error.response?.data || error.message);
    throw new Error(`Не удалось получить репетитора с ID ${id}`);
  }
};

// Получение репетитора по ID (Публичный)
export const fetchTutorByIdPublic = async (id: string): Promise<Tutor | null> => {
  try {
    const response = await fetch(`${getBackendUrl()}/api/public/tutors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // отключение кэша
    });

    if (response.status === 404) {
      // Репетитор не найден — это не критическая ошибка
      return null;
    }

    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status} — ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.tutor;

  } catch (error) {
    console.error("Ошибка при получении репетитора:", error);
    return null;
  }
};

// Получение списка всех целей по выбранным предметам репетитора + отмечаем выбранные цели
export const fetchTutorGoalsBySubject = async (tutorId: string, subjectId: string): Promise<Goal[]> => {
  try {
    const response = await httpClient.get<Goal[]>(`tutors/${tutorId}/${subjectId}/goals`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка получения целей репетитора ${tutorId} по предмету ${subjectId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error(`Не удалось получить цели репетитора`);
  }
};

// Получение выбранных целей репетитора по каждому предмету
export const fetchTutorSelectedGoalsGrouped = async (tutorId: string) => {
  try {
    const response = await httpClient.get(`/tutors/${tutorId}/goals`);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Ошибка запроса tutorGoalsGrouped:",
      error.response?.status,
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      throw new Error("Цели для репетитора не найдены");
    }
    throw error;
  }
};

// Получаем предметы репетитора с целями
export const fetchTutorSubjectsWithGoals = async (tutorId: string) => {
  try {
    const response = await httpClient.get(`/tutors/${tutorId}/subjectsWithGoals`);
    return response.data as {
      subjectId: string;
      subjectTitle: string;
      goals: { id: string; title: string; selected: boolean }[];
      hasNoSelectedGoals: boolean;
    }[];
  } catch (error: any) {
    console.error(
      "❌ Ошибка запроса subjectsWithGoals:",
      error.response?.status,
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      throw new Error("Предметы с целями для репетитора не найдены");
    }
    throw error;
  }
};

// Обновление целей репетитора
export const updateTutorGoalsBySubject = async (
  tutorId: string,
  subjectId: string,
  goalIds: string[]
): Promise<void> => {
  try {
    await httpClient.patch(`tutors/${tutorId}/${subjectId}/goals`, { goalIds });
  } catch (error: any) {
    console.error(`❌ Ошибка обновления целей репетитора ${tutorId} по предмету ${subjectId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error(`Не удалось обновить цели репетитора`);
  }
};

// Получение репетиторов по предмету и цели (для заказов)
export const fetchTutorsForOrderById = async (orderId: string,  page: number = 1, limit: number = 20) => {
  try {
    const response = await httpClient.get(`tutors/order/${orderId}`, {
      params: { page, limit },
    });

    // ✅ Ожидаем, что сервер вернёт:
    // { tutors: [...], pagination: { page, limit, total, totalPages } }

    return response.data; // массив репетиторов
  } catch (error: any) {
    console.error(
      `❌ Ошибка при получении репетиторов по orderId=${orderId}:`,
      error.response?.status,
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      throw new Error("Репетиторы не найдены");
    }

    throw new Error("Не удалось загрузить репетиторов");
  }
};
