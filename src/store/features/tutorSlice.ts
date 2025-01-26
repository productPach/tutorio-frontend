import { baseUrl } from "@/api/server/configApi";
import {
  fetchCreateTutor,
  fetchCreateTutorEducation,
  fetchCurrentTutor,
  fetchDeletePhotoTutorEducation,
  fetchDeleteTutorEducation,
  fetchUpdateTutor,
  fetchUpdateTutorEducation,
} from "@/api/server/tutorApi";
import {
  fetchShowWelcomeScreen,
  fetchWelcomeScreens,
} from "@/api/server/userApi";
import {
  District,
  Metro,
  RegionalCity,
  Tutor,
  TutorEducation,
  UpdateTutorAvatarPayload,
  UpdateTutorAvatarResponse,
  WelcomeScreen,
} from "@/types/types";
import {
  getTutorFromLocalStorage,
  setLocalStorage,
} from "@/utils/localStorage/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getCurrentTutor = createAsyncThunk<Tutor, string>(
  "tutor/current",
  async (token) => {
    try {
      const response = await fetchCurrentTutor(token);
      return response;
    } catch (error) {
      // Здесь можно вернуть undefined или обработать ошибку
      console.error(error);
      throw error;
    }
  }
);

export const createTutor = createAsyncThunk<
  Tutor,
  { phone: string; token: string }
>("tutor/create", async ({ phone, token }) => {
  try {
    const response = await fetchCreateTutor(phone, token);
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

export const updateTutor = createAsyncThunk<
  Tutor,
  {
    id: string;
    token: string;
    status: string;
    name?: string;
    email?: string;
    subject?: string[];
    region?: string;
    tutorPlace?: string[];
    tutorAdress?: string;
    tutorTrip?: string[];
    tutorTripCity?: string[];
    tutorTripCityData?: string;
    tutorTripArea?: string[];
    profileInfo?: string;
    experience?: string;
  }
>("tutor/update", async ({ id, token, status, ...optionalFields }) => {
  try {
    // Базовый объект с обязательными полями
    const dataToUpdate = {
      id,
      token,
      status,
      ...(optionalFields.name !== undefined && { name: optionalFields.name }),
      ...(optionalFields.email !== undefined && {
        email: optionalFields.email,
      }),
      ...(optionalFields.subject !== undefined && {
        subject: optionalFields.subject,
      }),
      ...(optionalFields.region !== undefined && {
        region: optionalFields.region,
      }),
      ...(optionalFields.tutorPlace !== undefined && {
        tutorPlace: optionalFields.tutorPlace,
      }),
      ...(optionalFields.tutorAdress !== undefined && {
        tutorAdress: optionalFields.tutorAdress,
      }),
      ...(optionalFields.tutorTrip !== undefined && {
        tutorTrip: optionalFields.tutorTrip,
      }),
      ...(optionalFields.tutorTripCity !== undefined && {
        tutorTripCity: optionalFields.tutorTripCity,
      }),
      ...(optionalFields.tutorTripCityData !== undefined && {
        tutorTripCityData: optionalFields.tutorTripCityData,
      }),
      ...(optionalFields.tutorTripArea !== undefined && {
        tutorTripArea: optionalFields.tutorTripArea,
      }),
      ...(optionalFields.profileInfo !== undefined && {
        profileInfo: optionalFields.profileInfo,
      }),
      ...(optionalFields.experience !== undefined && {
        experience: optionalFields.experience,
      }),
    };

    const response = await fetchUpdateTutor(dataToUpdate);
    return response;
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
export const getWelcomeScreens = createAsyncThunk<WelcomeScreen[], string>(
  "tutor/welcomeScreen",
  async (token) => {
    try {
      const response = await fetchWelcomeScreens(token);
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
  { token: string; id: string } // Параметры функции
>("tutor/showWelcomeScreen", async ({ token, id }) => {
  try {
    const response = await fetchShowWelcomeScreen(token, id);
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
    token: string;
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
    token,
    diploma,
  }) => {
    try {
      const response = await fetchCreateTutorEducation(
        tutorId,
        educationInfo,
        educationStartYear,
        educationEndYear,
        isShowDiplom,
        token,
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
    token: string;
    diploma?: (File | null)[];  // Диплом (не обязательный)
  }
>(
  "tutor/updateEducation",  // Название действия
  async ({ tutorId, educationId, token, educationInfo, educationStartYear, educationEndYear, isShowDiplom, diploma }) => {
    try {
      // Отправляем запрос на сервер с правильными параметрами
      const updatedEducation = await fetchUpdateTutorEducation(
        tutorId,             // tutorId
        educationId,         // educationId
        educationInfo,       // educationInfo
        educationStartYear,  // educationStartYear
        educationEndYear,    // educationEndYear
        isShowDiplom,        // isShowDiplom
        token,               // token
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
  { tutorId: string; educationId: string; token: string }
>("tutor/deleteEducation", async ({ tutorId, educationId, token }) => {
  try {
    const response = await fetchDeleteTutorEducation(
      tutorId,
      educationId,
      token
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
  { tutorId: string; educationId: string; fileUrl: string; token: string }
>("tutor/deletePhotoEducation", async ({ tutorId, educationId, fileUrl, token }) => {
  try {
    const response = await fetchDeletePhotoTutorEducation(
      tutorId,
      educationId,
      fileUrl,
      token
    );
    return response;
  } catch (error) {
    // Здесь можно вернуть undefined или обработать ошибку
    console.error(error);
    throw error;
  }
});

type TutorStateType = {
  tutor: null | Tutor;
  loading: boolean;
  selectedValuesCity: (District | Metro)[];
  selectedValuesArea: RegionalCity[];
  supportMenu: boolean;
  welcomeScreens: null | WelcomeScreen[];
  hiddenScreens: string[]; // Добавляем скрытые экраны
};

// Получаем данные репетитора из localStorage, если они есть
const initialTutor = getTutorFromLocalStorage();

const initialState: TutorStateType = {
  tutor: initialTutor,
  loading: false,
  selectedValuesCity: [],
  selectedValuesArea: [],
  supportMenu: false,
  welcomeScreens: null,
  hiddenScreens: [],
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
      })
      .addCase(getCurrentTutor.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createTutor.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.tutor = action.payload;
        setLocalStorage("tutor", state.tutor);
      })
      .addCase(updateTutor.fulfilled, (state, action: PayloadAction<Tutor>) => {
        state.tutor = action.payload;
        setLocalStorage("tutor", state.tutor);
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
      );
  },
});

export const {
  setTutor,
  setTutorLogout,
  setSelectedValuesCity,
  setSelectedValuesArea,
  setSupportMenu,
  addHiddenScreen,
} = tutorSlice.actions;
export const tutorReducer = tutorSlice.reducer;
