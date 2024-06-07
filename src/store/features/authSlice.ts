import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthStateType =  {
  authState: boolean;
}

const initialState: AuthStateType = {
  authState: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;