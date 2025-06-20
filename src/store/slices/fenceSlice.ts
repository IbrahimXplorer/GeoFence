import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'react-native-maps';

export type DrawMode = 'circle' | 'polygon';

export interface Fence {
  id: string;
  name: string;
  description?: string;
  type: DrawMode;
  coordinates: LatLng[];
  radius?: number;
  styling: {
    strokeColor: string;
    fillColor: string;
  };
}

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
    setFences: (state, action: PayloadAction<Fence[]>) => {
      state.fences = action.payload;
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

export const { addFence, setFences, editFence, deleteFence } =
  fenceSlice.actions;
export default fenceSlice.reducer;
