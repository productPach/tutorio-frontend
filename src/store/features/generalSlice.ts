import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GeneralStateType = {
cookies: boolean;
currentPage: string;
};

const initialState: GeneralStateType = {
  cookies: false,
  currentPage: "",
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setCookies: (state, action: PayloadAction<boolean>) => {
      state.cookies = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCookies, setCurrentPage } =
  generalSlice.actions;
export const generalReducer = generalSlice.reducer;
