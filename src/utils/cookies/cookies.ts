import Cookies from "js-cookie";

// Установка cookie
export const setCookie = (
  name: string,
  value: string,
  days: number,
  options = {}
) => {
  Cookies.set(name, value, {
    expires: days,
    path: "/", // путь куки на корень
    secure: true, // кука будет передана только по HTTPS
    //httpOnly: true, // Однако важно помнить, что библиотека js-cookie не поддерживает установку HttpOnly со стороны клиента
    sameSite: "Strict", // кука будет отправляться только в том случае, если запрос происходит с того же сайта, что и кука
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
