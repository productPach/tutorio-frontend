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
  studyPlaceDataMatch?: string[],
  studentAdressDataMatch?: string,
  studentTripDataMatchDEV?: string[],
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
      studentPlace: studyPlaceDataMatch,
      studentAdress: studentAdressDataMatch,
      studentTrip: studentTripDataMatchDEV,
      tutorType: tutorTypeDataMatch,
      studentWishes: infoDataMatch,
    }),
  });

  const data = await response.json();
  return data;
};
