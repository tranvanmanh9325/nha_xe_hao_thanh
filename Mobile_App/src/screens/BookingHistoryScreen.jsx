import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { ArrowLeftIcon, TicketOutlineIcon, LocationIcon, DateIcon } from '../components/icons/CustomIcons';
import ticketService from '../services/ticketService';

const TABS = [
  { id: 'all', key: 'bookingHistory.all' },
  { id: 'pending', key: 'bookingHistory.upcoming' },
  { id: 'paid', key: 'bookingHistory.completed' },
  { id: 'cancelled', key: 'bookingHistory.cancelled' },
];

export default function BookingHistoryScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors, isDarkMode);

  const [activeTab, setActiveTab] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingMore = React.useRef(false);

  const fetchTickets = async (tab, pageNum, isRefresh = false) => {
    try {
      if (pageNum === 0 && !isRefresh) setIsLoading(true);
      
      const data = await ticketService.getMyTickets(tab, pageNum, 10);
      
      if (isRefresh || pageNum === 0) {
        setTickets(data.content);
      } else {
        setTickets(prev => [...prev, ...data.content]);
      }
      
      setHasMore(!data.last);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingMore.current = false;
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchTickets(activeTab, 0);
  }, [activeTab]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(0);
    fetchTickets(activeTab, 0, true);
  }, [activeTab]);

  const loadMore = () => {
    if (!isLoading && hasMore && !isFetchingMore.current) {
      isFetchingMore.current = true;
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTickets(activeTab, nextPage);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return colors.semantic.warning;
      case 'PAID': return colors.semantic.success;
      case 'CANCELLED': return colors.semantic.danger;
      default: return colors.neutral[500];
    }
  };

  const getStatusText = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return t('bookingHistory.status.pending');
      case 'PAID': return t('bookingHistory.status.paid');
      case 'CANCELLED': return t('bookingHistory.status.cancelled');
      default: return status;
    }
  };

  const renderTicketCard = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.routeContainer}>
          <LocationIcon size={16} color={colors.brand[500]} />
          <Text style={styles.routeText} numberOfLines={1}>{item.route}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.paymentStatus) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.paymentStatus) }]}>
            {getStatusText(item.paymentStatus)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <DateIcon size={16} color={colors.neutral[400]} />
          <Text style={styles.infoText}>
            {dayjs(item.departureTime).format('HH:mm - DD/MM/YYYY')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <TicketOutlineIcon size={16} color={colors.neutral[400]} />
          <Text style={styles.infoText}>
            {t('bookingHistory.seat')}: <Text style={styles.boldText}>{item.seatCode}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.priceLabel}>{t('bookingHistory.ticketCode')}: {item.ticketCode}</Text>
        <Text style={styles.priceValue}>{item.totalPrice.toLocaleString('vi-VN')}đ</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <TicketOutlineIcon size={48} color={colors.neutral[300]} />
        </View>
        <Text style={styles.emptyText}>{t('bookingHistory.empty')}</Text>
        <TouchableOpacity 
          style={styles.bookNowButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.bookNowText}>{t('bookingHistory.bookNow')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color={colors.neutral[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('bookingHistory.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TABS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = activeTab === item.id;
            return (
              <TouchableOpacity
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(item.id)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {t(item.key)}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.tabListContainer}
        />
      </View>

      {/* Content */}
      {isLoading && page === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand[500]} />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicketCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.brand[500]}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => 
            isLoading && page > 0 ? (
              <ActivityIndicator style={{ margin: 20 }} size="small" color={colors.brand[500]} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    ...SHADOWS.sm,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
  },
  tabContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
  },
  tabListContainer: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    marginHorizontal: 4,
    backgroundColor: colors.neutral[100],
  },
  tabButtonActive: {
    backgroundColor: colors.brand[500],
  },
  tabText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: colors.neutral[600],
  },
  tabTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  routeText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginVertical: 12,
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sm,
    color: colors.neutral[600],
    marginLeft: 8,
  },
  boldText: {
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: colors.neutral[500],
  },
  priceValue: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.brand[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.base,
    color: colors.neutral[500],
    marginBottom: 24,
    textAlign: 'center',
  },
  bookNowButton: {
    backgroundColor: colors.brand[500],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: RADIUS.xl,
    ...SHADOWS.brand,
  },
  bookNowText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.white,
  }
});