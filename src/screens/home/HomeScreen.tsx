import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export const HomeScreen = () => {
  const fences = useSelector((state: RootState) => state.fence.fences);
  const navigation = useNavigation();

  // eslint-disable-next-line react/no-unstable-nested-components
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
            <FenceListItem name={item.name} description={item.description} />
          )}
          estimatedItemSize={80}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: { flex: 1},
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
    paddingHorizontal:10
  },
  listHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
 itemContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  marginHorizontal:10,
  marginVertical: 6,
  borderRadius: 8,
  backgroundColor: '#fff',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
