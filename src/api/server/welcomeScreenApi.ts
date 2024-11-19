import { baseUrl } from "./configApi";

// Создание велком-скрина
export const fetchCreateWelcomeScreen = async (token: string, title: string, content: string, userType: string, page: string, group: string, order: number) => {
    const response = await fetch(`${baseUrl}welcome-screens`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },   
        body: JSON.stringify({
            title: title,
            content: content,
            userType: userType,
            page: page,
            group: group,
            order: order,
        })
    });

    const data = await response.json();
    return data;
}

// Получение списка всех велком-скринов

// Обновление велком-скрина

// Удаление велком-скрина

