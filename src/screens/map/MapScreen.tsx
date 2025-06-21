import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import FenceColorPicker from '../../components/atoms/FenceColorPicker';
import { useLocation } from '../../hooks/useLocation';
import { RootStackParamList } from '../../navigator/stack/RootStack';
import { addFence, editFence } from '../../store/slices/fenceSlice';
import { AppDispatch } from '../../store/store';
import { colors } from '../../theme/colors';
import { showLocalNotification } from '../../utils/notificationHelper';
import { hexToRgba } from '../../utils/stringHelper';
import { DrawMode } from '../../types/fence';

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
  const { selectedFence } = route?.params || {};
  const [isGeoFencing, setIsGeoFencing] = useState(false);
  const [name, setName] = useState(selectedFence?.name || '');
  const [description, setDescription] = useState(
    selectedFence?.description || '',
  );
  const [drawMode, setDrawMode] = useState<DrawMode>(
    selectedFence?.type ?? 'circle',
  );
  const [circleCenter, setCircleCenter] = useState<LatLng | null>(
    selectedFence?.type === 'circle' ? selectedFence.coordinates[0] : null,
  );
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>(
    selectedFence?.type === 'polygon' ? selectedFence.coordinates : [],
  );
  const { region, currentLocation, getCurrentLocation, mapRef } = useLocation();
  const [showFenceMetaPrompt, setShowFenceMetaPrompt] = useState(false);
  const [strokeColor, setStrokeColor] = useState(colors.lightBlue);
  const [fillColor, setFillColor] = useState(colors.darkBlue);
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const handleSaveFence = () => {
    const newFence = {
      id: selectedFence?.id ?? uuid.v4().toString(),
      name,
      description,
      type: drawMode,
      coordinates:
        drawMode === 'circle' && circleCenter ? [circleCenter] : polygonPoints,
      radius: drawMode === 'circle' ? 120 : undefined,
      styling: {
        strokeColor,
        fillColor,
      },
    };

    if (selectedFence?.id) {
      dispatch(editFence(newFence));
    } else {
      dispatch(addFence(newFence));
    }
    setCircleCenter(null);
    setPolygonPoints([]);
    setShowFenceMetaPrompt(false);
    Alert.alert(
      `Fench ${selectedFence?.id ? 'updated' : 'created'} successfully!`,
    );
    navigation.goBack();
  };

  const handleBackPress = () => {
    navigation.goBack();
    if (selectedFence) {
      showLocalNotification(
        'Hi there!',
        `You exited ${selectedFence?.name} ${selectedFence?.description} area`,
      );
    }
  };

  const onSelectColor = ({ hex }: { hex: string }) => {
    setStrokeColor(hexToRgba(hex, 1));
    setFillColor(hexToRgba(hex, 0.2));
    setShowColorPicker(false);
  };

  //side effects
  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFence) {
      showLocalNotification(
        'Hi there!',
        `You entered ${selectedFence.name} ${selectedFence.description} area`,
      );
    }
  }, []);

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
          {circleCenter && (
            <Circle
              center={circleCenter}
              radius={120}
              strokeWidth={2}
              strokeColor={strokeColor}
              fillColor={fillColor}
            />
          )}

          {polygonPoints.length >= 3 && (
            <Polygon
              coordinates={polygonPoints}
              strokeColor={strokeColor}
              fillColor={fillColor}
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

      {isGeoFencing && (circleCenter || polygonPoints.length >= 3) && (
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

      {isGeoFencing && (
        <TouchableOpacity
          style={[styles.drawModeButton, { top: 100, bottom: undefined }]}
          onPress={() => setShowColorPicker(prev => !prev)}
        >
          <Text style={styles.buttonText}>🎨 Pick Color</Text>
        </TouchableOpacity>
      )}

      <FenceColorPicker
        showColorPicker={showColorPicker}
        strokeColor={strokeColor}
        onSelectColor={onSelectColor}
      />

      <FenceMetadataModal
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
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
