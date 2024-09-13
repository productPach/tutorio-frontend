import { baseUrl } from "./configApi"

// Регистрация репетитора
export const fetchCreateTutor = async () => {
    const response = await fetch(`${baseUrl}login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },   
        body: JSON.stringify({
            //phone: phone,
            //secretSMS: secretCode,
        })
    });

    const data = await response.json();
    return data;
}