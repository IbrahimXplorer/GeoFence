import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import HomeScreen from '../../screens/home/HomeScreen';
import MapScreen from '../../screens/map/MapScreen';
import { Fence } from '../../types/fence';

export type RootStackParamList = {
  Home: undefined;
  Map: { selectedFence?: Fence };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};
