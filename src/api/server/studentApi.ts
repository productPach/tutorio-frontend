import { baseUrl } from "./configApi";

// Регистрация ученика
export const fetchCreateStudent = async (
  name: string,
  phone: string,
  avatarUrl: string,
  region: string,
  token: string
) => {
  const response = await fetch(`${baseUrl}students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      phone: phone,
      avatarUrl: avatarUrl,
      region: region,
      status: "Active",
    }),
  });

  const data = await response.json();
  return data;
};

// Получение ученика по токену
export const fetchCurrentStudent = async (token: string) => {
  const response = await fetch(`${baseUrl}currentStudent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Студент не существует");
  }

  const data = await response.json();
  return data;
};

// Получение ученика по ID
export const fetchStudentById = async (token: string, id: string) => {
  const response = await fetch(`${baseUrl}students/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Студент не существует");
  }

  const data = await response.json();
  return data.student;
};

// Изменение репетитора
export const fetchUpdateStudent = async (data: {
  id: string;
  token: string;
  status: string;
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
}) => {
  const { id, token, ...fields } = data;

  const response = await fetch(`${baseUrl}students/${id}`, {
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

export const fetchDeleteRequest = async (
  studentId: string,
  answer: string,
  token: string
): Promise<void> => {
  const res = await fetch(`${baseUrl}students/delete-request/${studentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });

  if (!res.ok) {
    throw new Error("Ошибка при создании запроса на удаление ученика");
  }
};

export const sendVerificationEmail = async (
  studentId: string,
  token: string
) => {
  const response = await fetch(`${baseUrl}send-verification-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Передаем токен в заголовке
    },
    body: JSON.stringify({ id: studentId, userType: "student" }), // Передаем ID в теле запроса
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Ошибка при отправке письма: ${data.error || "Неизвестная ошибка"}`
    );
  }

  return data;
};

// Функция для подтверждения email
export const fetchVerifyEmail = async (token: string) => {
  const response = await fetch(
    `${baseUrl}students/verify-email?token=${token}`,
    {
      method: "GET",
    }
  );

  const responseData = await response.json();
  return responseData;
};
