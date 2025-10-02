import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Chip, IconButton, FAB, Badge, Card} from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import ApiService, {Asset} from '../../services/api';
import {useAuth} from '../../contexts/AuthContext';

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Vehicles',
  'Property',
  'Fashion',
  'Books',
  'Sports',
  'Tools',
  'Agriculture',
  'Other',
];

const SORT_OPTIONS = [
  {label: 'Most Recent', value: 'date', order: 'desc'},
  {label: 'Price: Low to High', value: 'price', order: 'asc'},
  {label: 'Price: High to Low', value: 'price', order: 'desc'},
  {label: 'Most Popular', value: 'popularity', order: 'desc'},
  {label: 'Nearest', value: 'distance', order: 'asc'},
];

// DUMMY DATA
const DUMMY_ASSETS: Asset[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max',
    description: 'Excellent condition, 256GB, Pacific Blue color. Comes with original box and accessories.',
    owner_id: 'user1',
    category: 'Electronics',
    price: 3500000,
    currency: 'UGX',
    location: 'Kampala, Uganda',
    images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c1?w=400&h=400&fit=crop'],
    condition: 'Excellent',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    views: 245,
    status: 'active',
    barter_preferences: ['Laptop', 'Camera', 'Smart Watch'],
    negotiable: true,
    delivery_available: true,
  },
  {
    id: '2',
    title: 'Toyota Harrier 2018',
    description: 'Low mileage, single owner, full service history. Pearl white color.',
    owner_id: 'user2',
    category: 'Vehicles',
    price: 85000000,
    currency: 'UGX',
    location: 'Entebbe, Uganda',
    images: ['https://picsum.photos/400/400?random=2'],
    condition: 'Good',
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
    views: 567,
    status: 'active',
    barter_preferences: ['Land', 'Another Vehicle'],
    negotiable: true,
    delivery_available: false,
  },
  {
    id: '3',
    title: 'Office Desk Set',
    description: 'Complete office furniture set including desk, chair, and storage cabinet.',
    owner_id: 'user3',
    category: 'Furniture',
    price: 1200000,
    currency: 'UGX',
    location: 'Jinja, Uganda',
    images: ['https://picsum.photos/400/400?random=3'],
    condition: 'Good',
    created_at: '2024-01-13T14:30:00Z',
    updated_at: '2024-01-13T14:30:00Z',
    views: 89,
    status: 'active',
    negotiable: false,
    delivery_available: true,
  },
  {
    id: '4',
    title: 'PlayStation 5',
    description: 'Brand new PS5 with 2 controllers and 5 games. Still under warranty.',
    owner_id: 'user4',
    category: 'Electronics',
    price: 2800000,
    currency: 'UGX',
    location: 'Mbale, Uganda',
    images: ['https://picsum.photos/400/400?random=4'],
    condition: 'New',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    views: 432,
    status: 'active',
    barter_preferences: ['Gaming PC', 'iPhone'],
    negotiable: true,
    delivery_available: true,
  },
  {
    id: '5',
    title: 'Mountain Bike',
    description: 'Professional mountain bike, 21 gears, aluminum frame. Perfect for trails.',
    owner_id: 'user5',
    category: 'Sports',
    price: 850000,
    currency: 'UGX',
    location: 'Mbarara, Uganda',
    images: ['https://picsum.photos/400/400?random=5'],
    condition: 'Good',
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z',
    views: 156,
    status: 'active',
    negotiable: true,
    delivery_available: false,
  },
  {
    id: '6',
    title: 'Leather Sofa Set',
    description: '7-seater genuine leather sofa set in excellent condition. Dark brown color.',
    owner_id: 'user6',
    category: 'Furniture',
    price: 4500000,
    currency: 'UGX',
    location: 'Kampala, Uganda',
    images: ['https://picsum.photos/400/400?random=6'],
    condition: 'Excellent',
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-10T08:15:00Z',
    views: 298,
    status: 'active',
    barter_preferences: ['Dining Set', 'TV'],
    negotiable: false,
    delivery_available: true,
  },
  {
    id: '7',
    title: 'Canon DSLR Camera',
    description: 'Canon EOS 80D with 18-135mm lens. Perfect for photography enthusiasts.',
    owner_id: 'user7',
    category: 'Electronics',
    price: 3200000,
    currency: 'UGX',
    location: 'Gulu, Uganda',
    images: ['https://picsum.photos/400/400?random=7'],
    condition: 'Good',
    created_at: '2024-01-09T13:40:00Z',
    updated_at: '2024-01-09T13:40:00Z',
    views: 178,
    status: 'active',
    negotiable: true,
    delivery_available: true,
  },
  {
    id: '8',
    title: 'Agricultural Land - 2 Acres',
    description: 'Fertile agricultural land with water source. Title available.',
    owner_id: 'user8',
    category: 'Property',
    price: 45000000,
    currency: 'UGX',
    location: 'Masaka, Uganda',
    images: ['https://picsum.photos/400/400?random=8'],
    condition: 'New',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
    views: 890,
    status: 'active',
    barter_preferences: ['Vehicle', 'House'],
    negotiable: true,
    delivery_available: false,
  },
];

