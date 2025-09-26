import { LessonDuration, Tutor, TutorSubjectPriceInput } from "@/types/types";
import { baseUrl, getBackendUrl } from "./configApi";
import httpClient from "./httpClient";

// // Регистрация репетитора
// export const fetchCreateTutor = async (phone: string, token: string) => {
//   const response = await fetch(`${baseUrl}tutors`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       phone: phone,
//       status: "Rega: Fullname",
//     }),
//   });

//   const data = await response.json();
//   return data;
// };

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
// export const fetchCurrentTutor = async (token: string) => {
//   const response = await fetch(`${baseUrl}currentTutor`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Репетитора не существует");
//   }

//   const data = await response.json();
//   return data;
// };

// Получение репетитора по токену
export const fetchCurrentTutor = async () => {
  try {
    const response = await httpClient.get(`currentTutor`);
    console.log('✅ Сервер вернул JSON:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка запроса currentTutor:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error("Репетитора не существует");
    }
    throw error;
  }
};


// // Получение телефона ученика по ID
// export const fetchTutorPhoneById = async (token: string, id: string) => {
//   const response = await fetch(`${baseUrl}tutors/${id}/phone`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Не удалось получить номер телефона репетитора");
//   }

//   const data = await response.json();
//   return data.phone as string;
// };
// Получение телефона репетитора по ID
export const fetchTutorPhoneById = async (id: string): Promise<string> => {
  try {
    const response = await httpClient.get(`tutors/${id}/phone`);
    console.log('✅ Сервер вернул JSON:', response.data);
    return response.data.phone as string;
  } catch (error: any) {
    console.error('❌ Ошибка запроса tutors/${id}/phone:', error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить номер телефона репетитора");
  }
};

// Изменение репетитора
// export const fetchUpdateTutor = async (data: {
//   id: string;
//   token: string;
//   status?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   isVerifedEmail?: boolean;
//   telegram?: string;
//   skype?: string;
//   subject?: string[];
//   subjectComments?: { subjectId: string; comment: string }[];
//   region?: string;
//   tutorPlace?: string[];
//   tutorAdress?: string;
//   tutorTrip?: string[];
//   tutorTripCity?: string[];
//   tutorTripCityData?: string;
//   tutorTripArea?: string[];
//   profileInfo?: string;
//   experience?: string;
//   isGroup?: boolean;
//   isPublicProfile?: boolean;
//   isStudentResponses?: boolean;
//   isNotifications?: boolean;
//   isNotificationsOrders?: boolean;
//   isNotificationsResponse?: boolean;
//   isNotificationsPromo?: boolean;
//   isNotificationsSms?: boolean;
//   isNotificationsEmail?: boolean;
//   isNotificationsTelegram?: boolean;
//   isNotificationsVk?: boolean;
//   lastOnline?: Date;
// }) => {
//   const { id, token, ...fields } = data;

//   const response = await fetch(`${baseUrl}tutors/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(fields), // Отправляем только переданные поля
//   });

//   const responseData = await response.json();
//   return responseData;
// };

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
  tutorTripCity?: string;
  tutorTripCityData?: string;
  tutorTripArea?: string;
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

// export const fetchDeleteRequest = async (
//   tutorId: string,
//   answer: string,
//   token: string
// ): Promise<void> => {
//   const res = await fetch(`${baseUrl}tutors/delete-request/${tutorId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ answer }),
//   });

//   if (!res.ok) {
//     throw new Error("Ошибка при создании запроса на удаление");
//   }
// };
// Создание запроса на удаление репетитора
export const fetchDeleteRequest = async (tutorId: string, answer: string): Promise<void> => {
  try {
    await httpClient.post(`tutors/delete-request/${tutorId}`, { answer });
    console.log(`✅ Запрос на удаление для репетитора ${tutorId} успешно отправлен`);
  } catch (error: any) {
    console.error(`❌ Ошибка запроса tutors/delete-request/${tutorId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при создании запроса на удаление");
  }
};

// Добавление новой цены по предмету
// export const fetchAddSubjectPrice = async (
//   data: TutorSubjectPriceInput & { tutorId: string; token: string }
// ) => {
//   const { token, ...fields } = data;

//   const response = await fetch(`${baseUrl}tutorsSubjectPrice`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(fields),
//   });

//   const responseData = await response.json();
//   return responseData;
// };
// Добавление новой цены по предмету
export const fetchAddSubjectPrice = async (
  data: TutorSubjectPriceInput & { tutorId: string }
) => {
  try {
    const response = await httpClient.post(`tutorsSubjectPrice`, data);
    console.log('✅ Сервер вернул JSON:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка запроса tutorsSubjectPrice:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// // Обновление цены по предмету
// export const fetchUpdateSubjectPrice = async (data: {
//   id: string;
//   token: string;
//   price?: number;
//   duration?: LessonDuration;
// }) => {
//   const { id, token, ...fields } = data;

//   const response = await fetch(`${baseUrl}tutorsSubjectPrice/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(fields),
//   });

//   const responseData = await response.json();
//   return responseData;
// };
// Обновление цены по предмету
export const fetchUpdateSubjectPrice = async (data: {
  id: string;
  price?: number;
  duration?: LessonDuration;
}) => {
  try {
    const { id, ...fields } = data;
    const response = await httpClient.patch(`tutorsSubjectPrice/${id}`, fields);
    console.log('✅ Сервер вернул JSON:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка запроса tutorsSubjectPrice/${data.id}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// // Обновление аватара репетитора
// export const updateTutorAvatarApi = async (
//   id: string,
//   file: File,
//   token: string
// ) => {
//   const formData = new FormData();
//   formData.append("avatar", file);

//   const response = await fetch(`${baseUrl}tutors/${id}/avatar`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("Ошибка при обновлении аватара");
//   }

//   return response.json();
// };
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

    console.log('✅ Аватар обновлён:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка обновления аватара tutors/${id}/avatar:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при обновлении аватара");
  }
};


// ОБРАЗОВНИЕ РЕПЕТИТОРА

// // Создание нового образование
// export const fetchCreateTutorEducation = async (
//   tutorId: string,
//   educationInfo: string,
//   educationStartYear: string,
//   educationEndYear: string | null,
//   isShowDiplom: boolean,
//   token: string,
//   diploma: (File | null)[]
// ) => {
//   const formData = new FormData();

//   formData.append("tutorId", tutorId);
//   formData.append("educationInfo", educationInfo);
//   formData.append("educationStartYear", educationStartYear);
//   if (educationEndYear !== null) {
//     formData.append("educationEndYear", educationEndYear);
//   }
//   formData.append("isShowDiplom", isShowDiplom ? "true" : "false");

//   // Добавляем файлы в formData
//   diploma.forEach((file, index) => {
//     if (file) {
//       formData.append(`diploma`, file);
//     }
//   });

//   const response = await fetch(`${baseUrl}tutorsEducation/${tutorId}`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("Ошибка при создании образования");
//   }

//   const data = await response.json();
//   return data;
// };
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

    console.log('✅ Образование создано:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка создания образования tutorsEducation/${tutorId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при создании образования");
  }
};


// // Редактирование образования
// export const fetchUpdateTutorEducation = async (
//   tutorId: string,
//   educationId: string,
//   educationInfo: string,
//   educationStartYear: string,
//   educationEndYear: string | null,
//   isShowDiplom: boolean,
//   token: string,
//   diploma: (File | null)[]
// ) => {
//   const formData = new FormData();

//   formData.append("tutorId", tutorId);
//   formData.append("educationId", educationId);
//   formData.append("educationInfo", educationInfo);
//   formData.append("educationStartYear", educationStartYear);
//   if (educationEndYear !== null) {
//     formData.append("educationEndYear", educationEndYear);
//   }
//   formData.append("isShowDiplom", isShowDiplom ? "true" : "false");

//   // Добавляем файлы диплома, если они есть
//   diploma.forEach((file) => {
//     if (file) {
//       formData.append("diploma", file);
//     }
//   });

//   const response = await fetch(
//     `${baseUrl}tutorsEducation/${tutorId}/${educationId}`,
//     {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Ошибка при обновлении образования");
//   }

//   const data = await response.json();
//   return data; // Возвращаем обновленные данные
// };
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

    console.log('✅ Образование обновлено:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка обновления образования tutorsEducation/${tutorId}/${educationId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при обновлении образования");
  }
};


// // Удаление образования
// // Функция для удаления места образования
// export const fetchDeleteTutorEducation = async (
//   tutorId: string,
//   educationId: string,
//   token: string
// ) => {
//   try {
//     const response = await fetch(
//       `${baseUrl}tutorsEducation/${tutorId}/${educationId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Не удалось удалить место образования");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error deleting education:", error);
//     throw new Error("Произошла ошибка при удалении места образования");
//   }
// };
// Удаление образования репетитора
export const fetchDeleteTutorEducation = async (tutorId: string, educationId: string) => {
  try {
    const response = await httpClient.delete(`tutorsEducation/${tutorId}/${educationId}`);
    console.log('✅ Образование удалено:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка удаления образования tutorsEducation/${tutorId}/${educationId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось удалить место образования");
  }
};


// // Функция для удаления фото образования
// export const fetchDeletePhotoTutorEducation = async (
//   tutorId: string,
//   educationId: string,
//   fileName: string,
//   token: string
// ) => {
//   try {
//     const response = await fetch(
//       `${baseUrl}tutorsFileEducation/${tutorId}/${educationId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ fileName }), // Отправляем имя файла для удаления
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Не удалось удалить фотографию");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Ошибка при удалении фотографии:", error);
//     throw new Error("Произошла ошибка при удалении фотографии");
//   }
// };
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

    console.log('✅ Фотография удалена:', response.data);
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

// export const sendVerificationEmail = async (tutorId: string, token: string) => {
//   const response = await fetch(`${baseUrl}send-verification-email`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // Передаем токен в заголовке
//     },
//     body: JSON.stringify({ id: tutorId, userType: "tutor" }), // Передаем ID в теле запроса
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       `Ошибка при отправке письма: ${data.error || "Неизвестная ошибка"}`
//     );
//   }

//   return data;
// };
// Отправка письма подтверждения для репетитора
export const sendVerificationEmail = async (tutorId: string) => {
  try {
    const response = await httpClient.post(`send-verification-email`, {
      id: tutorId,
      userType: "tutor",
    });

    console.log('✅ Письмо подтверждения отправлено:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка отправки письма send-verification-email:`, error.response?.status, error.response?.data || error.message);
    throw new Error(`Ошибка при отправке письма: ${error.response?.data?.error || "Неизвестная ошибка"}`);
  }
};


// // Функция для подтверждения email
// export const fetchVerifyEmail = async (token: string) => {
//   const response = await fetch(`${baseUrl}tutors/verify-email?token=${token}`, {
//     method: "GET",
//   });

//   const responseData = await response.json();
//   return responseData;
// };
// Подтверждение email репетитора
export const fetchVerifyEmail = async (token: string) => {
  try {
    const response = await httpClient.get(`tutors/verify-email`, {
      params: { token }, // передаем токен в query-параметре
    });
    console.log('✅ Email подтверждён:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка подтверждения email:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// // Получение всех репетиторов
// export const fetchAllTutors = async (token: string) => {
//   const response = await fetch(`${baseUrl}tutors`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Не удалось получить список репетиторов");
//   }

//   const data = await response.json();
//   return data;
// };
// Получение всех репетиторов
export const fetchAllTutors = async () => {
  try {
    const response = await httpClient.get(`tutors`);
    console.log('✅ Список репетиторов получен:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка получения списка репетиторов:', error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить список репетиторов");
  }
};


// // Получение репетитора по ID
// export const fetchTutorById = async (id: string, token: string) => {
//   const response = await fetch(`${baseUrl}tutors/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Не удалось получить репетитора с ID ${id}`);
//   }

//   const data = await response.json();
//   return data;
// };
// Получение репетитора по ID
export const fetchTutorById = async (id: string) => {
  try {
    const response = await httpClient.get(`tutors/${id}`);
    console.log(`✅ Репетитор ${id} получен:`, response.data);
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
