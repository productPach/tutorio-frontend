import { SignInFormType } from "@/types/types";
import { baseUrl } from "./configApi";

// Получение токена
export const fetchGetToken = async ({ phone, secretCode }: SignInFormType) => {
  const response = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      secretSMS: secretCode,
    }),
  });

  const data = await response.json();
  return data;
};

// Проверка пользователя по номеру телефона
export const fetchExistUser = async (phone: string) => {
  const response = await fetch(`${baseUrl}users-phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
    }),
  });
  if (response.status == 200) {
    // Пользователь не существует
    const data = true;
    return data;
  }
  if (response.status == 400) {
    // Пользователь существует
    const data = false;
    return data;
  }
};

// Изменение секретного кода
export const fetchUpdSecretUser = async ({
  phone,
  secretCode,
}: SignInFormType) => {
  const response = await fetch(`${baseUrl}users-secret`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      secretSMS: secretCode,
    }),
  });

  if (response.status == 200) {
    const data = true;
    return data;
  }
};

// Регистрация пользователя
export const fetchCreateUser = async ({
  phone,
  secretCode,
}: SignInFormType) => {
  const response = await fetch(`${baseUrl}register-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      secretSMS: secretCode,
    }),
  });

  const data = await response.json();
  return data;
};

// Просмотор велком-скрина пользователем
export const fetchShowWelcomeScreen = async (token: string, id: string) => {
  const response = await fetch(`${baseUrl}show-welcome-screen/${id}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
  });

  const data = await response.json();
  return data;
}

// Получение велком-скринов для пользователя
export const fetchWelcomeScreens = async (token: string) => {
  const response = await fetch(`${baseUrl}welcome-screens-user`, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });

  const data = await response.json();
  return data;
};