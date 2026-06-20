import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { 
  BusIcon, 
  LocationIcon, 
  DateIcon, 
  UserIcon,
  SearchIcon 
} from '../components/icons/CustomIcons';
import AnimatedButton from '../components/AnimatedButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const SPACING = 16;

const POPULAR_ROUTES = [
  { id: 1, from: 'Hà Nội', to: 'Vinh', price: '250.000đ', time: '6h00', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop' },
  { id: 2, from: 'Hà Nội', to: 'Đà Nẵng', price: '450.000đ', time: '14h00', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop' },
  { id: 3, from: 'Vinh', to: 'Huế', price: '300.000đ', time: '8h00', image: 'https://images.unsplash.com/photo-1610488427954-2bc5527a4697?q=80&w=800&auto=format&fit=crop' },
];

const RouteCard = ({ route, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [15, 0, -15],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotateY}deg` },
        { scale }
      ],
    };
  });

  return (
    <Animated.View style={[styles.routeCard, animatedStyle]}>
      <Image source={{ uri: route.image }} style={styles.routeImage} />
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{route.price}</Text>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeTitle}>{route.from} → {route.to}</Text>
        <View style={styles.routeTime}>
          <DateIcon size={16} color={COLORS.neutral[500]} style={{ marginRight: 4 }} />
          <Text style={styles.routeTimeText}>Thời gian: {route.time}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }) {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const scrollX = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <BusIcon size={24} color={COLORS.brand[500]} />
            </View>
            <Text style={styles.brandName}>HÀO THANH</Text>
          </View>
          <View style={styles.avatar}>
            <UserIcon size={20} color={COLORS.white} />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchCard}>
            <Text style={styles.searchTitle}>Tìm chuyến xe của bạn</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <LocationIcon size={20} color={COLORS.brand[500]} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Điểm đi (VD: Hà Nội)"
                placeholderTextColor={COLORS.neutral[400]}
                value={departure}
                onChangeText={setDeparture}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <LocationIcon size={20} color={COLORS.brand[500]} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Điểm đến (VD: Vinh)"
                placeholderTextColor={COLORS.neutral[400]}
                value={destination}
                onChangeText={setDestination}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <DateIcon size={20} color={COLORS.brand[500]} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ngày đi (DD/MM/YYYY)"
                placeholderTextColor={COLORS.neutral[400]}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <AnimatedButton 
              title="TÌM CHUYẾN NGAY" 
              onPress={() => Alert.alert('Thông báo', 'Tính năng tìm kiếm đang được phát triển.')}
              style={styles.searchButton}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tuyến Phổ Biến</Text>
          <Text style={styles.sectionSubtitle}>Khám phá những điểm đến yêu thích</Text>
        </View>

        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.horizontalScrollList}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {POPULAR_ROUTES.map((route, index) => (
            <RouteCard key={route.id} route={route} index={index} scrollX={scrollX} />
          ))}
        </Animated.ScrollView>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.brand[50],
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandName: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: '800',
    color: COLORS.brand[600],
    letterSpacing: 0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.neutral[300],
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: 16,
    marginTop: 8,
  },
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 20,
    ...SHADOWS.lg,
  },
  searchTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: RADIUS.lg,
    height: 54,
    marginBottom: 12,
  },
  inputIcon: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[900],
  },
  searchButton: {
    marginTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[500],
  },
  horizontalScrollList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  routeCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginRight: SPACING,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  routeImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  priceText: {
    color: COLORS.brand[600],
    fontWeight: TYPOGRAPHY.weight.bold,
    fontSize: TYPOGRAPHY.sm,
  },
  routeInfo: {
    padding: 16,
  },
  routeTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTimeText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[600],
  }
});