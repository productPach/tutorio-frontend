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
};

export type UserRegion = {
  city: string;
  area: string;
};

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
  status: string;
  orders: Order[];
};

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
  region: string;
  tutorPlace: string[];
  tutorAdress: string;
  tutorTrip: string[];
  status: string;
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
  status: string;
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
  goal_id?: string;
};

export type GoalForSubject = {
  id: string;
  goals: string[];
};

// Определяем тип для объекта заказа в массиве
export type Order = {
  id: number;
  createdAt: Date;
  studentId: string;
  subject?: string;
  goal?: string;
  studentClass?: string;
  studentType?: string;
  studentYears?: string;
  studentCourse?: string;
  studentUniversity?: string;
  studentExam?: string;
  studyMethod?: string;
  studyProgramm?: string;
  deadline?: string;
  studentLevel?: string;
  tutorGender?: string;
  studentSchedule?: string;
  region?: string;
  studentPlace?: string[];
  studentAdress?: string;
  studentHomeLoc?: string[];
  studentTrip?: string[]; // заменить на массив
  tutorType?: string;
  studentWishes?: string;
  autoContactsOnResponse: boolean,
  responseCost: string;
  [key: string]: any;
  status: string;
};

export type Response = {};

// export type District = {
//   id: string;
//   city: string;
//   title: string;
//   metro: Metro[];
// };

// export type Metro = {
//   id: string;
//   title: string;
//   color: string;
//   lineName: string;
//   lineNumber: string;
// };

export type City = {
  id: string;
  title: string;
  area: string;
  shortTitle: string;
  districts: District[];
  regionalCities: RegionalCity[]
};

export type District = {
  id: string;
  title: string;
  metros: Metro[];
};

export type Metro = {
  id: string;
  title: string;
  color: string;
  lineName: string;
  lineNumber: string;
};

export type RegionalCity = {
  id: string;
  title: string;
}

export interface UpdateTutorAvatarResponse {
  id: string;
  avatarUrl: string;
}

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UpdateTutorAvatarPayload {
  id: string;
  file: File;
  token: string;
  croppedAreaPixels: CroppedAreaPixels; // Новое свойство
}