import { District, Metro, UserRegion } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MatchStateType = {
  selectedValues: (District | Metro)[]; // переделать
  regionUser: UserRegion;
};

const initialState: MatchStateType = {
  selectedValues: [],
  regionUser: {
    city: "",
    area: "",
  },
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedValues: (state, action: PayloadAction<(District | Metro)[]>) => {
      state.selectedValues = action.payload;
    },
    setRegionUser: (state, action: PayloadAction<UserRegion>) => {
      state.regionUser = action.payload;
    },
  },
});

export const { setSelectedValues, setRegionUser } = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
