import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalStateType = {
  isModalSelectCity: boolean;
  isModalBalanceBoost: boolean;
  valueModalBalanceBoost: string;
};

const initialState: ModalStateType = {
  isModalSelectCity: false,
  isModalBalanceBoost: false,
  valueModalBalanceBoost: "",
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
  },
});

export const { setModalSelectCity, setIsModalBalanceBoost, setValueModalBalanceBoost } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
