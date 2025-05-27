import { Order } from "@/types/types";
import { baseUrl } from "./configApi";

// Создание заказа
export const fetchCreateOrder = async (
  token: string,
  subjectDataMatch?: string,
  goalDataMatch?: string,
  classDataMatch?: string,
  studentTypeDataMatch?: string,
  studentYearsDataMatch?: string,
  studentCourseDataMatch?: string,
  studentUniversityDataMatch?: string,
  internationalExamDataMatch?: string,
  studyMethodsDataMatch?: string,
  studyProgrammsDataMatch?: string,
  deadlineDataMatch?: string,
  studentLevelDataMatch?: string,
  tutorGenderDataMatch?: string,
  timetableDataMatch?: string,
  region?: string,
  studyPlaceDataMatch?: string[],
  studentAdressDataMatch?: string,
  studentTripDataMatch?: string[],
  tutorTypeDataMatch?: string,
  autoContacts?: boolean,
  infoDataMatch?: string
) => {
  const response = await fetch(`${baseUrl}orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      subject: subjectDataMatch,
      goal: goalDataMatch,
      studentClass: classDataMatch,
      studentType: studentTypeDataMatch,
      studentYears: studentYearsDataMatch,
      studentCourse: studentCourseDataMatch,
      studentUniversity: studentUniversityDataMatch,
      studentExam: internationalExamDataMatch,
      studyMethod: studyMethodsDataMatch,
      studyProgramm: studyProgrammsDataMatch,
      deadline: deadlineDataMatch,
      studentLevel: studentLevelDataMatch,
      tutorGender: tutorGenderDataMatch,
      studentSchedule: timetableDataMatch,
      region: region,
      studentPlace: studyPlaceDataMatch,
      studentAdress: studentAdressDataMatch,
      studentTrip: studentTripDataMatch,
      tutorType: tutorTypeDataMatch,
      autoContactsOnResponse: autoContacts,
      studentWishes: infoDataMatch,
      status: "Pending",
    }),
  });

  const data: Order = await response.json();
  return data;
};

// Получение списка всех заказов

export const fetchGetAllOrders = async (token: string) => {
  try {
    const response = await fetch(`${baseUrl}orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Проверка, был ли запрос успешным
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    // Парсинг JSON
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при получении списка заказов:", error);
    throw error; // Чтобы обработать ошибку в вызывающем коде, если необходимо
  }
}

// Получение заказов студента по studentId
export const fetchOrdersByStudentId = async (token: string, studentId: string) => {
  try {
    const response = await fetch(`${baseUrl}orders/student/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Возвращаем массив заказов
  } catch (error) {
    console.error("Ошибка при получении заказов студента:", error);
    throw error;
  }
};


// Получение заказа по ID
export const fetchGetOrderById = async (token: string, id: string) => {
  try {
    const response = await fetch(`${baseUrl}orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Проверка, был ли запрос успешным
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    // Парсинг JSON
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при получении заказа:", error);
    throw error; // Чтобы обработать ошибку в вызывающем коде, если необходимо
  }
}

// Получение публичного заказа по ID
export const fetchGetPublicOrderById = async (id: string) => {
  try {
    const response = await fetch(`${baseUrl}public/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Проверка, был ли запрос успешным
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    // Парсинг JSON
    const data: Order = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при получении публичного заказа:", error);
    throw error;
  }
};


// Функция для обновления заказа студента
export async function fetchUpdateOrder(dataToUpdate: {
  id: string;
  token: string;
  studentType?: string;
  studentYears?: string;
  studentClass?: string;
  studentCourse?: string;
  studentUniversity?: string;
  studentExam?: string;
  studyMethod?: string;
  studyProgramm?: string;
  deadline?: string;
  studentLevel?: string;
  tutorGender?: string;
  studentSchedule?: string[];
  studentPlace?: string[];
  studentAdress?: string;
  studentHomeLoc?: string;
  studentTrip?: string[];
  tutorType?: string;
  autoContactsOnResponse?: boolean;
  studentWishes?: string;
  responseCost?: number;
  status?: string;
}): Promise<Order> {
  try {
    const response = await fetch(`${baseUrl}/orders/${dataToUpdate.id}`, {
      method: "PATCH", // Метод PUT для обновления данных
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dataToUpdate.token}`, // Добавление токена для аутентификации
      },
      body: JSON.stringify(dataToUpdate), // Отправляем обновляемые данные в теле запроса
    });

    if (!response.ok) {
      throw new Error(`Ошибка обновления заказа: ${response.statusText}`);
    }

    const updatedOrder: Order = await response.json(); // Предполагаем, что API возвращает обновленный заказ
    return updatedOrder;
  } catch (error) {
    console.error("Ошибка при отправке запроса на обновление заказа:", error);
    throw error;
  }
}
