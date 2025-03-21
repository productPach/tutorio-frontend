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
      status: "Pending",
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