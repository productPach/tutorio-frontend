import { getAccessToken, removeAccessToken, setAccessToken } from "@/api/server/auth";
import { fetchRefreshToken } from "@/api/server/userApi";

export const tryRestoreSession = async (): Promise<boolean> => {
  const existingAccess = getAccessToken();

  // 1️⃣ Если токен есть — просто используем его
  if (existingAccess) return true;

  // 2️⃣ Если токена нет — пробуем рефрешнуть
  try {
    const newAccess = await fetchRefreshToken(); // cookie отправится автоматически
    if (newAccess?.accessToken) {
      setAccessToken(newAccess);
      return true;
    }
  } catch (e) {
    console.warn("Сессия истекла или refresh-токен недействителен:", e);
  }

  removeAccessToken();
  return false;
};