import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Searchbar, Chip, FAB, Card, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CATEGORIES, CURRENCIES} from '../../constants/config';
import {assetService} from '../../services/assetService';

interface Asset {
  id: string;
  name: string;
  description: string;
  value: number;
  currency: string;
  location: string;
  category: string;
  images: string[];
  distance?: string;
  postedDate: string;
  views: number;
  isFavorited: boolean;
  owner: {
    id: string;
    name: string;
    rating: number;
    trades: number;
    avatar?: string;
  };
}

const BrowseScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadAssets();
  }, [selectedCategory]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAssets({
        category: selectedCategory,
        search: searchQuery,
      });
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  };

  const handleSearch = () => {
    loadAssets();
  };

  const toggleFavorite = async (assetId: string) => {
    try {
      await assetService.toggleFavorite(assetId);
      setAssets(prev =>
        prev.map(asset =>
          asset.id === assetId
            ? {...asset, isFavorited: !asset.isFavorited}
            : asset,
        ),
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const renderAsset = ({item}: {item: Asset}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AssetDetail', {assetId: item.id})}>
      <Card style={styles.assetCard}>
        <View style={styles.assetImageContainer}>
          <Image
            source={{uri: item.images[0] || 'https://via.placeholder.com/300'}}
            style={styles.assetImage}
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}>
            <Icon
              name={item.isFavorited ? 'heart' : 'heart-outline'}
              size={24}
              color={item.isFavorited ? '#FF6B35' : '#fff'}
            />
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>

        <Card.Content style={styles.assetContent}>
          <Text style={styles.assetName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.assetDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.assetInfo}>
            <Text style={styles.assetPrice}>
              {CURRENCIES[item.currency]?.symbol} {item.value.toLocaleString()}
            </Text>
            <View style={styles.locationContainer}>
              <Icon name="map-marker" size={14} color="#666" />
              <Text style={styles.assetLocation}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.assetFooter}>
            <View style={styles.ownerInfo}>
              <Image
                source={{
                  uri: item.owner.avatar || 'https://via.placeholder.com/40',
                }}
                style={styles.ownerAvatar}
              />
              <View>
                <Text style={styles.ownerName}>{item.owner.name}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={12} color="#FFB800" />
                  <Text style={styles.rating}>
                    {item.owner.rating} ({item.owner.trades})
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <Icon name="eye" size={14} color="#999" />
              <Text style={styles.views}>{item.views}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search assets..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          icon="magnify"
          right={() => (
            <IconButton
              icon="filter-variant"
              onPress={() => setShowFilters(!showFilters)}
            />
          )}
        />

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item.id}
          style={styles.categoriesContainer}
          renderItem={({item}) => (
            <Chip
              selected={selectedCategory === item.id}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === item.id ? null : item.id,
                )
              }
              style={[
                styles.categoryChip,
                selectedCategory === item.id && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedCategory === item.id && styles.selectedChipText,
              ]}>
              {item.icon} {item.name}
            </Chip>
          )}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={assets}
          renderItem={renderAsset}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF6B35']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="package-variant" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No assets found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your filters or search
              </Text>
            </View>
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="map"
        onPress={() => navigation.navigate('MapView')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchBar: {
    margin: 12,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  chipText: {
    color: '#666',
  },
  selectedChipText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  assetCard: {
    flex: 1,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  assetImageContainer: {
    position: 'relative',
  },
  assetImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  assetContent: {
    padding: 12,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  assetDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  assetInfo: {
    marginBottom: 12,
  },
  assetPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  assetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  ownerName: {
    fontSize: 11,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B35',
  },
});

export default BrowseScreen;