import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fence } from '../../types/fence';

interface FenceState {
  fences: Fence[];
}

const initialState: FenceState = {
  fences: [],
};

export const fenceSlice = createSlice({
  name: 'fence',
  initialState,
  reducers: {
    addFence: (state, action: PayloadAction<Fence>) => {
      state.fences.push(action.payload);
    },
    editFence: (state, action: PayloadAction<Fence>) => {
      const index = state.fences.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fences[index] = action.payload;
      }
    },
    deleteFence: (state, action: PayloadAction<string>) => {
      state.fences = state.fences.filter(f => f.id !== action.payload);
    },
  },
});

export const { addFence, editFence, deleteFence } = fenceSlice.actions;
export default fenceSlice.reducer;
