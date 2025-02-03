import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalStateType = {
  isModalSelectCity: boolean;
  isModalBalanceBoost: boolean;
  valueModalBalanceBoost: string;
  scrollY: number;
  isModalFio: boolean;
  isModalProfileInfo: boolean;
  isModalExperience: boolean;
  isModalEducation: boolean;
  isModalEducationItem: boolean;
  isModalEditEducation: boolean;
};

const initialState: ModalStateType = {
  isModalSelectCity: false,
  isModalBalanceBoost: false,
  valueModalBalanceBoost: "",
  scrollY: 0,
  isModalFio: false,
  isModalProfileInfo: false,
  isModalExperience: false,
  isModalEducation: false,
  isModalEducationItem: false,
  isModalEditEducation: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalSelectCity: (state, action: PayloadAction<boolean>) => {
      state.isModalSelectCity = action.payload;
    },
    setIsModalBalanceBoost: (state, action: PayloadAction<boolean>) => {
      state.isModalBalanceBoost = action.payload;
    },
    setValueModalBalanceBoost: (state, action: PayloadAction<string>) => {
      state.valueModalBalanceBoost = action.payload;
    },
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload;
    },
    setIsModalFio: (state, action: PayloadAction<boolean>) => {
      state.isModalFio = action.payload;
    },
    setIsModalProfileInfo: (state, action: PayloadAction<boolean>) => {
      state.isModalProfileInfo = action.payload;
    },
    setIsModalExperience: (state, action: PayloadAction<boolean>) => {
      state.isModalExperience = action.payload;
    },
    setIsModalEducation: (state, action: PayloadAction<boolean>) => {
      state.isModalEducation = action.payload;
    },
    setIsModalEducationItem: (state, action: PayloadAction<boolean>) => {
      state.isModalEducationItem = action.payload;
    },
    setIsModalEditEducation: (state, action: PayloadAction<boolean>) => {
      state.isModalEditEducation = action.payload;
    }
  },
});

export const {
  setModalSelectCity,
  setIsModalBalanceBoost,
  setValueModalBalanceBoost,
  setScrollY,
  setIsModalFio,
  setIsModalProfileInfo,
  setIsModalExperience,
  setIsModalEducation,
  setIsModalEducationItem,
  setIsModalEditEducation,
} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
