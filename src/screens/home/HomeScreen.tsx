import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  Circle,
  LatLng,
  MapPressEvent,
  Polygon,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../../theme/colors';
import { useLocation } from '../../hooks/useLocation';

type DrawMode = 'circle' | 'polygon';

export const HomeScreen = () => {
  const [isGeoFencing, setIsGeoFencing] = useState(false);
  const [drawMode, setDrawMode] = useState<DrawMode>('circle');
  const [circleCenter, setCircleCenter] = useState<LatLng | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const { region, currentLocation, getCurrentLocation, mapRef } = useLocation();

  const handleMapPress = (event: MapPressEvent) => {
    if (!isGeoFencing) return;
    const { coordinate } = event.nativeEvent;

    if (drawMode === 'circle') {
      setCircleCenter(coordinate);
      setPolygonPoints([]);
    } else if (drawMode === 'polygon') {
      setPolygonPoints(prev => [...prev, coordinate]);
      setCircleCenter(null);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);
  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {circleCenter && (
            <Circle
              center={circleCenter}
              radius={120}
              strokeWidth={2}
              strokeColor={colors.lightDanger}
              fillColor={colors.darkDanger}
            />
          )}

          {polygonPoints.length >= 3 && (
            <Polygon
              coordinates={polygonPoints}
              strokeColor={colors.lightBlue}
              fillColor={colors.darkBlue}
              strokeWidth={2}
            />
          )}

          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="You are here"
              description="This is your current location"
              pinColor="green"
            />
          )}
        </MapView>
      )}

      {/* Re-center */}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={getCurrentLocation}
      >
        <Text style={styles.buttonText}>Re-center</Text>
      </TouchableOpacity>

      {/* Fence Mode Toggle */}
      <TouchableOpacity
        style={[
          styles.geoFenceButton,
          {
            backgroundColor: isGeoFencing ? colors.darkDanger : colors.success,
          },
        ]}
        onPress={() => {
          setIsGeoFencing(prev => {
            const next = !prev;
            if (!next) {
              setCircleCenter(null);
              setPolygonPoints([]);
              setDrawMode('circle');
            }
            return next;
          });
        }}
      >
        <Text style={styles.buttonText}>
          {isGeoFencing ? 'Exit Fence Mode' : 'Enter Fence Mode'}
        </Text>
      </TouchableOpacity>

      {/* Drawing Mode Toggle */}
      {isGeoFencing && (
        <TouchableOpacity
          style={styles.drawModeButton}
          onPress={() =>
            setDrawMode(prev => (prev === 'circle' ? 'polygon' : 'circle'))
          }
        >
          <Text style={styles.buttonText}>
            Mode: {drawMode === 'circle' ? 'Circle' : 'Polygon'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 160,
    right: 20,
    backgroundColor: colors.lightBlue,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  geoFenceButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  drawModeButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.light,
    fontWeight: 'bold',
  },
});
