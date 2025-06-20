import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { FenceCard } from '../../components';
import { AppDispatch, RootState } from '../../store/store';
import { colors } from '../../theme/colors';
import { deleteFence } from '../../store/slices/fenceSlice';

export const HomeScreen = (): ReactElement => {
  const fences = useSelector((state: RootState) => state.fence.fences);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  // eslint-disable-next-line react/no-unstable-nested-components
  const Header = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Saved Fences</Text>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => navigation.navigate('Map' as never)}
      >
        <Text style={styles.mapButtonText}>Go to Map</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Header />
      <View style={styles.listContainer}>
        <FlashList
          ListEmptyComponent={
            <Text style={styles.emptyText}>No fences saved yet.</Text>
          }
          data={fences}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FenceCard
              name={item.name}
              description={item.description}
              onEdit={() => console.log('Edit', item.id)}
              onDelete={() => dispatch(deleteFence(item.id))}
            />
          )}
          estimatedItemSize={80}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.lightBlue,
    borderRadius: 6,
  },
  mapButtonText: {
    color: colors.light,
    fontSize: 14,
  },

  listContainer: {
    flex: 1,
    backgroundColor: colors.light,
    borderTopWidth: 1,
    borderColor: colors.gray,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
