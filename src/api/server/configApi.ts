import "dotenv/config";

// Для окружения Docker-compose
export const host = `http://localhost:`;
export const port = `3000`;
export const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    // Клиент
    return process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:3000";
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
//   if (typeof window !== "undefined") {
//     // Клиент (браузер)
//     return `${host}${port}` || "http://localhost:3000";
//   } else {
//     // Сервер (Next.js внутри docker-контейнера)
//     return `http://${process.env.NEXT_PUBLIC_BACKEND_HOST || "tutorio-express"}:${process.env.NEXT_PUBLIC_BACKEND_PORT || "3000"}`;
//   }
// };

export const baseUrl = `${host}${port}/api/`;