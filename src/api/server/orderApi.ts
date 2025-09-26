import { Order } from "@/types/types";
import { baseUrl, getBackendUrl } from "./configApi";
import httpClient from "./httpClient";

// // Создание заказа
// export const fetchCreateOrder = async (
//   token: string,
//   subjectDataMatch?: string,
//   goalDataMatch?: string,
//   classDataMatch?: string,
//   studentTypeDataMatch?: string,
//   studentYearsDataMatch?: string,
//   studentCourseDataMatch?: string,
//   studentUniversityDataMatch?: string,
//   internationalExamDataMatch?: string,
//   studyMethodsDataMatch?: string,
//   studyProgrammsDataMatch?: string,
//   deadlineDataMatch?: string,
//   studentLevelDataMatch?: string,
//   tutorGenderDataMatch?: string,
//   timetableDataMatch?: string,
//   region?: string,
//   studyPlaceDataMatch?: string[],
//   studentAdressDataMatch?: string,
//   studentTripDataMatch?: string[],
//   tutorTypeDataMatch?: string,
//   autoContacts?: boolean,
//   infoDataMatch?: string
// ) => {
//   const response = await fetch(`${baseUrl}orders`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       subject: subjectDataMatch,
//       goal: goalDataMatch,
//       studentClass: classDataMatch,
//       studentType: studentTypeDataMatch,
//       studentYears: studentYearsDataMatch,
//       studentCourse: studentCourseDataMatch,
//       studentUniversity: studentUniversityDataMatch,
//       studentExam: internationalExamDataMatch,
//       studyMethod: studyMethodsDataMatch,
//       studyProgramm: studyProgrammsDataMatch,
//       deadline: deadlineDataMatch,
//       studentLevel: studentLevelDataMatch,
//       tutorGender: tutorGenderDataMatch,
//       studentSchedule: timetableDataMatch,
//       region: region,
//       studentPlace: studyPlaceDataMatch,
//       studentAdress: studentAdressDataMatch,
//       studentTrip: studentTripDataMatch,
//       tutorType: tutorTypeDataMatch,
//       autoContactsOnResponse: autoContacts,
//       studentWishes: infoDataMatch,
//       status: "Pending",
//     }),
//   });

//   const data: Order = await response.json();
//   return data;
// };
// Создание заказа
export const fetchCreateOrder = async (
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
): Promise<Order> => {
  try {
    const response = await httpClient.post(`orders`, {
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
    });
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при создании заказа:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// // Получение списка всех заказов
// export const fetchGetAllOrders = async (token: string) => {
//   try {
//     const response = await fetch(`${baseUrl}orders`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Проверка, был ли запрос успешным
//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     // Парсинг JSON
//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Ошибка при получении списка заказов:", error);
//     throw error; // Чтобы обработать ошибку в вызывающем коде, если необходимо
//   }
// }
// Получение списка всех заказов
export const fetchGetAllOrders = async () => {
  try {
    const response = await httpClient.get(`orders`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Ошибка при получении списка заказов:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// // Получение заказов студента по studentId
// export const fetchOrdersByStudentId = async (token: string, studentId: string) => {
//   try {
//     const response = await fetch(`${baseUrl}orders/student/${studentId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data; // Возвращаем массив заказов
//   } catch (error) {
//     console.error("Ошибка при получении заказов студента:", error);
//     throw error;
//   }
// };
// Получение заказов студента по studentId
export const fetchOrdersByStudentId = async (studentId: string) => {
  try {
    const response = await httpClient.get(`orders/student/${studentId}`);
    return response.data; // Возвращаем массив заказов
  } catch (error: any) {
    console.error(`❌ Ошибка при получении заказов студента ${studentId}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};



// // Получение заказа по ID
// export const fetchGetOrderById = async (token: string, id: string) => {
//   try {
//     const response = await fetch(`${baseUrl}orders/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Проверка, был ли запрос успешным
//     if (!response.ok) {
//       throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//     }

//     // Парсинг JSON
//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Ошибка при получении заказа:", error);
//     throw error; // Чтобы обработать ошибку в вызывающем коде, если необходимо
//   }
// }
// Получение заказа по ID
export const fetchGetOrderById = async (id: string) => {
  try {
    const response = await httpClient.get(`orders/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при получении заказа ${id}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


// Получение публичного заказа по ID
export const fetchGetPublicOrderById = async (id: string) => {
  try {
    const response = await fetch(`${getBackendUrl()}/api/public/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Если заказ не найден, просто вернём null
    if (response.status === 404) {
      return null;
    }

    // Остальные ошибки (500 и прочее) можно логировать
    if (!response.ok) {
      console.error(`Ошибка запроса: ${response.status} — ${response.statusText}`);
      return null;
    }

    const data: Order = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при получении публичного заказа:", error);
    return null;
  }
};



// // Функция для обновления заказа студента
// export async function fetchUpdateOrder(dataToUpdate: {
//   id: string;
//   token: string;
//   studentType?: string;
//   studentYears?: string;
//   studentClass?: string;
//   studentCourse?: string;
//   studentUniversity?: string;
//   studentExam?: string;
//   studyMethod?: string;
//   studyProgramm?: string;
//   deadline?: string;
//   studentLevel?: string;
//   tutorGender?: string;
//   studentSchedule?: string[];
//   studentPlace?: string[];
//   studentAdress?: string;
//   studentHomeLoc?: string;
//   studentTrip?: string[];
//   tutorType?: string;
//   autoContactsOnResponse?: boolean;
//   studentWishes?: string;
//   responseCost?: number;
//   status?: string;
// }): Promise<Order> {
//   try {
//     const response = await fetch(`${baseUrl}/orders/${dataToUpdate.id}`, {
//       method: "PATCH", // Метод PUT для обновления данных
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${dataToUpdate.token}`, // Добавление токена для аутентификации
//       },
//       body: JSON.stringify(dataToUpdate), // Отправляем обновляемые данные в теле запроса
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка обновления заказа: ${response.statusText}`);
//     }

//     const updatedOrder: Order = await response.json(); // Предполагаем, что API возвращает обновленный заказ
//     return updatedOrder;
//   } catch (error) {
//     console.error("Ошибка при отправке запроса на обновление заказа:", error);
//     throw error;
//   }
// }
// Обновление заказа студента
export async function fetchUpdateOrder(dataToUpdate: {
  id: string;
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
    const { id, ...fields } = dataToUpdate;
    const response = await httpClient.patch(`orders/${id}`, fields);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Ошибка при обновлении заказа ${dataToUpdate.id}:`, error.response?.status, error.response?.data || error.message);
    throw error;
  }
}
