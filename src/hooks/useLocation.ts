import Geolocation from '@react-native-community/geolocation';
import { useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { LatLng, MapView, Region } from 'react-native-maps';

export const useLocation = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const mapRef = useRef<MapView>(null);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(newRegion);
        setCurrentLocation({ latitude, longitude });
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      error => {
        console.warn('Location error:', error.message);
      }
    );
  };

  return {
    region,
    currentLocation,
    mapRef,
    getCurrentLocation,
  };
};
