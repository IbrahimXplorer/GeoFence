import Geolocation from '@react-native-community/geolocation';
import { useRef, useState } from 'react';
import { LatLng, Region } from 'react-native-maps';

export const useLocation = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const mapRef = useRef(null);

  const getCurrentLocation = async () => {
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
      },
    );
  };

  return {
    region,
    currentLocation,
    mapRef,
    getCurrentLocation,
  };
};
