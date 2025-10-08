import { baseUrl } from "@/api/server/configApi";
import {
  fetchAddSubjectPrice,
  fetchAllTutors,
  fetchCreateTutor,
  fetchCreateTutorEducation,
  fetchCurrentTutor,
  fetchDeletePhotoTutorEducation,
  fetchDeleteRequest,
  fetchDeleteTutorEducation,
  fetchTutorById,
  fetchTutorGoalsBySubject,
  fetchTutorIncompletePrices,
  fetchTutorSelectedGoalsGrouped,
  fetchTutorSubjectsWithGoals,
  fetchUpdateSubjectPrice,
  fetchUpdateTutor,
  fetchUpdateTutorEducation,
  fetchVerifyEmail,
  updateTutorGoalsBySubject,
} from "@/api/server/tutorApi";
import {
  fetchShowWelcomeScreen,
  fetchWelcomeScreens,
} from "@/api/server/userApi";
import {
  DisplayTutorGoal,
  District,
  Goal,
  LessonDuration,
  Metro,
  RegionalCity,
  Tutor,
  TutorSubjectPriceInput,
  UpdateTutorAvatarPayload,
  UpdateTutorAvatarResponse,
  WelcomeScreen,
} from "@/types/types";
import {
  getTutorFromLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const getCurrentTutor = createAsyncThunk<Tutor, void>(
  "tutor/current",
  async () => {
    try {
      const response = await fetchCurrentTutor();
      return response;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      throw error;
    }
  }
);

// Получение всех репетиторов
export const getAllTutors = createAsyncThunk<Tutor[]>(
  "tutor/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllTutors();
      return response;
    } catch (error) {
      console.error("Ошибка при получении всех репетиторов:", error);
      return rejectWithValue("Не удалось загрузить список репетиторов");
    }
  }
);

// Получение репетитора по ID
export const getTutorById = createAsyncThunk<Tutor, { id: string; }>(
  "tutor/getById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetchTutorById(id);
      return response.tutor;
    } catch (error) {
      console.error(`Ошибка при получении репетитора с ID ${id}:`, error);
      return rejectWithValue(`Не удалось загрузить репетитора с ID ${id}`);
    }
  }
);

export const createTutor = createAsyncThunk<
  Tutor,
  { phone: string; }
