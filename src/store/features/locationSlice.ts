import { fetchGetAllCities } from "@/api/server/locationApi";
import { City } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getAllLocations = createAsyncThunk<City[]>(
    'location/getAllLocations',
    async () => {
      try {
        const response = await fetchGetAllCities();
        return response; // Предположим, что в ответе есть свойство locations
      } catch (error) {
        console.error(error);
        return undefined; // Или выбросить ошибку, если это необходимо
      }
    }
  );

type LocationStateType =  {
  city: City[]
}

const initialState: LocationStateType = {
    city: []
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers(builder) {
      builder
      .addCase(getAllLocations.fulfilled, (state, action: PayloadAction<City[]>) => {
        state.city = action.payload || []; // Убедитесь, что city всегда массив
      });
    }
  });

  export const { } = locationSlice.actions;
  export const locationReducer = locationSlice.reducer;