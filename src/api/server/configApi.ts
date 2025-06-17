import "dotenv/config";

// Для окружения Docker-compose
//export const host = `https://51.250.20.10:`;
export const host = `https://dev-tutorio.ru:`;
export const port = `3000`;
export const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    // Клиент
    //return process.env.NEXT_PUBLIC_CDN_URL || "http://84.201.140.78:3000";
    //return process.env.NEXT_PUBLIC_CDN_URL || "https://51.250.20.10";
    return process.env.NEXT_PUBLIC_CDN_URL || "https://dev-tutorio.ru";
  } else {
    // Сервер (Next.js внутри докера)
    return `http://${process.env.NEXT_PUBLIC_BACKEND_HOST || "tutorio-express"}:${process.env.NEXT_PUBLIC_BACKEND_PORT || "3000"}`;
  }
};
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

// Для окружения фронт локально, сервер удаленно
// export const host = `http://${process.env.NEXT_PUBLIC_IP}:`;
// export const port = process.env.NEXT_PUBLIC_PORT;
// export const getBackendUrl = () => {
//     // Клиент (браузер)
//     return `${host}${port}` || "http://localhost:3000";
// };

//export const baseUrl = `${host}${port}/api/`;
export const baseUrl = `${host}/api/`;