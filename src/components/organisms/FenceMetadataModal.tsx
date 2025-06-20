import React, { useEffect } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';

interface Props {
  name: string;
  description: string;
  setName: (val: string) => void;
  setDescription: (val: string) => void;
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export const FenceMetadataModal: React.FC<Props> = ({
  name,
  setName,
  description,
  setDescription,
  visible = false,
  onClose,
  onSave,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Name Your Fence</Text>

          <TextInput
            style={styles.input}
            placeholder="Fence Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(name, description)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Image
              source={require('../../../assets/images/cancel.png')}
              style={styles.iconButton}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  saveButton: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 100,
    alignSelf: 'center',
    position:"absolute",
    right:10,
    top:10
  },
  buttonText: {
    color: colors.light,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 24,
    height: 24,
  },
});
