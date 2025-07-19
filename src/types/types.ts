export type SignInFormType = {
  phone: string;
  secretCode: string;
};

export type UpdatePhoneUser = {
  id: string;
  token: string;
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
  isVerifedEmail: boolean;
  region: string;
  avatarUrl: string;
  isNotifications: boolean;
  isNotificationsResponse: boolean;
  isNotificationsPromo: boolean;
  isNotificationsEmail: boolean;
  isNotificationsSms: boolean;
  isNotificationsTelegram: boolean;
  isNotificationsVk: boolean;
  isNotificationsWebPush: boolean;
  isNotificationsMobilePush: boolean;
  telegram: string;
  skype: string;
  status: string;
  orders: Order[];
  lastOnline: Date | null;
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
  isVerifedEmail: boolean;
  avatarUrl: string;
  subject: string[]; // Список id предметов, которые преподает репетитор
  subjectComments: { subjectId: string; comment: string }[]; // Комментарии к предметам
  subjectPrices: TutorSubjectPrice[]; // Новый формат хранения цен (связанные данные)
  region: string;
  tutorPlace: string[];
  tutorAdress: string;
  tutorTrip: string[];
  tutorTripCity: string[];
  tutorTripCityData: string;
  tutorTripArea: string[];
  profileInfo: string;
  experience: string;
  educations: TutorEducation[];
  isGroup: boolean;
  isPublicProfile: boolean;
  isStudentResponses: boolean;
  isNotifications: boolean;
  isNotificationsOrders: boolean;
  isNotificationsResponse: boolean;
  isNotificationsPromo: boolean;
  isNotificationsEmail: boolean;
  isNotificationsSms: boolean;
  isNotificationsTelegram: boolean;
  isNotificationsVk: boolean;
  isNotificationsWebPush: boolean;
  isNotificationsMobilePush: boolean;
  telegram: string;
  skype: string;
  status: string;
  badges: string[];
  lastOnline: Date | null;
  response: Response[];
};

// Возможные значения длительности занятия
export type LessonDuration = "30" |"45" | "60" | "90" | "120" | "day";

// Возможные форматы занятий
export type LessonFormat = "online" | "home" | "travel" | "group";

// Новая модель хранения цен для репетитора
export type TutorSubjectPrice = {
  id: string;
  tutorId: string; // id репетитора
  subjectId: string; // id предмета
  format: LessonFormat; // Формат занятия
  price: number; // Цена
  duration: LessonDuration; // Длительность
};

export type TutorSubjectPriceInput = {
  subjectId: string;
  format: LessonFormat;
  price: number;
  duration: LessonDuration;
};


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
  file: File | null;
  token: string;
  croppedAreaPixels: CroppedAreaPixels | null; // Новое свойство
}

export type TutorEducation = {
  id: string;
  tutorId: string;
  educationInfo: string;   // Название вуза, факультет, специализация
  educationStartYear: string;      // Год начала обучения
  educationEndYear: string;     // Год окончания обучения (опционально, если еще учится)
  educationDiplomUrl: string[];  // УРЛ на фото диплома
  isShowDiplom: boolean; // Показывать ли фото диплома ученикам
  createdAt: string;
  updatedAt: string;
}

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
  id: string;
  createdAt: Date;
  updatedAt: Date;
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
  chats: Chat[];
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

export type WelcomeScreen = {
  id: string;
  title: string;
  content: string;
  link: string;
  userType: string;
  page: string;
  group: string;
  order: number;
  isActive: boolean;
  createAt: Date;
}

export type Topic = {
  id: string;
  title: string;
  description: string;
  themes?: Theme[];
  order: number;
  visibleToRoles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type Theme = {
  id: string;
  topicId: string; // Ссылка на топик
  title: string;
  content: string;
  order: number;
  visibleToRoles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type Chat = {
  id: string;
  tutorId: string;
  studentId: string;
  orderId: string;
  tutorHasAccess: boolean;
  createdAt: Date;
  messages: Message[];
  lastMessage: Message | null;
  tutor: {
    id: string;
    name: string;
    avatarUrl: string;
    lastOnline: string | null;
  };
  student: {
    id: string;
    name: string;
    avatarUrl: string;
    lastOnline: string | null;
  };
  themeOrder: string;
  initiatorRole: string;
  status: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}