>("tutor/create", async ({ phone }) => {
  try {
    const response = await fetchCreateTutor(phone);
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

// export const updateTutor = createAsyncThunk<
//   Tutor,
//   {
//     id: string;
//     token: string;
//     status?: string;
//     name?: string;
//     phone?: string;
//     email?: string;
//     isVerifedEmail?: boolean;
//     telegram?: string;
//     skype?: string;
//     subject?: string[];
//     subjectComments?: { subjectId: string; comment: string }[];
//     region?: string;
//     tutorPlace?: string[];
//     tutorAdress?: string;
//     tutorTrip?: string[];
//     tutorTripCity?: string[];
//     tutorTripCityData?: string;
//     tutorTripArea?: string[];
//     profileInfo?: string;
//     experience?: string;
//     isGroup?: boolean;
//     isPublicProfile?: boolean;
//     isStudentResponses?: boolean;
//     isNotifications?: boolean;
//     isNotificationsOrders?: boolean;
//     isNotificationsResponse?: boolean;
//     isNotificationsPromo?: boolean;
//     isNotificationsSms?: boolean;
//     isNotificationsEmail?: boolean;
//     isNotificationsTelegram?: boolean;
//     isNotificationsVk?: boolean;
//     lastOnline?: Date;
//   }
// >("tutor/update", async ({ id, token, ...optionalFields }) => {
//   try {
//     const dataToUpdate = {
//       id,
//       token,
//       ...optionalFields,
//     };

//     const response = await fetchUpdateTutor(dataToUpdate);
//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// });
// Изменение репетитора
export const updateTutor = createAsyncThunk<
  Tutor,
  {
    id: string;
    status?: string;
    name?: string;
    phone?: string;
    email?: string;
    isVerifedEmail?: boolean;
    telegram?: string;
    skype?: string;
    subject?: string[];
    subjectComments?: { subjectId: string; comment: string }[];
    region?: string;
    tutorPlace?: string[];
    tutorAdress?: string;
    tutorTrip?: string[];
    tutorTripCity?: string[];
    tutorTripCityData?: string;
    tutorTripArea?: string[];
    profileInfo?: string;
    experience?: string;
    isGroup?: boolean;
    isPublicProfile?: boolean;
    isStudentResponses?: boolean;
    isNotifications?: boolean;
    isNotificationsOrders?: boolean;
    isNotificationsResponse?: boolean;
    isNotificationsPromo?: boolean;
    isNotificationsSms?: boolean;
    isNotificationsEmail?: boolean;
    isNotificationsTelegram?: boolean;
    isNotificationsVk?: boolean;
    lastOnline?: Date;
  }
>(
  "tutor/update",
  async (optionalFields) => {
    try {
      const { id, ...fields } = optionalFields;

      const response = await fetchUpdateTutor({ id, ...fields }); // ✅ токен не передаём
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Создание новой цены по предмету
export const addSubjectPrice = createAsyncThunk<
  Tutor, // API возвращает обновленного репетитора
  TutorSubjectPriceInput & { tutorId: string; }
>("subjectPrice/add", async ({ tutorId, ...fields }) => {
  try {
    const response = await fetchAddSubjectPrice({ tutorId, ...fields }); 
    return response; // Теперь response — это объект Tutor
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Обновление цены по предмету
export const updateSubjectPrice = createAsyncThunk<
  Tutor, // API возвращает обновленного репетитора
  { id: string; price: number; duration: LessonDuration }
>("subjectPrice/update", async ({ id, ...fields }) => {
  try {
    const response = await fetchUpdateSubjectPrice({ id, ...fields });
    return response; // Теперь response — это объект Tutor
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const updateTutorAvatar = createAsyncThunk<
  UpdateTutorAvatarResponse,
  UpdateTutorAvatarPayload // Используем обновленный интерфейс
>("tutor/updateAvatar", async ({ id, file, token, croppedAreaPixels }) => {
  // Если файл отсутствует, выполняем удаление аватара
  if (!file) {
    const response = await fetch(`${baseUrl}tutors/${id}/avatar`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при удалении аватара");
    }

    return response.json();
  }

  // Обновление аватара
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(`${baseUrl}tutors/${id}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при обновлении аватара");
  }

  return response.json();
});

// Получение велком-скринов для репетитора
export const getWelcomeScreens = createAsyncThunk<WelcomeScreen[], void>(
  "tutor/welcomeScreen",
  async () => {
    try {
      const response = await fetchWelcomeScreens();
      return response;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      throw error;
    }
  }
);

// Просмотор велком-скрина
export const showWelcomeScreen = createAsyncThunk<
  { success: boolean; id: string }, // Возвращаемое значение
  { id: string } // Параметры функции
>("tutor/showWelcomeScreen", async ({ id }) => {
  try {
    const response = await fetchShowWelcomeScreen(id);
    return { success: response.success, id }; // Возвращаем успешность и ID
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Создание образования
export const createTutorEducation = createAsyncThunk<
  Tutor,
  {
    tutorId: string;
    educationInfo: string;
    educationStartYear: string;
    educationEndYear: string | null;
    isShowDiplom: boolean;
    diploma: (File | null)[];
  }
>(
  "tutor/createEducation",
  async ({
    tutorId,
    educationInfo,
    educationStartYear,
    educationEndYear,
    isShowDiplom,
    diploma,
  }) => {
    try {
      const response = await fetchCreateTutorEducation(
        tutorId,
        educationInfo,
        educationStartYear,
        educationEndYear,
        isShowDiplom,
        diploma
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Редактирование образования
export const updateTutorEducation = createAsyncThunk<
  Tutor,  // Тип возвращаемого результата
  {  // Параметры запроса
    tutorId: string;
    educationId: string;
    educationInfo: string;
    educationStartYear: string;
    educationEndYear: string | null;
    isShowDiplom: boolean;
    diploma?: (File | null)[];  // Диплом (не обязательный)
  }
>(
  "tutor/updateEducation",  // Название действия
  async ({ tutorId, educationId, educationInfo, educationStartYear, educationEndYear, isShowDiplom, diploma }) => {
    try {
      // Отправляем запрос на сервер с правильными параметрами
      const updatedEducation = await fetchUpdateTutorEducation(
        tutorId,             // tutorId
        educationId,         // educationId
        educationInfo,       // educationInfo
        educationStartYear,  // educationStartYear
        educationEndYear,    // educationEndYear
        isShowDiplom,        // isShowDiplom
        diploma || []        // Массив дипломов (может быть пустым)
      );

      return updatedEducation; // Вернем обновленные данные
    } catch (error) {
      console.error("Ошибка при обновлении образования", error);
      throw error;
    }
  }
);

// Удаление образования
export const deleteTutorEducation = createAsyncThunk<
  Tutor,
  { tutorId: string; educationId: string; }
>("tutor/deleteEducation", async ({ tutorId, educationId }) => {
  try {
    const response = await fetchDeleteTutorEducation(
      tutorId,
      educationId,
    );
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

// Удаление фото образования
export const deletePhotoTutorEducation = createAsyncThunk<
  Tutor,
  { tutorId: string; educationId: string; fileUrl: string; }
>("tutor/deletePhotoEducation", async ({ tutorId, educationId, fileUrl }) => {
  try {
    const response = await fetchDeletePhotoTutorEducation(
      tutorId,
      educationId,
      fileUrl
    );
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

// Асинхронный экшен для верификации почты
export const verifyEmail = createAsyncThunk<
  void, // Возвращаемое значение
  { token: string }, // Параметры
  { rejectValue: string } // Тип ошибки
>("tutor/verifyEmail", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await fetchVerifyEmail(token); // Отправляем запрос на сервер

    if (response.message === "Email подтверждён") {
      // Возвращаем пустое значение, так как экшен типа void
      return;
    } else {
      // Если ошибка, возвращаем ошибку через rejectWithValue
      return rejectWithValue(response.error || "Что-то пошло не так");
    }
  } catch (error: unknown) {
    console.error(error);
    // Проверяем тип ошибки и возвращаем корректное сообщение
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Ошибка верификации");
    } else {
      return rejectWithValue("Неизвестная ошибка");
    }
  }
});


export const deleteTutorRequest = createAsyncThunk<
  boolean, // Возвращаем true при успешном запросе
  { tutorId: string; answer: string; } // Входные параметры
>("tutor/deleteRequest", async ({ tutorId, answer }, { rejectWithValue }) => {
  try {
    await fetchDeleteRequest(tutorId, answer);
    return true; // Успешный запрос
  } catch (error) {
    console.error("Ошибка удаления репетитора:", error);
    return rejectWithValue(false); // Возвращаем false при ошибке
  }
});

// Получение списка всех целей по выбранным предметам репетитора + отмечаем выбранные цели
export const getTutorGoals = createAsyncThunk<
  Goal[],
  { tutorId: string; subjectId: string },
  { rejectValue: string }
>(
  "tutor/getTutorGoals",
  async ({ tutorId, subjectId }, { rejectWithValue }) => {
    try {
      return await fetchTutorGoalsBySubject(tutorId, subjectId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Получение выбранных целей репетитора по каждому предмету
export const getTutorSelectedGoalsGrouped = createAsyncThunk<
  Record<string, { id: string; title: string; selected: boolean }[]>,
  { tutorId: string },
  { rejectValue: string }
>(
  "tutor/getSelectedGoalsGrouped",
  async ({ tutorId }, { rejectWithValue }) => {
    try {
      const response = await fetchTutorSelectedGoalsGrouped(tutorId);

      // Преобразуем сразу в { selected: true }
      const grouped: Record<string, { id: string; title: string; selected: boolean }[]> =
        Object.fromEntries(
          Object.entries(response).map(([subjectId, goals]: [string, any]) => [
            subjectId,
            goals.map((g: any) => ({
              id: g.id,
              title: g.title, // название с бэка
              selected: true,
            })),
          ])
        );

      return grouped;
    } catch (error) {
      console.error(`Ошибка при получении целей репетитора:`, error);
      return rejectWithValue("Не удалось загрузить цели репетитора");
    }
  }
);

// Получаем предметы репетитора с целями
export const getTutorSubjectsWithGoals = createAsyncThunk<
  {
    subjectId: string;
    subjectTitle: string;
    goals: { id: string; title: string; selected: boolean }[];
    hasNoSelectedGoals: boolean;
  }[],
  { tutorId: string },
  { rejectValue: string }
>(
  "tutor/getSubjectsWithGoals",
  async ({ tutorId }, { rejectWithValue }) => {
    try {
      return await fetchTutorSubjectsWithGoals(tutorId);
    } catch (error: any) {
      console.error(`Ошибка при получении предметов с целями:`, error);
      return rejectWithValue("Не удалось загрузить предметы с целями");
    }
  }
);

// Обновление целей репетитора по предмету
export const updateTutorGoals = createAsyncThunk<
  void,
  { tutorId: string; subjectId: string; goalIds: string[] },
  { rejectValue: string }
>(
  "tutor/updateTutorGoals",
  async ({ tutorId, subjectId, goalIds }, { rejectWithValue }) => {
    try {
      await updateTutorGoalsBySubject(tutorId, subjectId, goalIds);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncSubjectsWithGoals = createAsyncThunk<
  void,
  { tutorId: string },
  { state: RootState }
>("tutor/syncSubjectsWithGoals", async ({ tutorId }, { getState, dispatch }) => {
  // Можно вызвать API для получения актуальных subjectsWithGoals или использовать локальные state
});

// Получение информации о неполных ценах репетитора
export const getTutorIncompletePrices = createAsyncThunk<
  { hasIncompletePrices: boolean; subjectsWithoutFullPrices: string[] },
  { id: string }
>(
  "tutor/getIncompletePrices",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await fetchTutorIncompletePrices(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

type GoalMini = { id: string; title: string };
type GoalWithSelected = { id: string; title: string; selected: boolean };

type TutorStateType = {
  tutor: null | Tutor;
  tutorById: null | Tutor;
  tutors: Tutor[];
  loading: boolean;
  error: null | string;
  updateStatus: string;
  selectedValuesCity: (District | Metro)[];
  selectedValuesArea: RegionalCity[];
  supportMenu: boolean;
  welcomeScreens: null | WelcomeScreen[];
  hiddenScreens: string[]; // Добавляем скрытые экраны
  deleteRequest: boolean;
  tutorGoals: DisplayTutorGoal[];          // Цели репетитора по предмету
  tutorGoalsLoading: boolean;  // Флаг загрузки
  tutorGoalsError: string | null; // Ошибка при загрузке/обновлении
  tutorGoalsSaved: boolean;
  // только выбранные цели (группировка по предметам)
  tutorGoalsGrouped: Record<string, { id: string; title: string; selected: boolean }[]>;
  tutorGoalsGroupedLoading: boolean;
  tutorGoalsGroupedError: string | null;

  subjectsWithGoals: {
    subjectId: string;
    subjectTitle: string;
    goals: { id: string; title: string; selected: boolean }[];
    hasNoSelectedGoals: boolean;
  }[];
  subjectsWithGoalsLoading: boolean;
  subjectsWithGoalsError: string | null;

  incompletePrices: { hasIncompletePrices: boolean, subjectsWithoutFullPrices: string[] },
};

// Получаем данные репетитора из localStorage, если они есть
const initialTutor = getTutorFromLocalStorage();

const initialState: TutorStateType = {
  tutor: initialTutor,
  tutorById: initialTutor, 
  tutors: [] as Tutor[],
  loading: false,
  error: null as string | null,
  updateStatus: "idle", // idle | loading | success | failed
  selectedValuesCity: [],
  selectedValuesArea: [],
  supportMenu: false,
  welcomeScreens: null,
  hiddenScreens: [],
  deleteRequest: false,
  tutorGoals: [],
  tutorGoalsLoading: false,
  tutorGoalsError: null,
  tutorGoalsSaved: false,

  // Только выбранные цели
  tutorGoalsGrouped: {},
  tutorGoalsGroupedLoading: false,
  tutorGoalsGroupedError: null,

  subjectsWithGoals: [],
  subjectsWithGoalsLoading: false,
  subjectsWithGoalsError: null,

  incompletePrices: { hasIncompletePrices: false, subjectsWithoutFullPrices: [] },
};

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setTutor: (state, action: PayloadAction<Tutor>) => {
      state.tutor = action.payload;
    },
    setTutorLogout: (state) => {
      state.tutor = null;
    },
    setSelectedValuesCity: (
      state,
      action: PayloadAction<(District | Metro)[]>
    ) => {
      state.selectedValuesCity = action.payload;
    },
    setSelectedValuesArea: (state, action: PayloadAction<RegionalCity[]>) => {
      state.selectedValuesArea = action.payload;
    },
    setSupportMenu: (state, action: PayloadAction<boolean>) => {
      state.supportMenu = action.payload;
    },
    addHiddenScreen(state, action: PayloadAction<string>) {
      // Добавляем id скрытого экрана в массив
      if (!state.hiddenScreens.includes(action.payload)) {
        state.hiddenScreens.push(action.payload);
      }
    },
    resetDeleteRequest: (state) => {
      state.deleteRequest = false; // Сбросить состояние
    },
    resetTutorGoalsSaved: (state) => {
      state.tutorGoalsSaved = false;
    },
    syncSubjectsWithGoalsState: (state) => {
      const tutorSubjectIds = new Set(state.tutor?.subject || []);

      // 1. Фильтруем старые предметы, которых больше нет
      state.subjectsWithGoals = (state.subjectsWithGoals || [])
        .filter(s => tutorSubjectIds.has(s.subjectId))
        .map(s => ({
          ...s,
          hasNoSelectedGoals: s.goals.every(g => !g.selected),
        }));

      // 2. Добавляем новые предметы, которых нет в subjectsWithGoals
      for (const subjectId of tutorSubjectIds) {
        if (!state.subjectsWithGoals.some(s => s.subjectId === subjectId)) {
          state.subjectsWithGoals.push({
            subjectId,
            subjectTitle: "", // при желании подтянуть title из subjects
            goals: [],
            hasNoSelectedGoals: true,
          });
        }
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        getCurrentTutor.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          if (action.payload) {
            // Проверяем на наличие данных
            state.tutor = action.payload;
            setLocalStorage("tutor", state.tutor);
          } else {
            state.tutor = null; // Обнуляем репетитора
          }
          state.loading = false; // Завершаем загрузку
        }
      )
      .addCase(getCurrentTutor.pending, (state) => {
        state.loading = true;
        state.updateStatus = "loading";
      })
      .addCase(getCurrentTutor.rejected, (state) => {
        state.loading = false;
        state.updateStatus = "failed";
        state.tutor = null; // Обнуляем репетитора
        removeLocalStorage("tutor"); // Удаляем из localStorage
      })
      .addCase(getAllTutors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTutors.fulfilled, (state, action: PayloadAction<Tutor[]>) => {
        state.loading = false;
        state.tutors = action.payload; // Сохраняем полученных репетиторов
      })
      .addCase(getAllTutors.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getTutorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTutorById.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.loading = false;
        state.tutorById = action.payload; // Сохраняем полученного репетитора
      })
      .addCase(getTutorById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Произошла ошибка при загрузке репетитора";
      })
      .addCase(createTutor.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.tutor = action.payload;
        state.updateStatus = "success";
        setLocalStorage("tutor", state.tutor);
      })
      .addCase(updateTutor.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.tutor = action.payload;
        state.loading = false;
        state.updateStatus = "success";
        setLocalStorage("tutor", state.tutor);
      })
      .addCase(updateTutor.pending, (state) => {
        state.loading = true;
        state.updateStatus = "loading";
      })
      .addCase(updateTutor.rejected, (state) => {
        state.loading = false;
        state.updateStatus = "failed";
      })
      .addCase(updateTutorAvatar.fulfilled, (state, action) => {
        if (state.tutor && state.tutor.id === action.payload.id) {
          state.tutor.avatarUrl = action.payload.avatarUrl;
          setLocalStorage("tutor", state.tutor);
        }
      })
      .addCase(
        getWelcomeScreens.fulfilled,
        (state, action: PayloadAction<WelcomeScreen[]>) => {
          state.welcomeScreens = action.payload;
        }
      )
      .addCase(showWelcomeScreen.fulfilled, (state, action) => {
        if (action.payload.success && state.welcomeScreens) {
          // Удаляем просмотренный велком-скрин по ID
          const updatedHiddenScreens = [
            ...state.hiddenScreens,
            action.payload.id,
          ];
          state.hiddenScreens = updatedHiddenScreens;
          localStorage.setItem(
            "hiddenScreens",
            JSON.stringify(updatedHiddenScreens)
          ); // Обновляем в localStorage
        }
      })
      .addCase(
        createTutorEducation.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          if (state.tutor) {
            state.tutor.educations = action.payload.educations; // Присваиваем только поле tutorEducation
            setLocalStorage("tutor", state.tutor); // Сохраняем весь объект tutor
          }
        }
      )
      .addCase(
        updateTutorEducation.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          if (state.tutor) {
            state.tutor = action.payload;
            state.tutor.educations = action.payload.educations; // Присваиваем только поле tutorEducation
            setLocalStorage("tutor", state.tutor); // Сохраняем весь объект tutor
          }
        }
      )
      .addCase(
        deleteTutorEducation.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          if (state.tutor) {
            state.tutor.educations = action.payload.educations; // Присваиваем только поле tutorEducation
            setLocalStorage("tutor", state.tutor); // Сохраняем весь объект tutor
          }
        }
      )
      .addCase(
        deletePhotoTutorEducation.fulfilled,
        (state, action: PayloadAction<Tutor>) => {
          if (state.tutor) {
            state.tutor.educations = action.payload.educations;
            setLocalStorage("tutor", state.tutor); // Сохранение tutor в локальном хранилище
          }
        }
      ).addCase(addSubjectPrice.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.tutor = action.payload; // Просто заменяем репетитора
        setLocalStorage("tutor", state.tutor);
      })
      .addCase(updateSubjectPrice.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.tutor = action.payload; // Аналогично обновляем
        setLocalStorage("tutor", state.tutor);
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        if (state.tutor) {
          state.tutor.isVerifedEmail = true; // Обновляем поле isVerifedEmail
          setLocalStorage("tutor", state.tutor);
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.updateStatus = "failed";
        console.error(action.payload); // Логируем ошибку
      })
      .addCase(deleteTutorRequest.pending, (state) => {
        state.deleteRequest = false;
        state.loading = true;
      })
      .addCase(deleteTutorRequest.fulfilled, (state) => {
        state.deleteRequest = true; // Успешный запрос
        state.loading = false;
      })
      .addCase(deleteTutorRequest.rejected, (state) => {
        state.deleteRequest = false; // Ошибка, не удалилось
        state.loading = false;
      })

      // Получение целей
    .addCase(getTutorGoals.pending, (state) => {
      state.tutorGoalsLoading = true;
      state.tutorGoalsError = null;
    })
    .addCase(getTutorGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
      state.tutorGoalsLoading = false;
      state.tutorGoals = action.payload;
    })
    .addCase(getTutorGoals.rejected, (state, action) => {
      state.tutorGoalsLoading = false;
      state.tutorGoalsError = action.payload || "Ошибка загрузки целей";
    })

    // Обновление целей
      .addCase(updateTutorGoals.pending, (state) => {
        state.tutorGoalsLoading = true;
        state.tutorGoalsError = null;
        state.tutorGoalsSaved = false;
      })
      .addCase(updateTutorGoals.fulfilled, (state, action) => {
        state.tutorGoalsLoading = false;
        state.tutorGoalsSaved = true;

        const { subjectId, goalIds } = action.meta.arg as {
          tutorId: string;
          subjectId: string;
          goalIds: string[];
        };

        // Обновляем tutorGoalsGrouped
        const titleById = new Map<string, string>();
        (state.tutorGoals || []).forEach((g: GoalMini) => titleById.set(g.id, g.title));

        state.tutorGoalsGrouped[subjectId] = goalIds.map((id) => ({
          id,
          title: titleById.get(id) ?? "",
          selected: true,
        }));

        // Обновляем или создаём запись в subjectsWithGoals для конкретного предмета
        state.subjectsWithGoals = state.subjectsWithGoals || [];
        const subjIndex = state.subjectsWithGoals.findIndex((s) => s.subjectId === subjectId);

        if (subjIndex !== -1) {
          const subj = state.subjectsWithGoals[subjIndex];
          const selectedSet = new Set(goalIds);

          subj.goals = subj.goals.map((g) => ({
            ...g,
            selected: selectedSet.has(g.id),
            title: g.title || titleById.get(g.id) || "",
          }));

          // Добавляем новые цели, если их ещё нет
          for (const id of goalIds) {
            if (!subj.goals.some((g) => g.id === id)) {
              subj.goals.push({
                id,
                title: titleById.get(id) ?? "",
                selected: true,
              });
            }
          }

          subj.hasNoSelectedGoals = subj.goals.every((g) => !g.selected);
          state.subjectsWithGoals[subjIndex] = subj;
        } else {
          // Создаём новый объект для subjectsWithGoals
          const newGoals: GoalWithSelected[] = goalIds.map((id) => ({
            id,
            title: titleById.get(id) ?? "",
            selected: true,
          }));

          state.subjectsWithGoals.push({
            subjectId,
            subjectTitle: "",
            goals: newGoals,
            hasNoSelectedGoals: newGoals.length === 0,
          });
        }

        // -------------------------------
        // Синхронизация со всем tutor.subject
        // -------------------------------
        const tutorSubjectIds = new Set(state.tutor?.subject || []);

        // Фильтруем subjectsWithGoals — оставляем только актуальные
        state.subjectsWithGoals = state.subjectsWithGoals
          .filter((s) => tutorSubjectIds.has(s.subjectId))
          .map((s) => ({
            ...s,
            hasNoSelectedGoals: s.goals.every((g) => !g.selected),
          }));

        // Добавляем новые предметы, которых ещё нет в subjectsWithGoals
        for (const id of tutorSubjectIds) {
          if (!state.subjectsWithGoals.some((s) => s.subjectId === id)) {
            state.subjectsWithGoals.push({
              subjectId: id,
              subjectTitle: "",
              goals: [],
              hasNoSelectedGoals: true,
            });
          }
        }
      })
      .addCase(updateTutorGoals.rejected, (state, action) => {
        state.tutorGoalsLoading = false;
        state.tutorGoalsError = action.payload || "Ошибка обновления целей";
        state.tutorGoalsSaved = false;
      })

      // Получение выбранных целей репетитора
      .addCase(getTutorSelectedGoalsGrouped.pending, (state) => {
        state.tutorGoalsGroupedLoading = true;
        state.tutorGoalsGroupedError = null;
      })
      .addCase(getTutorSelectedGoalsGrouped.fulfilled, (state, action) => {
        state.tutorGoalsGroupedLoading = false;
        state.tutorGoalsGrouped = action.payload;

        // Обновляем tutorGoals (все доступные)
        Object.values(action.payload).forEach((goals) => {
          goals.forEach((g) => {
            if (!state.tutorGoals.find((tg) => tg.id === g.id)) {
              state.tutorGoals.push({ id: g.id, title: g.title });
            }
          });
        });
      })
      .addCase(getTutorSelectedGoalsGrouped.rejected, (state, action) => {
        state.tutorGoalsGroupedLoading = false;
        state.tutorGoalsGroupedError =
          (action.payload as string) || "Ошибка загрузки целей репетитора";
      })
      
      // Получаем предметы репетитора с целями
      .addCase(getTutorSubjectsWithGoals.pending, (state) => {
        state.subjectsWithGoalsLoading = true;
        state.subjectsWithGoalsError = null;
      })
      .addCase(getTutorSubjectsWithGoals.fulfilled, (state, action) => {
        state.subjectsWithGoalsLoading = false;
        state.subjectsWithGoals = action.payload;
      })
      .addCase(getTutorSubjectsWithGoals.rejected, (state, action) => {
        state.subjectsWithGoalsLoading = false;
        state.subjectsWithGoalsError =
          action.payload || "Ошибка загрузки предметов с целями";
      })

      // Проверка неполных цен
    builder.addCase(getTutorIncompletePrices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTutorIncompletePrices.fulfilled, (state, action) => {
      state.loading = false;
      state.incompletePrices = action.payload;
    });
    builder.addCase(getTutorIncompletePrices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setTutor,
  setTutorLogout,
  setSelectedValuesCity,
  setSelectedValuesArea,
  setSupportMenu,
  addHiddenScreen,
  resetDeleteRequest,
  resetTutorGoalsSaved,
  syncSubjectsWithGoalsState
} = tutorSlice.actions;
export const tutorReducer = tutorSlice.reducer;
