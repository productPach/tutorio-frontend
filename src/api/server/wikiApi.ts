import { Theme, Topic } from "@/types/types";
import { baseUrl, getBackendUrl } from "./configApi";
import httpClient from "./httpClient";

// // Создание нового топика
// export const fetchCreateTopic = async (token: string, topic: Omit<Topic, "id" | "createdAt" | "updatedAt">): Promise<Topic> => {
//     try {
//       const response = await fetch(`${baseUrl}topics`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, },
//         body: JSON.stringify(topic),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Ошибка при создании топика:", error);
//       throw error;
//     }
//   };
  // Создание нового топика
  export const fetchCreateTopic = async (
    topic: Omit<Topic, "id" | "createdAt" | "updatedAt">
  ): Promise<Topic> => {
    try {
      const response = await httpClient.post("topics", topic);
      console.log(`✅ Топик "${topic.title}" создан:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при создании топика "${topic.title}":`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };


// // Получение всех топиков
// export const fetchGetAllTopics = async (token: string): Promise<Topic[]> => {
//   try {
//     const response = await fetch(`${baseUrl}topics`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, },
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при получении топиков:", error);
//     throw error;
//   }
// };
  // Получение всех топиков
  export const fetchGetAllTopics = async (): Promise<Topic[]> => {
    try {
      const response = await httpClient.get("topics");
      console.log("✅ Все топики получены:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Ошибка при получении топиков:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };


// // Получение топика по ID
// export const fetchGetTopicById = async (id: string, token?:string): Promise<Topic> => {
//     try {
//       const response = await fetch(`${getBackendUrl()}/api/topics/${id}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, },
//       });
  
//       if (!response.ok) {
//         throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Ошибка при получении топика по ID:", error);
//       throw error;
//     }
//   };
  // Получение топика по ID
  export const fetchGetTopicById = async (id: string): Promise<Topic> => {
    try {
      const response = await httpClient.get(`topics/${id}`);
      console.log(`✅ Топик ${id} получен:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при получении топика ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  
// // Обновление топика
// export const fetchUpdateTopic = async (id: string, updatedTopic: Partial<Topic>, token: string): Promise<Topic> => {
//     try {
//       const response = await fetch(`${baseUrl}topics/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedTopic),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Ошибка при обновлении топика:", error);
//       throw error;
//     }
//   };
  // Обновление топика
  export const fetchUpdateTopic = async (id: string, updatedTopic: Partial<Topic>): Promise<Topic> => {
    try {
      const response = await httpClient.patch(`topics/${id}`, updatedTopic);
      console.log(`✅ Топик ${id} обновлён:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при обновлении топика ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  

// // Удаление топика
// export const fetchDeleteTopic = async (id: string, token: string): Promise<{ message: string }> => {
//   try {
//     const response = await fetch(`${baseUrl}topics/${id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, },
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка при удалении топика:", error);
//     throw error;
//   }
// };
  // Удаление топика
  export const fetchDeleteTopic = async (id: string): Promise<{ message: string }> => {
    try {
      const response = await httpClient.delete(`topics/${id}`);
      console.log(`✅ Топик ${id} удалён:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при удалении топика ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };


// // Получение всех тем
// export const fetchGetAllThemes = async (token: string): Promise<Theme[]> => {
//     try {
//       const response = await fetch(`${baseUrl}themes`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, },
//       });
  
//       if (!response.ok) {
//         throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Ошибка при получении тем:", error);
//       throw error;
//     }
//   };
  // Получение всех тем
  export const fetchGetAllThemes = async (): Promise<Theme[]> => {
    try {
      const response = await httpClient.get('themes');
      console.log(`✅ Темы получены:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при получении тем:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };
  
  // // Получение тем для конкретного топика
  // export const fetchGetThemesByTopic = async (topicId: string, token?: string): Promise<Theme[]> => {
  //   try {
  //     const response = await fetch(`${baseUrl}topics/${topicId}/themes`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  //     }
  
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Ошибка при получении тем для топика:", error);
  //     throw error;
  //   }
  // };
  // Получение тем для конкретного топика
  export const fetchGetThemesByTopic = async (topicId: string): Promise<Theme[]> => {
    try {
      const response = await httpClient.get(`topics/${topicId}/themes`);
      console.log(`✅ Темы для топика ${topicId} получены:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Ошибка при получении тем для топика ${topicId}:`, error.response?.status, error.response?.data || error.message);
      throw error;
    }
  };

  
  // // Создание новой темы в топике
  // export const fetchCreateTheme = async (topicId: string, newTheme: Omit<Theme, "id" | "createdAt" | "updatedAt">, token: string): Promise<Theme> => {
  //   try {
  //     const response = await fetch(`${baseUrl}topics/${topicId}/themes`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(newTheme),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  //     }
  
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Ошибка при создании темы:", error);
  //     throw error;
  //   }
  // };
  // Создание новой темы в топике
  export const fetchCreateTheme = async (
    topicId: string,
    newTheme: Omit<Theme, "id" | "createdAt" | "updatedAt">
  ): Promise<Theme> => {
    try {
      const response = await httpClient.post(`topics/${topicId}/themes`, newTheme);
      console.log(`✅ Тема создана в топике ${topicId}:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при создании темы в топике ${topicId}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  
  
  // // Получение темы по ID
  // export const fetchGetThemeById = async (themeId: string, token: string): Promise<Theme> => {
  //   try {
  //     const response = await fetch(`${baseUrl}themes/${themeId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  //     }
  
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Ошибка при получении темы по ID:", error);
  //     throw error;
  //   }
  // };
  // Получение темы по ID
  export const fetchGetThemeById = async (themeId: string): Promise<Theme> => {
    try {
      const response = await httpClient.get(`themes/${themeId}`);
      console.log(`✅ Тема ${themeId} получена:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при получении темы ${themeId}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  

  // // Обновление темы
  // export const fetchUpdateTheme = async (themeId: string, updatedTheme: Partial<Theme>, token: string): Promise<Theme> => {
  //   try {
  //     const response = await fetch(`${baseUrl}themes/${themeId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedTheme),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  //     }
  
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Ошибка при обновлении темы:", error);
  //     throw error;
  //   }
  // };
  // Обновление темы
  export const fetchUpdateTheme = async (themeId: string, updatedTheme: Partial<Theme>): Promise<Theme> => {
    try {
      const response = await httpClient.patch(`themes/${themeId}`, updatedTheme);
      console.log(`✅ Тема ${themeId} обновлена:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при обновлении темы ${themeId}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  
  
  // // Удаление темы
  // export const fetchDeleteTheme = async (themeId: string, token: string): Promise<{ message: string }> => {
  //   try {
  //     const response = await fetch(`${baseUrl}themes/${themeId}`, {
  //       method: "DELETE",
  //       headers: { 
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //        },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  //     }
  
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Ошибка при удалении темы:", error);
  //     throw error;
  //   }
  // };
  // Удаление темы
  export const fetchDeleteTheme = async (themeId: string): Promise<{ message: string }> => {
    try {
      const response = await httpClient.delete(`themes/${themeId}`);
      console.log(`✅ Тема ${themeId} удалена:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Ошибка при удалении темы ${themeId}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  