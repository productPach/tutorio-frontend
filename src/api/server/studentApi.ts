import { baseUrl } from "./configApi";

// Регистрация ученика
export const fetchCreateStudent = async (
  name: string,
  phone: string,
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
