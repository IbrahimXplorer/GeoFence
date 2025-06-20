import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, {
  Circle,
  LatLng,
  MapPressEvent,
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { BackButton, FenceMetadataModal } from '../../components';
import { useLocation } from '../../hooks/useLocation';
import { RootStackParamList } from '../../navigator/stack/RootStack';
import { addFence } from '../../store/slices/fenceSlice';
import { AppDispatch } from '../../store/store';
import { colors } from '../../theme/colors';
import { Fence } from '../../types/fence';

type DrawMode = 'circle' | 'polygon';

type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;
type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Map'
>;

type MapScreenProps = {
  route: MapScreenRouteProp;
  navigation: MapScreenNavigationProp;
};

export const MapScreen: FC<MapScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isGeoFencing, setIsGeoFencing] = useState(false);
  const [drawMode, setDrawMode] = useState<DrawMode>('circle');
  const [viewModeFence, setViewModeFence] = useState<Fence | null>(null);
  const [circleCenter, setCircleCenter] = useState<LatLng | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const { region, currentLocation, getCurrentLocation, mapRef } = useLocation();
  const [showFenceMetaPrompt, setShowFenceMetaPrompt] = useState(false);


  //actions
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

  const handleSaveFence = (name: string, description: string) => {
    const newFence = {
      id: uuid.v4().toString(),
      name,
      description,
      type: drawMode,
      coordinates:
        drawMode === 'circle' && circleCenter ? [circleCenter] : polygonPoints,
      radius: drawMode === 'circle' ? 120 : undefined,
      styling: {
        strokeColor:
          drawMode === 'circle' ? colors.lightDanger : colors.lightBlue,
        fillColor: drawMode === 'circle' ? colors.darkDanger : colors.darkBlue,
      },
    };

    dispatch(addFence(newFence));
    setCircleCenter(null);
    setPolygonPoints([]);
    setShowFenceMetaPrompt(false);
  };

   const handleBackPress = () => {
    navigation.goBack();
  };


  //side effects
  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (route.params?.selectedFence) {
      setIsGeoFencing(false);
      setViewModeFence(route.params.selectedFence);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.backActionWrapper}>
        <BackButton onPress={handleBackPress} />
      </View>
      {isGeoFencing && (circleCenter || polygonPoints.length >= 3) && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowFenceMetaPrompt(true)}
        >
          <Text>Store fence</Text>
        </TouchableOpacity>
      )}
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
          {viewModeFence ? (
            viewModeFence.type === 'circle' ? (
              <Circle
                center={viewModeFence.coordinates[0]}
                radius={viewModeFence.radius ?? 120}
                strokeWidth={2}
                strokeColor={viewModeFence.styling.strokeColor}
                fillColor={viewModeFence.styling.fillColor}
              />
            ) : (
              <Polygon
                coordinates={viewModeFence.coordinates}
                strokeColor={viewModeFence.styling.strokeColor}
                fillColor={viewModeFence.styling.fillColor}
                strokeWidth={2}
              />
            )
          ) : (
            <>
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
            </>
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
      <FenceMetadataModal
        visible={showFenceMetaPrompt}
        onClose={() => setShowFenceMetaPrompt(false)}
        onSave={handleSaveFence}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backActionWrapper: {
    position: 'absolute',
    zIndex: 20,
    top: 50,
    backgroundColor: colors.light,
    elevation: 4,
    borderRadius: 10,
    left: 20,
  },
  saveActionWrapper: {
    position: 'absolute',
    zIndex: 20,
    top: 50,
    left: 20,
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
  saveButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
    zIndex: 10,
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
