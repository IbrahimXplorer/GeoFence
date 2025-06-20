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
        <TouchableOpacity onPress={onEdit}>
          <Image
            source={require('../../../assets/images/eye.png')}
            style={styles.iconButton}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Image
            source={require('../../../assets/images/delete.png')}
            style={styles.deleteButton}
          />
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
    color: colors.dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 24,
    height: 24,
    tintColor: colors.lightBlue,
  },
  deleteButton: {
    width: 24,
    height: 24,
  },
});
