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
  },
});

export const { addFence, setFences } = fenceSlice.actions;
export default fenceSlice.reducer;
