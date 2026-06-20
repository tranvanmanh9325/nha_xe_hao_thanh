import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Platform,
  Pressable
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { 
  BusIcon, 
  LocationIcon, 
  DateIcon, 
  UserIcon,
  SearchIcon 
} from '../components/icons/CustomIcons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;
const SPACING = 20;

const POPULAR_ROUTES = [
  { id: 1, from: 'HÀ NỘI', to: 'VINH', price: '250.000đ', time: '06:00', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop' },
  { id: 2, from: 'HÀ NỘI', to: 'ĐÀ NẴNG', price: '450.000đ', time: '14:00', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop' },
  { id: 3, from: 'VINH', to: 'HUẾ', price: '300.000đ', time: '08:00', image: 'https://images.unsplash.com/photo-1610488427954-2bc5527a4697?q=80&w=800&auto=format&fit=crop' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RouteCard = ({ route, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const rotateY = interpolate(scrollX.value, inputRange, [25, 0, -25], Extrapolation.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [20, 0, 20], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { scale },
        { translateY }
      ],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];
    // Parallax effect on image
    const translateX = interpolate(scrollX.value, inputRange, [50, 0, -50], Extrapolation.CLAMP);
    return {
      transform: [{ translateX }]
    };
  });

  return (
    <Animated.View style={[styles.routeCard, animatedStyle]}>
      <View style={styles.imageContainer}>
        <Animated.Image source={{ uri: route.image }} style={[styles.routeImage, imageAnimatedStyle]} />
        <View style={styles.imageOverlay} />
        <View style={styles.priceTagGlass}>
          <Text style={styles.priceText}>{route.price}</Text>
        </View>
      </View>
      <View style={styles.routeInfo}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>{route.from}</Text>
          <BusIcon size={18} color={COLORS.brand[500]} style={{ marginHorizontal: 8 }} />
          <Text style={styles.routeTitle}>{route.to}</Text>
        </View>
        <View style={styles.routeFooter}>
          <View style={styles.routeTime}>
            <DateIcon size={14} color={COLORS.neutral[400]} style={{ marginRight: 6 }} />
            <Text style={styles.routeTimeText}>{route.time}</Text>
          </View>
          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>CHỌN</Text>
          </View>
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
  const buttonScale = useSharedValue(1);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const animatedBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  const handleSearchPress = () => {
    Alert.alert('Khởi động quét', 'Hệ thống đang tìm kiếm chuyến đi không gian...');
  };

  return (
    <View style={styles.container}>
      {/* Abstract Background Elements */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconGlow}>
              <BusIcon size={24} color={COLORS.brand[500]} />
            </View>
            <Text style={styles.brandName}>HAO THANH<Text style={styles.brandAccent}>_NX</Text></Text>
          </View>
          <View style={styles.avatarGlass}>
            <UserIcon size={20} color={COLORS.brand[500]} />
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Floating Search Panel */}
          <View style={styles.searchContainer}>
            <View style={styles.searchGlassPanel}>
              <View style={styles.searchHeader}>
                <SearchIcon size={20} color={COLORS.neutral[800]} />
                <Text style={styles.searchTitle}>ĐỊNH VỊ CHUYẾN ĐI</Text>
              </View>
              
              <View style={styles.inputWrapper}>
                <View style={styles.timelineLine} />
                
                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <LocationIcon size={18} color={COLORS.brand[500]} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Tọa độ xuất phát"
                    placeholderTextColor={COLORS.neutral[400]}
                    value={departure}
                    onChangeText={setDeparture}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={[styles.inputIconContainer, { marginTop: 4 }]}>
                    <LocationIcon size={18} color={COLORS.neutral[800]} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Điểm đến (Dest.)"
                    placeholderTextColor={COLORS.neutral[400]}
                    value={destination}
                    onChangeText={setDestination}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { marginTop: 16 }]}>
                <View style={styles.inputIconContainer}>
                  <DateIcon size={18} color={COLORS.neutral[800]} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Thời gian khởi hành (DD/MM/YY)"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <AnimatedPressable 
                style={[styles.searchButton, animatedBtnStyle]}
                onPressIn={() => buttonScale.value = withTiming(0.95)}
                onPressOut={() => buttonScale.value = withTiming(1)}
                onPress={handleSearchPress}
              >
                <Text style={styles.searchButtonText}>QUÉT CHUYẾN ĐI</Text>
              </AnimatedPressable>
            </View>
          </View>

          {/* 3D Carousel Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TUYẾN HOT</Text>
            <View style={styles.sectionLine} />
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
          
          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bgCircleTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(240, 81, 35, 0.05)',
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: -50,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(37, 99, 235, 0.03)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconGlow: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...SHADOWS.glow,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.neutral[900],
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  brandAccent: {
    color: COLORS.brand[500],
  },
  avatarGlass: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    ...SHADOWS.sm,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 10,
  },
  searchGlassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: RADIUS['2xl'],
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...SHADOWS.futuristic,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.neutral[800],
    letterSpacing: 2,
    marginLeft: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 17,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: COLORS.neutral[200],
    borderStyle: 'dashed',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.lg,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  inputIconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.neutral[900],
    paddingRight: 16,
  },
  searchButton: {
    backgroundColor: COLORS.neutral[900],
    borderRadius: RADIUS.lg,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...SHADOWS.futuristic,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 40,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.neutral[900],
    letterSpacing: 2,
    marginRight: 16,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[200],
  },
  horizontalScrollList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  routeCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['2xl'],
    marginRight: SPACING,
    overflow: 'hidden',
    ...SHADOWS.futuristic,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  routeImage: {
    width: '130%',
    height: '100%',
    left: '-15%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  priceTagGlass: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  priceText: {
    color: COLORS.neutral[900],
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  routeInfo: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.neutral[900],
    letterSpacing: 1,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral[500],
  },
  actionBtn: {
    backgroundColor: COLORS.brand[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  actionBtnText: {
    color: COLORS.brand[600],
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  }
});