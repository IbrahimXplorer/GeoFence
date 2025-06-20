import { LatLng } from 'react-native-maps';

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

export type DrawMode = 'circle' | 'polygon';
