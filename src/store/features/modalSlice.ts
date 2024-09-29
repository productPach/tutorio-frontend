import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalStateType = {
  isModalSelectCity: boolean;
};

const initialState: ModalStateType = {
  isModalSelectCity: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalSelectCity: (state, action: PayloadAction<boolean>) => {
      state.isModalSelectCity = action.payload;
    },
  },
});

export const { setModalSelectCity } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
