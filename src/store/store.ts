import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/authSlice";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { matchReducer } from "./features/matchSlice";
import { studentReducer } from "./features/studentSlice";
import { modalReducer } from "./features/modalSlice";
import { tutorReducer } from "./features/tutorSlice";
import { ordersReducer } from "./features/orderSlice";
import { locationReducer } from "./features/locationSlice";
import { wikiReducer } from "./features/wikiSlice";
import { chatReducer } from "./features/chatSlice";
import { generalReducer } from "./features/generalSlice";
import { subjectReducer } from "./features/subjectSlice";
import { contractReducer } from "./features/contractSlice";
import { notificationReducer } from "./features/notificationSlice";

// Функция makeStore создает и возвращает хранилище Redux с помощью функции configureStore.
export const makeStore = () => {
  return configureStore({
    // Мы передаем объект, в котором свойство reducer содержит корневой редьюсер, объединяющий все редьюсеры нашего приложения.
    reducer: combineReducers({
      auth: authReducer,
      tutor: tutorReducer,
      student: studentReducer,
      match: matchReducer,
      modal: modalReducer,
      orders: ordersReducer,
      locations: locationReducer,
      wiki: wikiReducer,
      chat: chatReducer,
      general: generalReducer,
      subject: subjectReducer,
      contract: contractReducer,
      notification: notificationReducer,
    }),
  });
};

// Тип AppStore представляет собой тип нашего хранилища Redux, который возвращает функция makeStore.
export type AppStore = ReturnType<typeof makeStore>;

// Тип RootState представляет собой тип состояния нашего приложения, который возвращает функция getState хранилища Redux.
export type RootState = ReturnType<AppStore["getState"]>;

// Тип AppDispatch представляет собой тип функции диспетчера, который возвращает функция dispatch хранилища Redux.
export type AppDispatch = AppStore["dispatch"];

// Хуки useAppDispatch, useAppSelector и useAppStore позволяют использовать функции useDispatch, useSelector и useStore из библиотеки react-redux с типизацией.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
