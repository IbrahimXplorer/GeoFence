import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/colors';

type FenceCardProps = {
  name: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export const FenceCard: React.FC<FenceCardProps> = ({
  name,
  description,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: 'https://www.smartinsights.com/wp-content/uploads/2018/09/1.jpg',
        }}
        style={styles.itemImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{name}</Text>
        <Text style={styles.itemDescription}>
          {description || 'No description'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.viewButton} onPress={onEdit}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.light,
    elevation: 3,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewButton: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
  },
  viewButtonText: {
    color: colors.light,
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: colors.lightDanger,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: colors.light,
    fontSize: 12,
  },
});
