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
      studentWishes: infoDataMatch,
      status: "Pending",
    }),
  });

  const data = await response.json();
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