const BrowseAssetsScreen = () => {
  const navigation = useNavigation();
  const {user} = useAuth();

  // State management
  const [assets, setAssets] = useState<Asset[]>(DUMMY_ASSETS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({min: 0, max: 1000000});
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Fetch assets (using dummy data)
  const fetchAssets = useCallback(async (pageNum = 1, append = false) => {
    if (loading) return;

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter dummy data based on search and category
      let filteredAssets = [...DUMMY_ASSETS];

      if (searchQuery) {
        filteredAssets = filteredAssets.filter(asset =>
          asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory) {
        filteredAssets = filteredAssets.filter(asset =>
          asset.category === selectedCategory
        );
      }

      // Sort the data
      if (sortBy.value === 'price') {
        filteredAssets.sort((a, b) =>
          sortBy.order === 'asc' ? a.price - b.price : b.price - a.price
        );
      } else if (sortBy.value === 'popularity') {
        filteredAssets.sort((a, b) => b.views - a.views);
      }

      if (append) {
        setAssets(prev => [...prev, ...filteredAssets]);
      } else {
        setAssets(filteredAssets);
      }

      setHasMore(false); // No pagination for dummy data
      setPage(pageNum);

      // COMMENTED OUT API CALL
      // const response = await ApiService.browseAssets({
      //   page: pageNum,
      //   size: 20,
      //   category: selectedCategory || undefined,
      //   location: selectedLocation || undefined,
      //   minPrice: priceRange.min,
      //   maxPrice: priceRange.max,
      //   search: searchQuery || undefined,
      //   sortBy: sortBy.value as any,
      //   order: sortBy.order as any,
      // });

      // if (append) {
      //   setAssets(prev => [...prev, ...response.items]);
      // } else {
      //   setAssets(response.items);
      // }

      // setHasMore(response.page < response.pages);
      // setPage(pageNum);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, selectedLocation, priceRange, searchQuery, sortBy]);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [selectedCategory, sortBy, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssets(1, false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchAssets(page + 1, true);
    }
  };

  const handleAssetPress = (asset: Asset) => {
    navigation.navigate('AssetDetails' as any, { assetId: asset.id });
  };

  const renderAssetItem = ({ item }: { item: Asset }) => {
    if (viewMode === 'grid') {
      return (
        <TouchableOpacity style={styles.gridItem} onPress={() => handleAssetPress(item)}>
          <Image
            source={{ uri: item.images[0] || 'https://via.placeholder.com/200' }}
            style={styles.gridImage}
          />
          <View style={styles.gridContent}>
            <Text style={styles.assetTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.assetPrice}>
              {item.currency} {item.price.toLocaleString()}
            </Text>
            <View style={styles.assetMeta}>
              <Icon name="map-marker" size={12} color="#666" />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            {item.barter_preferences && (
              <Badge style={styles.barterBadge}>Open to Barter</Badge>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <Card style={styles.listCard} onPress={() => handleAssetPress(item)}>
          <View style={styles.listContent}>
            <Image
              source={{uri: item.images[0] || 'https://via.placeholder.com/100'}}
              style={styles.listImage}
            />
            <View style={styles.listDetails}>
              <Text style={styles.assetTitle}>{item.title}</Text>
              <Text style={styles.assetDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.assetPrice}>
                {item.currency} {item.price.toLocaleString()}
              </Text>
              <View style={styles.listMeta}>
                <View style={styles.assetMeta}>
                  <Icon name="map-marker" size={12} color="#666" />
                  <Text style={styles.metaText}>{item.location}</Text>
                </View>
                <View style={styles.assetMeta}>
                  <Icon name="eye" size={12} color="#666" />
                  <Text style={styles.metaText}>{item.views} views</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search assets..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterChips}>
        <Chip
          icon="tune"
          onPress={() => setShowFilters(true)}
          style={styles.filterChip}>
          Filters
        </Chip>
        <Chip
          icon="sort"
          onPress={() => setShowSortModal(true)}
          style={styles.filterChip}>
          {sortBy.label}
        </Chip>
        {selectedCategory && (
          <Chip
            onClose={() => setSelectedCategory(null)}
            style={[styles.filterChip, styles.activeChip]}>
            {selectedCategory}
          </Chip>
        )}
        {selectedLocation && (
          <Chip
            onClose={() => setSelectedLocation(null)}
            style={[styles.filterChip, styles.activeChip]}>
            {selectedLocation}
          </Chip>
        )}
      </ScrollView>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <Text style={styles.resultCount}>{assets.length} results</Text>
        <View style={styles.viewButtons}>
          <IconButton
            icon="view-grid"
            size={20}
            onPress={() => setViewMode('grid')}
            iconColor={viewMode === 'grid' ? '#FF6B35' : '#666'}
          />
          <IconButton
            icon="view-list"
            size={20}
            onPress={() => setViewMode('list')}
            iconColor={viewMode === 'list' ? '#FF6B35' : '#666'}
          />
        </View>
      </View>
    </View>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filters</Text>
          <IconButton
            icon="close"
            onPress={() => setShowFilters(false)}
          />
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Categories */}
          <Text style={styles.filterSectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  selectedCategory === cat && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === cat ? null : cat
                )}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.selectedCategoryText,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text style={styles.filterSectionTitle}>Price Range</Text>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              keyboardType="numeric"
              value={priceRange.min.toString()}
              onChangeText={(text) => setPriceRange({...priceRange, min: parseInt(text) || 0})}
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              keyboardType="numeric"
              value={priceRange.max.toString()}
              onChangeText={(text) => setPriceRange({...priceRange, max: parseInt(text) || 1000000})}
            />
          </View>

          {/* Apply Filters */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              setShowFilters(false);
              fetchAssets();
            }}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}>
      <TouchableOpacity
        style={styles.sortModalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortModal(false)}>
        <View style={styles.sortModalContent}>
          <Text style={styles.sortModalTitle}>Sort By</Text>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.sortOption,
                sortBy.label === option.label && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortBy(option);
                setShowSortModal(false);
              }}>
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy.label === option.label && styles.selectedSortText,
                ]}>
                {option.label}
              </Text>
              {sortBy.label === option.label && (
                <Icon name="check" size={20} color="#FF6B35" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={assets}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        contentContainerStyle={[
          styles.listContainer,
          {paddingBottom: 100} // Add extra padding for tab bar
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#FF6B35" />
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !loading ? (
            <View style={styles.emptyContainer}>
              <Icon name="package-variant-closed" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No assets found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          ) : null
        }
      />

      {renderFiltersModal()}
      {renderSortModal()}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('ListAsset' as any)}
        color="#fff"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterChips: {
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeChip: {
    backgroundColor: '#FFF5F0',
    borderColor: '#FF6B35',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
  },
  viewButtons: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridImage: {
    width: '100%',
    height: 150,
  },
  gridContent: {
    padding: 10,
  },
  listCard: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  listContent: {
    flexDirection: 'row',
    padding: 10,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  listDetails: {
    flex: 1,
    marginLeft: 12,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  assetDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  assetPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
    flex: 1,
  },
  listMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barterBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    margin: 5,
  },
  selectedCategory: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sortModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sortModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  selectedSortOption: {
    backgroundColor: '#FFF5F0',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSortText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80, // Adjusted for tab bar
    backgroundColor: '#FF6B35',
  },
});

export default BrowseAssetsScreen;