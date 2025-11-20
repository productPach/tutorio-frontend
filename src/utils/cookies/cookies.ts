import Cookies from "js-cookie";

// Установка cookie
export const setCookie = (
  name: string,
  value: string | object,
  days: number,
  options = {}
) => {
  const stringValue = typeof value === "string" ? value : JSON.stringify(value); // Преобразуем объект в строку, если нужно
  Cookies.set(name, stringValue, {
    expires: days,
    path: "/", // путь куки на корень
    //secure: true, // кука будет передана только по HTTPS
    secure: process.env.NEXT_PUBLIC_ENV === "production", // Убираем secure для localhost
    //httpOnly: true, // Однако важно помнить, что библиотека js-cookie не поддерживает установку HttpOnly со стороны клиента
    sameSite: "Lax", // кука будет отправляться только в том случае, если запрос происходит с того же сайта, что и кука
    ...options,
  });
};

// Чтение cookie
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

// Удаление cookie
export const removeCookie = (name: string, options = {}) => {
  Cookies.remove(name, options);
};

// Функция загрузки токена из куки
export const getTokenFromCookie = () => {
  const token = getCookie("accessToken");
  return token;
};
