import { fetchCreateStudent } from "@/api/server/studentApi";
import {
  fetchCreateUser,
  fetchExistUser,
  fetchUpdSecretUser,
} from "@/api/server/userApi";

// Проверяем есть ли пользователь
export const performActionBasedOnUserExistence = async (
  to: string,
  secretCode: string
) => {
  const phone = to;
  const existUser = await fetchExistUser(phone);
  if (existUser) {
    // Регистрация нового пользователя
    fetchCreateUser({ phone, secretCode });
  } else {
    // Если пользователь есть, обновляем секретный код в БД
    fetchUpdSecretUser({ phone, secretCode });
  }
};

// Проверяем есть ли пользователь
export const userExistence = async (
  to: string,
  oldPhone: string,
  secretCode: string
) => {
  const newPhone = to;
  const existUser = await fetchExistUser(newPhone);
  if (existUser) {
    // Если пользователя с новым номером телефона нет, обновляем секретный код в БД для пользователя с еще старым телефоном
    fetchUpdSecretUser({ phone: oldPhone, secretCode });
  }

  return existUser; // Возвращаем результат
};