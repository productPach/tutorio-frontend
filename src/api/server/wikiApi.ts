import { Theme, Topic } from "@/types/types";
import { baseUrl } from "./configApi";

// Создание нового топика
export const fetchCreateTopic = async (token: string, topic: Omit<Topic, "id" | "createdAt" | "updatedAt">): Promise<Topic> => {
    try {
      const response = await fetch(`${baseUrl}topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, },
        body: JSON.stringify(topic),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при создании топика:", error);
      throw error;
    }
  };

// Получение всех топиков
export const fetchGetAllTopics = async (token: string): Promise<Topic[]> => {
  try {
    const response = await fetch(`${baseUrl}topics`, {
      method: "GET",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении топиков:", error);
    throw error;
  }
};

// Получение топика по ID
export const fetchGetTopicById = async (id: string, token?:string): Promise<Topic> => {
    try {
      const response = await fetch(`${baseUrl}topics/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении топика по ID:", error);
      throw error;
    }
  };
  
// Обновление топика
export const fetchUpdateTopic = async (id: string, updatedTopic: Partial<Topic>, token: string): Promise<Topic> => {
    try {
      const response = await fetch(`${baseUrl}topics/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTopic),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при обновлении топика:", error);
      throw error;
    }
  };
  

// Удаление топика
export const fetchDeleteTopic = async (id: string, token: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${baseUrl}topics/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении топика:", error);
    throw error;
  }
};

// Получение всех тем
export const fetchGetAllThemes = async (token: string): Promise<Theme[]> => {
    try {
      const response = await fetch(`${baseUrl}themes`, {
        method: "GET",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении тем:", error);
      throw error;
    }
  };
  
  // Получение тем для конкретного топика
  export const fetchGetThemesByTopic = async (topicId: string, token?: string): Promise<Theme[]> => {
    try {
      const response = await fetch(`${baseUrl}topics/${topicId}/themes`, {
        method: "GET",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении тем для топика:", error);
      throw error;
    }
  };
  
  // Создание новой темы в топике
  export const fetchCreateTheme = async (topicId: string, newTheme: Omit<Theme, "id" | "createdAt" | "updatedAt">, token: string): Promise<Theme> => {
    try {
      const response = await fetch(`${baseUrl}topics/${topicId}/themes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTheme),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при создании темы:", error);
      throw error;
    }
  };
  
  
  // Получение темы по ID
  export const fetchGetThemeById = async (themeId: string, token: string): Promise<Theme> => {
    try {
      const response = await fetch(`${baseUrl}themes/${themeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении темы по ID:", error);
      throw error;
    }
  };
  

  // Обновление темы
  export const fetchUpdateTheme = async (themeId: string, updatedTheme: Partial<Theme>, token: string): Promise<Theme> => {
    try {
      const response = await fetch(`${baseUrl}themes/${themeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTheme),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при обновлении темы:", error);
      throw error;
    }
  };
  
  
  // Удаление темы
  export const fetchDeleteTheme = async (themeId: string, token: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${baseUrl}themes/${themeId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при удалении темы:", error);
      throw error;
    }
  };
  