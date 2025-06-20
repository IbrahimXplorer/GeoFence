import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { RootStack } from './stack/RootStack';
import BootSplash from 'react-native-bootsplash';

export const Navigator = () => {
  return (
    <NavigationContainer
      onReady={() => {
        void BootSplash.hide({ fade: true });
      }}
    >
      <RootStack />
    </NavigationContainer>
  );
};

export default Navigator;
