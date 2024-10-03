import { District, Metro, RegionalCity, UserRegion } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MatchStateType = {
  selectedValues: (District | Metro | RegionalCity)[]; // переделать
  regionUser: UserRegion | null;
};

const initialState: MatchStateType = {
  selectedValues: [],
  regionUser: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedValues: (state, action: PayloadAction<(District | Metro | RegionalCity)[]>) => {
      state.selectedValues = action.payload;
    },
    setRegionUser: (state, action: PayloadAction<UserRegion>) => {
      state.regionUser = action.payload;
    },
  },
});

export const { setSelectedValues, setRegionUser } = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
