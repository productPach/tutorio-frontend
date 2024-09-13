export type SignInFormType = {
  phone: string;
  secretCode: string;
};

export type Subject = {
  id: string;
  title: string;
  for_request: string;
  for_chpu: string;
  id_cat: string;
  general: boolean;
  nextPage: string;
  id_p: string;
};

// Определяем тип для объекта в массиве
export type DataItem = {
  id: number;
  subject?: string;
  goal?: string;
  class?: string;
  deadline?: string;
  studentLevel?: string;
  tutorGender?: string;
  timetable?: string;
  studyPlace?: string[];
  studentPlace?: string;
  tutorPlace?: string[]; // заменить на массив
  tutorType?: string;
  info?: string;
  fio?: string;
  [key: string]: any;
};
