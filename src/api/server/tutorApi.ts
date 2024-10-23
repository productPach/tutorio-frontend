import { baseUrl } from "./configApi"

// Регистрация репетитора
export const fetchCreateTutor = async (phone: string, token: string) => {
    const response = await fetch(`${baseUrl}tutors`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },   
        body: JSON.stringify({
            phone: phone,
            status: "Rega: Fullname",
        })
    });

    const data = await response.json();
    return data;
}

// Получение репетитора по токену
export const fetchCurrentTutor = async (token: string) => {
    const response = await fetch(`${baseUrl}currentTutor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Репетитора не существует");
    }
  
    const data = await response.json();
    return data;
  };

// Изменение репетитора
export const fetchUpdateTutor = async (id: string, token: string, status: string, name?: string, email?: string, subject?: string[], region?: string, tutorPlace?: string[], tutorAdress?: string, tutorTrip?: string[]) => {
    const response = await fetch(`${baseUrl}tutors/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },   
        body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            region: region,
            tutorPlace: tutorPlace,
            tutorAdress: tutorAdress,
            tutorTrip: tutorTrip,
            status: status,
        })
    });

    const data = await response.json();
    return data;
}