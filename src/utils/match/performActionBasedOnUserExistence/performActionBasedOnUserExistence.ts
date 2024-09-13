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
