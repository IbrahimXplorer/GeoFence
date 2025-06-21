import React, { useCallback, useMemo, useState } from 'react';
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

interface FenceMetadataModalProps {
  name: string;
  description: string;
  setName: (val: string) => void;
  setDescription: (val: string) => void;
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export const FenceMetadataModal: React.FC<FenceMetadataModalProps> = ({
  name,
  setName,
  description,
  setDescription,
  visible,
  onClose,
  onSave,
}) => {
  const [error, setError] = useState('');

  const isNameValid = useMemo(() => name.trim().length > 0, [name]);

  const handleChangeName = useCallback(
    (val: string) => {
      setName(val);
      if (error) setError('');
    },
    [error, setName],
  );

  const handleSave = useCallback(() => {
    if (!isNameValid) {
      setError('Title is required');
      return;
    }

    onSave(name.trim(), description.trim());
  }, [name, description, isNameValid, onSave]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="slide" visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Name Your Fence</Text>

          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Fence Name"
            value={name}
            placeholderTextColor={colors.dark}
            onChangeText={handleChangeName}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={description}
            placeholderTextColor={colors.dark}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    color: colors.dark,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
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
    position: 'absolute',
    right: 10,
    top: 10,
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
