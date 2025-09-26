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
  fetchUpdateSubjectPrice,
  fetchUpdateTutor,
  fetchUpdateTutorEducation,
  fetchVerifyEmail,
} from "@/api/server/tutorApi";
import {
  fetchShowWelcomeScreen,
  fetchWelcomeScreens,
} from "@/api/server/userApi";
import {
  District,
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
    tutorTripCity?: string;
    tutorTripCityData?: string;
    tutorTripArea?: string;
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
} = tutorSlice.actions;
export const tutorReducer = tutorSlice.reducer;
