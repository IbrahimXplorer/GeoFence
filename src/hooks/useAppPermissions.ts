import notifee, { AndroidImportance } from '@notifee/react-native';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const useAppPermissions = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Android location permission denied');
          }

          console.log('location access granted');
        } else {
          const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (status !== RESULTS.GRANTED) {
            console.warn('iOS location permission denied');
          }
        }

        const notificationSettings = await notifee.requestPermission();
        if (!notificationSettings.authorizationStatus) {
          console.warn('Notification permission denied');
        }

        if (Platform.OS === 'android') {
          await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
          });
        }
      } catch (err) {
        console.error('Error requesting permissions:', err);
      }
    };

    requestPermissions();
  }, []);
};
