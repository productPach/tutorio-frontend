// Возможные значения ролей
export type Role = "student" |"tutor" | "admin";

export type SignInFormType = {
  phone: string;
  secretCode: string;
  role?: Role;
};

export type UpdatePhoneUser = {
  id: string;
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
  area?: string;
  slug?: string;
};

export type Student = {
  id: string;
  userId: string;
  user: User;
  studentNumber: string;
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
  [x: string]: any;
  id: string;
  userId: string;
  user: User;
  tutorNumber: string;
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
  tutorGoals: TutorGoal[];
  region: string;
  tutorPlace: string[];
  tutorAdress: string;
  tutorTrip: string[];
  tutorTripCity: string[];
  tutorTripCityData: string;
  tutorTripArea: string[];
  tutorHomeLoc: string[];
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
  telegramConnectToken: string;
  telegramId: string;
  skype: string;
  status: string;
  badges: string[];
  lastOnline: Date | null;
  response: Response[];
  userRating: number;
  reviewsCount: number;
  reviews: Review[];
};

// Возможные значения длительности занятия
export type LessonDuration = "30" |"45" | "60" | "90" | "120" | "day";

// Возможные форматы занятий
export type LessonFormat = "online" | "home" | "travel" | "group";

// Новая модель хранения цен для репетитора
export type TutorSubjectPrice = {
  _id?: { $oid: string };
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

export type TutorGoal = {
  id: string;
  tutorId: string;
  subjectId: string;
  goalId: string;
}

export type DisplayTutorGoal = { 
  id: string; 
  title: string 
  selected?: boolean;
};

export type Employee = {
  id: string;
  userId: string;
  user: User;
  employeeNumber: string;
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

export type Goal = {
  id: string;
  title: string;
  goalSlug: string;
  for_request: string
  subjectId: string;
  isGoalInOrder: boolean;
  isTutorFilter: boolean;
  selected: boolean;
};

export type GoalForSubject = {
  id: string;
  goals: string[];
};

// Определяем тип для объекта заказа в массиве
export type Order = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
  subject?: string;
  goal?: string;
  goalId: string;
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
  selectedTutors: SelectedTutors[];
  [key: string]: any;
  status: string;
};

export type SelectedTutors = {
  id: string;
  name: string;
  avatarUrl: string;
  userRating: number;
  reviews: Review[];
  // reviewsCount: number; // не нужно
  reviewId: string;
  reviewStatus: string;
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
  region_name_dative?: string;
  slug?: string;
  metros: Metro[];
  districts: District[];
  regionalCities: RegionalCity[]
};

export type District = {
  id: string;
  title: string;
  type: string;
  metros?: Metro[]; // надо убрать
  displayTitle?: string; 
  displayType?: string // для UI
  lineNumber?: string
};

export type Metro = {
  id: string;
  title: string;
  color: string;
  lineName: string;
  lineNumber: string;
  cityPrefix?: string;
  displayTitle?: string; 
  displayType?: string // для UI
};

export type RegionalCity = {
  id: string;
  title: string;
  type?: string;
  displayTitle?: string; 
  displayType?: string // для UI
  lineNumber?: string
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
  chatNumber: string;
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
    contracts: { id: string }[];
  };
  student: {
    id: string;
    name: string;
    avatarUrl: string;
    lastOnline: string | null;
  };
  order: {
    status: string;
    contracts: {
      tutorId: string;
    }[];
  }
  themeOrder: string;
  initiatorRole: string;
  isSelectedTutor: boolean;
  status: string;
};
// Возможные значения type
export type TypeMessage = "service" |"user";
// Возможные значения recipientRole
export type TypeRecipientRoleMessage = "null" | "tutor" |"student" | "admin";

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  type: TypeMessage;
  recipientRole: TypeRecipientRoleMessage;
}

// Возможные значения selectedBy
export type SelectedBy = "tutor" |"student";

export type Contract = {
  id: string;
  contractNumber: string;
  orderId: string;
  tutorId: string;
  selectedBy: SelectedBy;
  selectedAt: Date;
  canceledAt: Date | null;
}

export type Review = {
  id: string;
  reviewNumber: string;
  orderId: string;
  tutorId?: string;
  studentId?: string;
  authorRole: "student" | "tutor";
  name?: string;
  message?: string;
  rating: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  tutor?: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    name: string;
  };
  order?: {
    id: string;
    subject: string;
    goal: string;
  };
};

export type Comment = {
  id: string;
  reviewId?: string;
  contractId?: string;
  senderId: string;
  senderRole: "student" | "tutor" | "admin";
  text: string;
  createdAt: string;
};

export type CreateReviewPayload = {
  orderId: string;
  tutorId: string;
  studentId: string;
  message?: string;
  rating: number;
  authorRole: "student" | "tutor";
};

export type CreateCommentPayload = {
  reviewId: string;
  text: string;
};

// ЛЕНДИНГИ

export interface SubcategoryItem {
  name: string;
  link: string;
  goal?: string;
  id_p: string;
}

export interface FirstBlockSubject {
  link: string;
  id_p?: string;
  subject?: string;
  label: string;
  description?: string;
  size?: "small" | "medium";
}

export interface SecondBlockSubject {
  mainLink: string;
  mainLabel: string;
  goal?: string;
  id_p?: string;
  subcategories: SubcategoryItem[];
}

// Тип транзакции баланса
export type BalanceTransaction = {
  id: string;
  balanceTransactionNumber: string;
  userId: string;
  type: "deposit" | "withdrawal" | "refund" | "service_purchase" | "payout";
  amount: number; // в копейках
  status: "pending" | "success" | "canceled";
  meta?: Record<string, any>;
  createdAt: string; // ISO string
};

// Тип платежа ЮKassa
export type Payment = {
  id: string;
  userId: string;
  paymentId: string; // id платежа в ЮKassa
  amount: number; // в копейках
  currency: string; // "RUB"
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

// Ответ при создании платежа (для виджета)
export type CreatePaymentResponse = {
  paymentId: string;
  confirmationToken: string;
};

// Ответ при списании с баланса
export type WithdrawResponse = {
  ok: boolean;
};