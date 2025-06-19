import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const fences = useSelector((state: RootState) => state.fence.fences);
  const navigation = useNavigation();

  const FenceListItem = ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: 'https://www.smartinsights.com/wp-content/uploads/2018/09/1.jpg',
        }}
        style={styles.itemImage}
      />
      <View style={{ flex: 1, paddingLeft: 10 }}>
        <Text style={styles.itemTitle}>{name}</Text>
        <Text style={styles.itemDescription}>
          {description || 'No description'}
        </Text>
      </View>
    </View>
  );

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
    <SafeAreaView style={{ flex: 1 }}>
      {fences.length > 0 && (
        <View style={styles.listContainer}>
          <Header />
          <FlashList
            ListEmptyComponent={
              <Text style={styles.emptyText}>No fences saved yet.</Text>
            }
            data={fences}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <FenceListItem name={item.name} description={item.description} />
            )}
            estimatedItemSize={80}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2e86de',
    borderRadius: 6,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
  },

  listContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  listHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
