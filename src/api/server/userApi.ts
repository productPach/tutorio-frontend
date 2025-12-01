import { SignInFormType, UpdatePhoneUser } from "@/types/types";
import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

// Получение токенов (обновленная версия)
export const fetchGetToken = async ({ phone, secretCode, role, deviceInfo = "web" }: SignInFormType & { deviceInfo?: string }) => {
  const response = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // для кук refreshToken
    body: JSON.stringify({
      phone: phone,
      secretSMS: secretCode,
      role: role,
      deviceInfo: deviceInfo // добавляем deviceInfo
    }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка авторизации: ${response.status}`);
  }

  const data = await response.json();
  return data.accessToken; // { accessToken, user }
};

// Refresh токенов
export const fetchRefreshToken = async () => {
  const response = await fetch(`${baseUrl}refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Ошибка обновления токена: ${response.status}`);
  }

  const data = await response.json();
  return data.accessToken; // { accessToken }
};

// Logout
export const fetchLogout = async (token: string, logoutAllDevices: boolean = false) => {
  const response = await fetch(`${baseUrl}logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ logoutAllDevices }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка выхода: ${response.status}`);
  }

  return response.json();
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

// Получение баланса пользователя
export const fetchUserBalance = async (): Promise<{ balance: number; updatedAt: string }> => {
  try {
    const response = await httpClient.get(`users-balance`);
    return {
      balance: response.data.balance,
      updatedAt: response.data.updatedAt
    };
  } catch (error: any) {
    console.error('❌ Ошибка запроса users/balance:', error.response?.status, error.response?.data || error.message);
    throw new Error("Не удалось получить баланс пользователя");
  }
};

export const fetchUpdatePhoneUser = async ({
  id: userId,
  phone,
  secretCode,
}: UpdatePhoneUser): Promise<boolean> => {
  // ❌ УДАЛЕНО: передача токена вручную через аргумент функции
  // token больше не нужен, httpClient сам добавит accessToken из localStorage

  try {
    // ✅ ОБНОВЛЕНО: вместо fetch используем httpClient
    const response = await httpClient.put(`/users/${userId}`, {
      phone: phone,
      secretSMS: secretCode,
    });

    // ✅ ОБНОВЛЕНО: axios сам бросает ошибку при !ok,
    // поэтому response всегда успешный здесь
    return response.status === 200;
  } catch (error: any) {
    // ✅ ОБНОВЛЕНО: обработка ошибок через axios
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || "Некорректные данные");
    }
    throw new Error("Ошибка при обновлении юзера");
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

// Просмотр велком-скрина пользователем
export const fetchShowWelcomeScreen = async (id: string) => {
  // ❌ УДАЛЕНО: token из аргументов, httpClient сам подставит токен
  const response = await httpClient.post(`/show-welcome-screen/${id}`);
  // ✅ ОБНОВЛЕНО: axios сразу возвращает JSON в response.data
  return response.data;
};

// Получение велком-скринов для пользователя
export const fetchWelcomeScreens = async () => {
  // ❌ УДАЛЕНО: token из аргументов
  const response = await httpClient.get(`/welcome-screens-user`);
  // ✅ ОБНОВЛЕНО: axios → сразу data
  return response.data;
};

// Удаление запроса на удаление
export const fetchCancelDeleteRequest = async ({
  role,
}: {
  role: "student" | "tutor";
}): Promise<boolean> => {
  // ❌ УДАЛЕНО: token из аргументов
  try {
    const response = await httpClient.post(`/users/cancel-delete-request`, {
      role,
    });
    return response.status === 200; // ✅ ОБНОВЛЕНО: проверка статуса через axios
  } catch (error: any) {
    // ✅ ОБНОВЛЕНО: обработка ошибок через axios
    throw new Error(error.response?.data?.error || "Ошибка при отмене запроса на удаление");
  }
};