import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCreateContract, fetchCancelContract } from "@/api/server/contractApi";
import { Contract, SelectedBy } from "@/types/types";

// ——— Асинхронные экшены ———

// Создание контракта
export const createContract = createAsyncThunk<
  Contract,
  { payload: { orderId: string; tutorId: string; selectedBy: SelectedBy } },
  { rejectValue: string }
>("contract/createContract", async ({ payload }, { rejectWithValue }) => {
  try {
    return await fetchCreateContract(payload);
  } catch (error: any) {
    console.error("Ошибка создания контракта:", error);
    return rejectWithValue(error.message || "Ошибка при создании контракта");
  }
});

// Отмена контракта
export const cancelContract = createAsyncThunk<
  Contract,
  { contractId: string },
  { rejectValue: string }
>("contract/cancelContract", async ({ contractId }, { rejectWithValue }) => {
  try {
    return await fetchCancelContract(contractId);
  } catch (error: any) {
    console.error("Ошибка отмены контракта:", error);
    return rejectWithValue(error.message || "Ошибка при отмене контракта");
  }
});


// ——— Слайс состояния ———

type ContractState = {
  contracts: Contract[];
  loading: boolean;
};

const initialState: ContractState = {
  contracts: [],
  loading: false,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<Contract[]>) {
      state.contracts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Создание ---
      .addCase(createContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.contracts.push(action.payload);
        state.loading = false;
      })
      .addCase(createContract.rejected, (state) => {
        state.loading = false;
      })

      // --- Отмена ---
      .addCase(cancelContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelContract.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.contracts.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.contracts[index] = updated;
        }
        state.loading = false;
      })
      .addCase(cancelContract.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setContracts } = contractSlice.actions;
export const contractReducer = contractSlice.reducer;
