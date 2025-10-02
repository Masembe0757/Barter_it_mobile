import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  Share,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Button,
  Chip,
  Divider,
  IconButton,
  Dialog,
  Portal,
  TextInput,
  RadioButton,
  Provider,
  Snackbar,
  Avatar,
  Badge,
} from 'react-native-paper';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {useAuth} from '../../contexts/AuthContext';

const {width} = Dimensions.get('window');

// DUMMY DATA
const DUMMY_ASSET = {
  id: '1',
  title: 'iPhone 13 Pro Max',
  description: 'Pristine iPhone 13 Pro Max in stunning Pacific Blue color with 256GB storage capacity. This premium device features the powerful A15 Bionic chip, advanced triple-camera system with ProRAW and ProRes video recording capabilities, and the durable Ceramic Shield front.\n\n📱 DEVICE DETAILS:\n• Model: iPhone 13 Pro Max (256GB)\n• Color: Pacific Blue\n• Battery Health: 95% (Excellent)\n• Storage: 256GB with 98% available\n• Condition: Mint condition, no scratches or dents\n• Screen: Perfect condition with no dead pixels\n\n📦 WHAT\'S INCLUDED:\n• Original iPhone 13 Pro Max device\n• Original Apple box and documentation\n• Lightning to USB-C cable (unused)\n• EarPods with Lightning connector (sealed)\n• Apple stickers and SIM ejector tool\n• Screen protector applied since day one\n• Premium leather case (worth UGX 200,000)\n\n✅ VERIFIED FEATURES:\n• Face ID working perfectly\n• All cameras (Wide, Ultra Wide, Telephoto) tested\n• 5G connectivity verified\n• MagSafe charging compatible\n• Water resistance intact (IP68)\n• No repairs or modifications ever made\n\n🏆 WHY THIS PHONE?\nPurchased from iStore Kampala 8 months ago for work photography. Upgraded to iPhone 15 Pro Max for business needs. This phone has been pampered with premium protection and regular software updates. Perfect for content creators, photographers, or anyone wanting flagship performance.\n\n💰 PRICING & TRADE:\nRetail price was UGX 5,200,000. Asking UGX 3,500,000 (negotiable). Open to trades for MacBook Pro, professional camera equipment, or vehicle down payment.',
  owner_id: 'user1',
  owner: {
    id: 'user1',
    full_name: 'John Kamau',
    email: 'john@example.com',
    is_active: true,
    is_superuser: false,
  },
  category: 'Electronics',
  price: 3500000,
  currency: 'UGX',
  location: 'Kampala, Uganda',
  images: [
    'https://picsum.photos/400/400?random=10',
    'https://picsum.photos/400/400?random=11',
    'https://picsum.photos/400/400?random=12',
  ],
  condition: 'Excellent',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  views: 245,
  status: 'active',
  barter_preferences: ['Laptop', 'Camera', 'Smart Watch'],
  exchange_value: 3500000,
  negotiable: true,
  delivery_available: true,
  payment_methods: ['card', 'mobile_money'],
};

const DUMMY_SIMILAR_ASSETS = [
  {
    id: '2',
    title: 'Samsung Galaxy S23',
    price: 2800000,
    currency: 'UGX',
    images: ['https://picsum.photos/150/150?random=4'],
    location: 'Kampala',
  },
  {
    id: '3',
    title: 'Google Pixel 7 Pro',
    price: 3000000,
    currency: 'UGX',
    images: ['https://picsum.photos/150/150?random=5'],
    location: 'Entebbe',
  },
  {
    id: '4',
    title: 'OnePlus 11',
    price: 2500000,
    currency: 'UGX',
    images: ['https://picsum.photos/150/150?random=6'],
    location: 'Jinja',
  },
];

const DUMMY_USER_ASSETS = [
  {
    id: 'ua1',
    title: 'MacBook Pro 2021',
    price: 5000000,
    currency: 'UGX',
    status: 'active',
  },
  {
    id: 'ua2',
    title: 'iPad Pro 12.9"',
    price: 3000000,
    currency: 'UGX',
    status: 'active',
  },
];

const AssetDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {assetId} = route.params || {};
  const {user} = useAuth();

  // State management
  const [asset, setAsset] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAssetForTrade, setSelectedAssetForTrade] = useState<string>('');
  const [reportReason, setReportReason] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userAssets, setUserAssets] = useState<any[]>(DUMMY_USER_ASSETS);
  const [similarAssets, setSimilarAssets] = useState<any[]>(DUMMY_SIMILAR_ASSETS);
  const [isSaved, setIsSaved] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);

  // Check for payment success
  useEffect(() => {
    if (route.params?.paymentSuccess && route.params?.paymentPurpose === 'similar_items') {
      setContactUnlocked(true);
      setSnackbarMessage('Payment successful! Similar items unlocked.');
    }
  }, [route.params?.paymentSuccess, route.params?.paymentPurpose]);

  // Fetch asset details (using dummy data)
  const fetchAssetDetails = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use dummy data
      setAsset(DUMMY_ASSET);
      setOwner(DUMMY_ASSET.owner);
      setSimilarAssets(DUMMY_SIMILAR_ASSETS);
      setUserAssets(DUMMY_USER_ASSETS);

      // COMMENTED OUT API CALLS
      // const assetData = await ApiService.getAssetById(assetId);
      // setAsset(assetData);
      // if (assetData.owner_id) {
      //   const ownerData = await ApiService.getUserById(assetData.owner_id);
      //   setOwner(ownerData);
      // }
      // await ApiService.incrementAssetViews(assetId);
      // const matches = await ApiService.getAssetMatches(assetId);
      // setSimilarAssets(matches.slice(0, 5));
      // if (user) {
      //   const myAssets = await ApiService.getMyAssets();
      //   setUserAssets(myAssets.filter(a => a.status === 'active'));
      // }
    } catch (error) {
      console.error('Error fetching asset details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssetDetails();
  }, [assetId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssetDetails();
  };

  const handleShare = async () => {
    if (!asset) return;
    try {
      await Share.share({
        message: `Check out ${asset.title} on BarterHub!\n\nPrice: ${asset.currency} ${asset.price}\nLocation: ${asset.location}\n\nDownload BarterHub to view more details!`,
        title: asset.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    setSnackbarMessage(isSaved ? 'Removed from saved items' : 'Added to saved items');
  };

  const handleContactSeller = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to contact the seller', [
        {text: 'Cancel'},
        {text: 'Sign In', onPress: () => navigation.navigate('Auth')},
      ]);
      return;
    }

    if (contactUnlocked) {
      navigation.navigate('Chat', {
        userId: asset?.owner_id,
        userName: owner?.full_name,
        assetId: asset?.id,
        assetTitle: asset?.title,
        assetImage: asset?.images?.[0],
      });
    } else {
      // Navigate to payment screen for chat access
      navigation.navigate('Payment', {
        assetId: asset?.id,
        assetName: asset?.title,
        ownerName: owner?.full_name,
        amount: 5000, // UGX 5,000 contact fee
        purpose: 'contact_seller',
      });
    }
  };

  const handleUnlockContact = async () => {
    setShowContactDialog(false);
    // Simulate payment
    Alert.alert('Payment', 'Redirecting to payment...', [
      {
        text: 'OK',
        onPress: () => {
          setContactUnlocked(true);
          setSnackbarMessage('Contact details unlocked successfully!');
        }
      }
    ]);
  };

  const handleInitiateTrade = async () => {
    if (!selectedAssetForTrade) {
      Alert.alert('Error', 'Please select an asset to trade');
      return;
    }

    // Simulate trade request
    setShowTradeDialog(false);
    setSnackbarMessage('Trade request sent successfully!');
  };

  const handleReport = async () => {
    if (!reportReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    setShowReportDialog(false);
    setSnackbarMessage('Report submitted. We will review it shortly.');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!asset) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#666" />
        <Text style={styles.errorText}>Asset not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <Provider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{paddingBottom: 100}}>
          {/* Image Carousel */}
          <View style={styles.imageContainer}>
            <FlatList
              data={asset.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                setImageIndex(newIndex);
              }}
              renderItem={({item}) => (
                <Image
                  source={{uri: item}}
                  style={styles.image}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {asset.images.length > 1 && (
              <View style={styles.imageIndicator}>
                <Text style={styles.indicatorText}>
                  {imageIndex + 1} / {asset.images.length}
                </Text>
              </View>
            )}
            {/* Action Buttons Overlay */}
            <View style={styles.overlayButtons}>
              <IconButton
                icon="arrow-left"
                size={24}
                iconColor="#fff"
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              />
              <View style={styles.rightButtons}>
                <IconButton
                  icon="share-variant"
                  size={24}
                  iconColor="#fff"
                  style={styles.actionButton}
                  onPress={handleShare}
                />
                <IconButton
                  icon={isSaved ? 'heart' : 'heart-outline'}
                  size={24}
                  iconColor={isSaved ? '#FF6B35' : '#fff'}
                  style={styles.actionButton}
                  onPress={handleSave}
                />
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Title and Price */}
            <View style={styles.header}>
              <Text style={styles.title}>{asset.title}</Text>
              <Text style={styles.price}>
                {asset.currency} {asset.price.toLocaleString()}
              </Text>
              {asset.negotiable && (
                <Chip icon="handshake" style={styles.negotiableChip}>
                  Negotiable
                </Chip>
              )}
            </View>

            {/* Quick Info */}
            <View style={styles.quickInfo}>
              <View style={styles.infoItem}>
                <Icon name="map-marker" size={16} color="#666" />
                <Text style={styles.infoText}>{asset.location}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="eye" size={16} color="#666" />
                <Text style={styles.infoText}>{asset.views} views</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="clock-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {moment(asset.created_at).fromNow()}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{asset.description}</Text>
            </View>

            {/* Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{asset.category}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Condition</Text>
                  <Text style={styles.detailValue}>{asset.condition}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Delivery</Text>
                  <Text style={styles.detailValue}>
                    {asset.delivery_available ? 'Available' : 'Not Available'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Badge
                    style={[
                      styles.statusBadge,
                      asset.status === 'active' && styles.activeBadge,
                    ]}>
                    {asset.status}
                  </Badge>
                </View>
              </View>
            </View>

            {/* Barter Preferences */}
            {asset.barter_preferences && asset.barter_preferences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Open to Trade For</Text>
                <View style={styles.chipContainer}>
                  {asset.barter_preferences.map((pref: string, index: number) => (
                    <Chip key={index} style={styles.preferenceChip}>
                      {pref}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {/* Seller Info */}
            <Card style={styles.sellerCard}>
              <Card.Content>
                <View style={styles.sellerHeader}>
                  <Avatar.Text
                    size={48}
                    label={owner?.full_name?.substring(0, 2) || 'JK'}
                  />
                  <View style={styles.sellerInfo}>
                    <Text style={styles.sellerName}>{owner?.full_name || 'John Kamau'}</Text>
                    <Text style={styles.memberSince}>
                      Member since {moment('2023-01-01').format('MMM YYYY')}
                    </Text>
                    <Text style={styles.verifiedBadge}>✓ Verified Seller</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Similar Assets */}
            {similarAssets.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Similar Assets</Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (!user) {
                        Alert.alert('Sign In Required', 'Please sign in to view similar assets', [
                          {text: 'Cancel'},
                          {text: 'Sign In', onPress: () => navigation.navigate('Auth')},
                        ]);
                        return;
                      }

                      if (contactUnlocked) {
                        navigation.goBack();
                        setTimeout(() => {
                          navigation.navigate('Browse');
                        }, 100);
                      } else {
                        // Navigate to payment screen for similar items access
                        navigation.navigate('Payment', {
                          assetId: asset?.id,
                          assetName: asset?.title,
                          ownerName: owner?.full_name,
                          amount: 3000, // UGX 3,000 for similar items access
                          purpose: 'similar_items',
                        });
                      }
                    }}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={similarAssets}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.similarAsset}
                      onPress={() => {
                        if (!user) {
                          Alert.alert('Sign In Required', 'Please sign in to view assets', [
                            {text: 'Cancel'},
                            {text: 'Sign In', onPress: () => navigation.navigate('Auth')},
                          ]);
                          return;
                        }

                        if (contactUnlocked) {
                          navigation.push('AssetDetails', {assetId: item.id});
                        } else {
                          // Navigate to payment screen for similar items access
                          navigation.navigate('Payment', {
                            assetId: asset?.id,
                            assetName: asset?.title,
                            ownerName: owner?.full_name,
                            amount: 3000, // UGX 3,000 for similar items access
                            purpose: 'similar_items',
                          });
                        }
                      }}>
                      <View style={styles.similarImageContainer}>
                        <Image
                          source={{uri: item.images[0]}}
                          style={[styles.similarImage, !contactUnlocked && styles.blurredImage]}
                        />
                        {!contactUnlocked && (
                          <View style={styles.lockOverlay}>
                            <Text style={styles.lockIcon}>🔒</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.similarTitle} numberOfLines={1}>
                        {contactUnlocked ? item.title : '???'}
                      </Text>
                      <Text style={styles.similarPrice}>
                        {contactUnlocked ? `${item.currency} ${item.price.toLocaleString()}` : '???'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={styles.bottomActions}>
          {asset.barter_preferences && (
            <Button
              mode="outlined"
              icon="swap-horizontal"
              onPress={() => setShowTradeDialog(true)}
              style={styles.tradeButton}>
              Propose Trade
            </Button>
          )}
          <Button
            mode="contained"
            icon="message"
            onPress={handleContactSeller}
            style={styles.contactButton}
            buttonColor="#FF6B35">
            {contactUnlocked ? 'Message Seller' : 'Contact Seller ($5)'}
          </Button>
        </View>

        {/* Dialogs */}
        <Portal>
          <Dialog visible={showContactDialog} onDismiss={() => setShowContactDialog(false)}>
            <Dialog.Title>Unlock Contact Details</Dialog.Title>
            <Dialog.Content>
              <Text>
                To contact the seller and view their full profile, you need to unlock
                their contact details for $5.00. This helps maintain quality listings
                and prevent spam.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowContactDialog(false)}>Cancel</Button>
              <Button onPress={handleUnlockContact}>Unlock ($5.00)</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={showTradeDialog} onDismiss={() => setShowTradeDialog(false)}>
            <Dialog.Title>Propose a Trade</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView style={{maxHeight: 400}}>
                <View style={styles.dialogContent}>
                  <Text style={styles.dialogLabel}>Select your asset to trade:</Text>
                  <RadioButton.Group
                    onValueChange={setSelectedAssetForTrade}
                    value={selectedAssetForTrade}>
                    {userAssets.map((item) => (
                      <RadioButton.Item
                        key={item.id}
                        label={`${item.title} (${item.currency} ${item.price})`}
                        value={item.id}
                      />
                    ))}
                  </RadioButton.Group>

                  <TextInput
                    label="Message (Optional)"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={3}
                    style={styles.messageInput}
                  />
                </View>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowTradeDialog(false)}>Cancel</Button>
              <Button onPress={handleInitiateTrade}>Send Request</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={showReportDialog} onDismiss={() => setShowReportDialog(false)}>
            <Dialog.Title>Report This Listing</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group onValueChange={setReportReason} value={reportReason}>
                <RadioButton.Item label="Inappropriate content" value="inappropriate" />
                <RadioButton.Item label="Scam or fraud" value="scam" />
                <RadioButton.Item label="Wrong category" value="wrong_category" />
                <RadioButton.Item label="Duplicate listing" value="duplicate" />
                <RadioButton.Item label="Other" value="other" />
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowReportDialog(false)}>Cancel</Button>
              <Button onPress={handleReport}>Submit Report</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={() => setSnackbarMessage('')}
          duration={3000}>
          {snackbarMessage}
        </Snackbar>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 12,
  },
  overlayButtons: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  negotiableChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF5F0',
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  seeAll: {
    color: '#FF6B35',
    fontSize: 14,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#999',
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  sellerCard: {
    marginBottom: 25,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberSince: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
    fontWeight: '600',
  },
  similarAsset: {
    width: 150,
    marginRight: 15,
  },
  similarImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  similarPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  similarImageContainer: {
    position: 'relative',
  },
  blurredImage: {
    opacity: 0.6,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    color: '#fff',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 8,
  },
  tradeButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#FF6B35',
  },
  contactButton: {
    flex: 1,
  },
  dialogContent: {
    paddingVertical: 10,
  },
  dialogLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  messageInput: {
    marginTop: 15,
  },
});

export default AssetDetailScreen;