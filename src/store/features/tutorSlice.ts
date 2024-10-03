import { District, Metro, RegionalCity } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TutorStateType = {
  selectedValuesCity: (District | Metro)[];
  selectedValuesArea: RegionalCity[];
};

const initialState: TutorStateType = {
    selectedValuesCity: [],
    selectedValuesArea: [],
};

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setSelectedValuesCity: (state, action: PayloadAction<(District | Metro)[]>) => {
      state.selectedValuesCity = action.payload;
    },
    setSelectedValuesArea: (state, action: PayloadAction<RegionalCity[]>) => {
        state.selectedValuesArea = action.payload;
      },
  },
});

export const { setSelectedValuesCity, setSelectedValuesArea } = tutorSlice.actions;
export const tutorReducer = tutorSlice.reducer;
