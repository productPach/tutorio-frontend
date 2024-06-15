import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MatchStateType =  {
  indexMatchPage: number;
}

const initialState: MatchStateType = {
    indexMatchPage: 0,
};

const matchSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIndexMatchPageState: (state, action: PayloadAction<number>) => {
      state.indexMatchPage = action.payload + 1;
    },
  },
});

export const { setIndexMatchPageState } = matchSlice.actions;
export const matchReducer = matchSlice.reducer;