import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  Card,
  Avatar,
  IconButton,
  Chip,
  Badge,
  SegmentedButtons,
  Button,
  FAB,
} from 'react-native-paper';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {useAuth} from '../../contexts/AuthContext';
import {useData} from '../../contexts/DataContext';
import {LinearGradient} from 'expo-linear-gradient';

const {width} = Dimensions.get('window');

interface DashboardStats {
  total_assets: number;
  active_assets: number;
  completed_trades: number;
  pending_trades: number;
  total_views: number;
  rating: number;
  joined_date: string;
  revenue_earned: number;
  money_saved: number;
}

// DUMMY DATA
const DUMMY_TRADES = [
  {
    id: 't1',
    status: 'completed',
    created_at: '2024-01-15T10:00:00Z',
    initiator_asset_id: 'ua1',
    receiver_asset_id: 'a2',
  },
  {
    id: 't2',
    status: 'pending',
    created_at: '2024-01-20T14:30:00Z',
    initiator_asset_id: 'ua2',
    receiver_asset_id: 'a3',
  },
];

const DUMMY_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'trade_request',
    title: 'New Trade Request',
    message: 'Someone wants to trade with your iPhone 13 Pro Max',
    created_at: '2024-01-22T09:15:00Z',
    read: false,
  },
  {
    id: 'n2',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message about MacBook Pro',
    created_at: '2024-01-21T16:45:00Z',
    read: true,
  },
  {
    id: 'n3',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received UGX 5,000 for contact unlock',
    created_at: '2024-01-20T11:20:00Z',
    read: false,
  },
];

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {user} = useAuth();
  const {userAssets, messages} = useData();

  // State management
  const [activeTab, setActiveTab] = useState(route.params?.tab || 'overview');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate stats from real data
  const stats = {
    total_assets: userAssets.length,
    active_assets: userAssets.filter(a => a.status === 'active').length,
    completed_trades: DUMMY_TRADES.filter(t => t.status === 'completed').length,
    pending_trades: DUMMY_TRADES.filter(t => t.status === 'pending').length,
    total_views: userAssets.reduce((acc, asset) => acc + asset.views, 0),
    rating: 4.8,
    joined_date: '2023-01-01T00:00:00Z',
    revenue_earned: 25000, // UGX
    money_saved: 150000, // UGX
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderStatCard = (icon: string, label: string, value: string | number, color: string = '#FF6B35') => (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <View style={[styles.statIconContainer, {backgroundColor: `${color}20`}]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Card.Content>
    </Card>
  );

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.welcomeHeader}>
        <View style={styles.welcomeContent}>
          <Avatar.Text
            size={64}
            label={user?.name?.substring(0, 2) || 'US'}
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.memberSince}>
              Member since {moment(stats?.joined_date).format('MMMM YYYY')}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        {renderStatCard('package-variant', 'Active Listings', stats?.active_assets || 0)}
        {renderStatCard('swap-horizontal', 'Trades', stats?.completed_trades || 0, '#4CAF50')}
        {renderStatCard('eye', 'Total Views', stats?.total_views || 0, '#2196F3')}
        {renderStatCard('star', 'Rating', `${stats?.rating || 0}/5`, '#FFC107')}
      </View>

      {/* Financial Overview */}
      <Card style={styles.financialCard}>
        <Card.Title title="Financial Summary" />
        <Card.Content>
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Revenue Earned</Text>
              <Text style={styles.financialValue}>
                UGX {stats?.revenue_earned?.toLocaleString() || '0'}
              </Text>
            </View>
            <View style={styles.financialDivider} />
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Money Saved</Text>
              <Text style={styles.financialValueGreen}>
                UGX {stats?.money_saved?.toLocaleString() || '0'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ListAsset')}>
            <Icon name="plus-circle" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>List Asset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Browse')}>
            <Icon name="magnify" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveTab('messages')}>
            <Icon name="message" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveTab('trades')}>
            <Icon name="swap-horizontal" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Trades</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <Card.Title
          title="Recent Activity"
          right={(props) => (
            <IconButton
              {...props}
              icon="chevron-right"
              onPress={() => setActiveTab('notifications')}
            />
          )}
        />
        <Card.Content>
          {DUMMY_NOTIFICATIONS.slice(0, 3).map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={styles.activityItem}
              onPress={() => {/* Handle notification tap */}}>
              <Icon
                name={
                  notif.type === 'trade_request' ? 'swap-horizontal' :
                  notif.type === 'message' ? 'message' :
                  notif.type === 'payment' ? 'cash' : 'bell'
                }
                size={20}
                color="#666"
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{notif.title}</Text>
                <Text style={styles.activityTime}>
                  {moment(notif.created_at).fromNow()}
                </Text>
              </View>
              {!notif.read && <Badge size={8} style={styles.unreadBadge} />}
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderMyAssets = () => (
    <FlatList
      data={userAssets}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>My Assets ({userAssets.length})</Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('ListAsset')}
            style={styles.addButton}
            buttonColor="#FF6B35">
            Add New
          </Button>
        </View>
      )}
      renderItem={({item}) => (
        <Card
          style={styles.assetCard}
          onPress={() => navigation.navigate('AssetDetails', {assetId: item.id})}>
          <Card.Content style={styles.assetContent}>
            <View style={styles.assetInfo}>
              <Text style={styles.assetTitle}>{item.title}</Text>
              <Text style={styles.assetPrice}>
                {item.currency} {item.price.toLocaleString()}
              </Text>
              <View style={styles.assetMeta}>
                <Chip
                  style={[
                    styles.statusChip,
                    item.status === 'active' && styles.activeChip,
                  ]}>
                  {item.status}
                </Chip>
                <Text style={styles.assetViews}>
                  <Icon name="eye" size={14} /> {item.views} views
                </Text>
              </View>
              <Text style={styles.assetLocation}>
                <Icon name="map-marker" size={12} /> {item.location}
              </Text>
            </View>
            <IconButton
              icon="pencil"
              onPress={() => navigation.navigate('ListAsset', {assetId: item.id, mode: 'edit'})}
            />
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Icon name="package-variant-closed" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No assets listed yet</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ListAsset')}
            style={styles.emptyButton}
            buttonColor="#FF6B35">
            List Your First Asset
          </Button>
        </View>
      )}
    />
  );

  const renderTrades = () => (
    <FlatList
      data={DUMMY_TRADES}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>My Trades ({DUMMY_TRADES.length})</Text>
        </View>
      )}
      renderItem={({item}) => (
        <Card style={styles.tradeCard}>
          <Card.Content>
            <View style={styles.tradeHeader}>
              <Badge
                style={[
                  styles.tradeBadge,
                  item.status === 'completed' && styles.completedBadge,
                  item.status === 'pending' && styles.pendingBadge,
                ]}>
                {item.status}
              </Badge>
              <Text style={styles.tradeDate}>
                {moment(item.created_at).format('MMM DD, YYYY')}
              </Text>
            </View>
            <Text style={styles.tradeTitle}>
              Trade Request #{item.id.substring(0, 8)}
            </Text>
            <View style={styles.tradeAssets}>
              <Text style={styles.tradeAsset}>Your Asset: #{item.initiator_asset_id.substring(0, 8)}</Text>
              <Icon name="swap-horizontal" size={20} color="#666" />
              <Text style={styles.tradeAsset}>Their Asset: #{item.receiver_asset_id.substring(0, 8)}</Text>
            </View>
            {item.status === 'pending' && (
              <View style={styles.tradeActions}>
                <Button mode="outlined" onPress={() => {}}>
                  View Details
                </Button>
                <Button mode="contained" buttonColor="#FF6B35" onPress={() => {}}>
                  Accept Trade
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Icon name="swap-horizontal" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No trades yet</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Browse')}
            style={styles.emptyButton}
            buttonColor="#FF6B35">
            Browse Assets to Trade
          </Button>
        </View>
      )}
    />
  );

  const renderMessages = () => (
    <FlatList
      data={messages.slice(0, 10)}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Messages ({messages.length})</Text>
        </View>
      )}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.messageItem}
          onPress={() => navigation.navigate('Chat', {
            userId: item.sender_id,
            userName: 'User',
            assetId: item.asset_id,
          })}>
          <Avatar.Text size={48} label="U" />
          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageSender}>User #{item.sender_id.substring(0, 8)}</Text>
              <Text style={styles.messageTime}>
                {moment(item.timestamp).fromNow()}
              </Text>
            </View>
            <Text style={styles.messageText} numberOfLines={2}>
              {item.content}
            </Text>
          </View>
          <Badge size={8} style={styles.unreadBadge} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Icon name="message-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubText}>
            Start a conversation by contacting asset owners
          </Text>
        </View>
      )}
    />
  );

  const renderNotifications = () => (
    <FlatList
      data={DUMMY_NOTIFICATIONS}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Notifications ({DUMMY_NOTIFICATIONS.length})</Text>
          <IconButton
            icon="check-all"
            onPress={() => {
              // Mark all as read
            }}
          />
        </View>
      )}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[styles.notificationItem, !item.read && styles.unreadNotification]}
          onPress={() => {
            // Handle notification tap
          }}>
          <View style={[styles.notifIconContainer, {
            backgroundColor:
              item.type === 'trade_request' ? '#4CAF5020' :
              item.type === 'message' ? '#2196F320' :
              item.type === 'payment' ? '#FF6B3520' : '#66666620'
          }]}>
            <Icon
              name={
                item.type === 'trade_request' ? 'swap-horizontal' :
                item.type === 'message' ? 'message' :
                item.type === 'payment' ? 'cash' : 'bell'
              }
              size={20}
              color={
                item.type === 'trade_request' ? '#4CAF50' :
                item.type === 'message' ? '#2196F3' :
                item.type === 'payment' ? '#FF6B35' : '#666'
              }
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>
              {moment(item.created_at).fromNow()}
            </Text>
          </View>
          {!item.read && <Badge size={8} style={styles.unreadBadge} />}
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Icon name="bell-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      )}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}>
          {[
            {key: 'overview', label: 'Overview', icon: 'view-dashboard'},
            {key: 'assets', label: 'My Assets', icon: 'package-variant'},
            {key: 'trades', label: 'Trades', icon: 'swap-horizontal'},
            {key: 'messages', label: 'Messages', icon: 'message'},
            {key: 'notifications', label: 'Notifications', icon: 'bell'},
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}>
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? '#FF6B35' : '#666'}
              />
              <Text style={[
                styles.tabLabel,
                activeTab === tab.key && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'assets' && renderMyAssets()}
          {activeTab === 'trades' && renderTrades()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'notifications' && renderNotifications()}
        </RefreshControl>
      </View>

      {/* FAB for quick actions */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('ListAsset')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFF5F0',
  },
  tabLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabLabel: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  welcomeHeader: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  welcomeText: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberSince: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
    marginTop: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 30) / 2,
    margin: 5,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  financialCard: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  financialValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  financialValueGreen: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  financialDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  quickActions: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  activityCard: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityContent: {
    flex: 1,
    marginLeft: 10,
  },
  activityTitle: {
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: '#FF6B35',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    borderRadius: 20,
  },
  assetCard: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  assetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetInfo: {
    flex: 1,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  assetPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    marginRight: 10,
    backgroundColor: '#e0e0e0',
  },
  activeChip: {
    backgroundColor: '#4CAF5020',
  },
  assetViews: {
    fontSize: 13,
    color: '#666',
  },
  tradeCard: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tradeBadge: {
    backgroundColor: '#999',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FFC107',
  },
  tradeDate: {
    fontSize: 12,
    color: '#999',
  },
  tradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tradeAssets: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tradeAsset: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  tradeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#FFF5F0',
  },
  notifIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  assetLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyButton: {
    borderRadius: 20,
  },
  segmentedButtons: {
    width: 200,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B35',
  },
});

export default DashboardScreen;