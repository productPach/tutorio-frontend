import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

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
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании студента:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// Получение ученика по токену
export const fetchCurrentStudent = async () => {
  try {
    const response = await httpClient.get(`currentStudent`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при получении текущего студента:', error.response?.status, error.response?.data || error.message);
    throw new Error("Студент не существует");
  }
};

// Получение телефона ученика по ID
export const fetchStudentPhoneById = async (id: string): Promise<string> => {
  try {
    const response = await httpClient.get(`students/${id}/phone`);
    return response.data.phone as string;
  } catch (error: any) {
    console.error(`❌ Ошибка при получении телефона студента ${id}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить номер телефона ученика");
  }
};

// Получение ученика по ID
export const fetchStudentById = async (id: string) => {
  try {
    const response = await httpClient.get(`students/${id}`);
    return response.data.student;
  } catch (error: any) {
    console.error(`❌ Ошибка при получении студента ${id}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Студент не существует");
  }
};

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
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при обновлении студента ${id}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// Создание запроса на удаление ученика
export const fetchDeleteRequest = async (studentId: string, answer: string): Promise<void> => {
  try {
    await httpClient.post(`students/delete-request/${studentId}`, { answer });
  } catch (error: any) {
    console.error(`❌ Ошибка при создании запроса на удаление ученика ${studentId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error("Ошибка при создании запроса на удаление ученика");
  }
};

// Отправка письма для подтверждения email ученика
export const sendVerificationEmail = async (studentId: string) => {
  try {
    const response = await httpClient.post(`send-verification-email`, {
      id: studentId,
      userType: "student",
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при отправке письма студенту ${studentId}:`, error.response?.status, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Ошибка при отправке письма");
  }
};

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

// Проверка ученика по номеру телефона
export const fetchExistStudent = async (phone: string) => {
  const response = await fetch(`${baseUrl}students-phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
    }),
  });
  if (response.status == 200) {
    // Ученика не существует
    const data = true;
    return data;
  }
  if (response.status == 400) {
    // Ученик существует
    const data = false;
    return data;
  }
};