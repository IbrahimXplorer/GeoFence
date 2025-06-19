import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { RootStack } from './stack/RootStack';

export const Navigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default Navigator;
