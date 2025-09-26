import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

// // Регистрация ученика
// export const fetchCreateStudent = async (
//   name: string,
//   phone: string,
//   avatarUrl: string,
//   region: string,
//   token: string
// ) => {
//   const response = await fetch(`${baseUrl}students`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       name: name,
//       phone: phone,
//       avatarUrl: avatarUrl,
//       region: region,
//       status: "Active",
//     }),
//   });

//   const data = await response.json();
//   return data;
// };
// Регистрация ученика
export const fetchCreateStudent = async (
  name: string,
  phone: string,
  avatarUrl: string,
  region: string
) => {
  try {
    const response = await httpClient.post(`students`, {
      name,
      phone,
      avatarUrl,
      region,
      status: "Active",
    });
    console.log('✅ Студент создан:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании студента:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// // Получение ученика по токену
// export const fetchCurrentStudent = async (token: string) => {
//   const response = await fetch(`${baseUrl}currentStudent`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Студент не существует");
//   }

//   const data = await response.json();
//   return data;
// };
// Получение ученика по токену
export const fetchCurrentStudent = async () => {
  try {
    const response = await httpClient.get(`currentStudent`);
    console.log('✅ Текущий студент получен:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при получении текущего студента:', error.response?.status, error.response?.data || error.message);
    throw new Error("Студент не существует");
  }
};


// // Получение телефона ученика по ID
// export const fetchStudentPhoneById = async (token: string, id: string) => {
//   const response = await fetch(`${baseUrl}students/${id}/phone`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Не удалось получить номер телефона ученика");
//   }

//   const data = await response.json();
//   return data.phone as string;
// };
// Получение телефона ученика по ID
export const fetchStudentPhoneById = async (id: string): Promise<string> => {
  try {
    const response = await httpClient.get(`students/${id}/phone`);
    console.log(`✅ Телефон студента ${id} получен:`, response.data);
    return response.data.phone as string;
  } catch (error: any) {
    console.error(`❌ Ошибка при получении телефона студента ${id}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить номер телефона ученика");
  }
};


// // Получение ученика по ID
// export const fetchStudentById = async (token: string, id: string) => {
//   const response = await fetch(`${baseUrl}students/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Студент не существует");
//   }

//   const data = await response.json();
//   return data.student;
// };
// Получение ученика по ID
export const fetchStudentById = async (id: string) => {
  try {
    const response = await httpClient.get(`students/${id}`);
    console.log(`✅ Студент ${id} получен:`, response.data);
    return response.data.student;
  } catch (error: any) {
    console.error(`❌ Ошибка при получении студента ${id}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Студент не существует");
  }
};


// // Изменение репетитора
// export const fetchUpdateStudent = async (data: {
//   id: string;
//   token: string;
//   status: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   region?: string;
//   lastOnline?: Date;
// }) => {
//   const { id, token, ...fields } = data;

//   const response = await fetch(`${baseUrl}students/${id}`, {
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
// Изменение студента
export const fetchUpdateStudent = async (data: {
  id: string;
  status: string;
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  lastOnline?: Date;
}) => {
  const { id, ...fields } = data;

  try {
    const response = await httpClient.patch(`students/${id}`, fields);
    console.log(`✅ Студент ${id} обновлён:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при обновлении студента ${id}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// export const fetchDeleteRequest = async (
//   studentId: string,
//   answer: string,
//   token: string
// ): Promise<void> => {
//   const res = await fetch(`${baseUrl}students/delete-request/${studentId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ answer }),
//   });

//   if (!res.ok) {
//     throw new Error("Ошибка при создании запроса на удаление ученика");
//   }
// };
// Создание запроса на удаление ученика
export const fetchDeleteRequest = async (studentId: string, answer: string): Promise<void> => {
  try {
    await httpClient.post(`students/delete-request/${studentId}`, { answer });
    console.log(`✅ Запрос на удаление ученика ${studentId} создан`);
  } catch (error: any) {
    console.error(`❌ Ошибка при создании запроса на удаление ученика ${studentId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при создании запроса на удаление ученика");
  }
};


// export const sendVerificationEmail = async (
//   studentId: string,
//   token: string
// ) => {
//   const response = await fetch(`${baseUrl}send-verification-email`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // Передаем токен в заголовке
//     },
//     body: JSON.stringify({ id: studentId, userType: "student" }), // Передаем ID в теле запроса
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       `Ошибка при отправке письма: ${data.error || "Неизвестная ошибка"}`
//     );
//   }

//   return data;
// };
// Отправка письма для подтверждения email ученика
export const sendVerificationEmail = async (studentId: string) => {
  try {
    const response = await httpClient.post(`send-verification-email`, {
      id: studentId,
      userType: "student",
    });
    console.log(`✅ Письмо для подтверждения email отправлено студенту ${studentId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при отправке письма студенту ${studentId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Ошибка при отправке письма");
  }
};


// // Функция для подтверждения email
// export const fetchVerifyEmail = async (token: string) => {
//   const response = await fetch(
//     `${baseUrl}students/verify-email?token=${token}`,
//     {
//       method: "GET",
//     }
//   );

//   const responseData = await response.json();
//   return responseData;
// };
// Подтверждение email ученика
export const fetchVerifyEmail = async (token: string) => {
  try {
    const response = await httpClient.get(`students/verify-email`, {
      params: { token },
    });
    return response.data;
  } catch (error: any) {
    console.error("Ошибка при подтверждении email студента:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Не удалось подтвердить email");
  }
};

