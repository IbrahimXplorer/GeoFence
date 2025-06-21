import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  ColorFormatsObject,
  Panel2,
  Panel3,
  Panel4,
} from 'reanimated-color-picker';

type FenceColorPickerProps = {
  showColorPicker: boolean;
  strokeColor: string;
  onSelectColor: (color: ColorFormatsObject) => void;
};

const FenceColorPicker: React.FC<FenceColorPickerProps> = ({
  showColorPicker,
  strokeColor,
  onSelectColor,
}) => (
  <Modal visible={showColorPicker} animationType="slide" transparent>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ColorPicker
          value={strokeColor}
          onCompleteJS={onSelectColor}
          style={styles.colorPicker}
        >
          <Panel3 />
        </ColorPicker>
      </View>
    </View>
  </Modal>
);

export default FenceColorPicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    elevation: 10,
  },
  colorPicker: {
    width: '100%',
    gap: 10,
  },
});
