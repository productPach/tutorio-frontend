export type SignInFormType = {
  phone: string;
  secretCode: string;
};

export type User = {
  id: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  student: Student;
  tutor: Tutor;
  employee: Employee;
}

export type Student = {
  id: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  orders: Order[];
}

export type Tutor = {
  id: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  subject: string[];
  geo: string;
  tutorPlace: string[];
  tutorAdress: string;
  tutorTrip: string[];
  response: Response[];
};

export type Employee = {
  id: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  location: string;
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

// Определяем тип для объекта заказа в массиве
export type Order = {
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
  tutorPlace?: string; // заменить на массив
  tutorType?: string;
  info?: string;
  fio?: string;
  [key: string]: any;
};

export type Response = {

}