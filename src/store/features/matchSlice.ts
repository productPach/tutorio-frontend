import { District, Metro, RegionalCity } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MatchStateType = {
  selectedValues: (District | Metro | RegionalCity)[]; // переделать
};

const initialState: MatchStateType = {
  selectedValues: [],
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedValues: (state, action: PayloadAction<(District | Metro | RegionalCity)[]>) => {
      state.selectedValues = action.payload;
    },
    
  },
});

export const { setSelectedValues } = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
