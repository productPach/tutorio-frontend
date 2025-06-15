import { Order } from "@/types/types";

// Вытаскиваем актуальный массив c данными формы из LocalStorage
export const getDataMatchLS = localStorage.getItem("currentMatch");
// Конвертируем массив c данными формы из JSON в JS объект
const dataMatch: Order[] = getDataMatchLS ? JSON.parse(getDataMatchLS) : [];

export const subjectDataMatch = dataMatch.find((obj) => Number(obj.id) === 0)?.subject;
export const goalDataMatch = dataMatch.find((obj) => Number(obj.id) === 1)?.goal;
export const classDataMatch = dataMatch.find((obj) => Number(obj.id) === 2)?.class;
export const studentTypeDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 3
)?.studentType;
export const studentCourseDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 4
)?.studentCourse;
export const deadlineDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 5
)?.deadline;
export const studentLevelDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 6
)?.studentLevel;
export const studentYearsDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 7
)?.studentYears;
export const tutorGenderDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 8
)?.tutorGender;
export const studentUniversityDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 9
)?.studentUniversity;
export const internationalExamDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 10
)?.internationalExam;
export const studyMethodsDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 11
)?.studyMethods;
export const studyProgrammsDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 12
)?.studyProgramms;
export const timetableDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 13
)?.timetable;
export const studyPlaceDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 14
)?.studyPlace;
export const studentAdressDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 15
)?.studentAdress;
export const studentTripDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 16
)?.studentTrip;
export const tutorTypeDataMatch = dataMatch.find(
  (obj) => Number(obj.id) === 17
)?.tutorType;
export const infoDataMatch = dataMatch.find((obj) => Number(obj.id) === 18)?.info;
export const fioDataMatch = dataMatch.find((obj) => Number(obj.id) === 19)?.fio;
export const phoneDataMatch = dataMatch.find((obj) => Number(obj.id) === 20)?.phone;
