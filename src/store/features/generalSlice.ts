import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GeneralStateType = {
cookies: boolean;
};

const initialState: GeneralStateType = {
  cookies: false,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setCookies: (state, action: PayloadAction<boolean>) => {
      state.cookies = action.payload;
    },
  },
});

export const { setCookies} =
  generalSlice.actions;
export const generalReducer = generalSlice.reducer;
