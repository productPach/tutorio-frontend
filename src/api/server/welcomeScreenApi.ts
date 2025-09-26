import { baseUrl } from "./configApi";
import httpClient from "./httpClient";

// Создание велком-скрина
// export const fetchCreateWelcomeScreen = async (token: string, title: string, content: string, userType: string, page: string, group: string, order: number) => {
//     const response = await fetch(`${baseUrl}welcome-screens`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },   
//         body: JSON.stringify({
//             title: title,
//             content: content,
//             userType: userType,
//             page: page,
//             group: group,
//             order: order,
//         })
//     });

//     const data = await response.json();
//     return data;
// }
// Создание велком-скрина
export const fetchCreateWelcomeScreen = async (
  title: string,
  content: string,
  userType: string,
  page: string,
  group: string,
  order: number
) => {
  try {
    const response = await httpClient.post("welcome-screens", {
      title,
      content,
      userType,
      page,
      group,
      order,
    });

    console.log(`✅ Велком-скрин "${title}" создан:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      `❌ Ошибка при создании велком-скрина "${title}":`,
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};


// Получение списка всех велком-скринов

// Обновление велком-скрина

// Удаление велком-скрина

