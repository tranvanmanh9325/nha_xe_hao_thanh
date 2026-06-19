import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import api from '../services/api';

export default function HomeScreen() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      if (response.data && response.data.content) {
        setTrips(response.data.content);
      } else if (Array.isArray(response.data)) {
        setTrips(response.data);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Extract unique departure and destination points dynamically
  const departurePoints = [...new Set(trips.map(t => t.departurePoint))].filter(Boolean);
  const destinationPoints = [...new Set(trips.map(t => t.destinationPoint))].filter(Boolean);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-xl p-4 mb-4" style={styles.cardShadow}>
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Tìm chuyến xe của bạn</Text>
        
        <View className="mb-3">
          <Text className="text-sm font-semibold text-gray-600 mb-1">Điểm đi:</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-black"
            placeholder="Nhập điểm đi..."
            value={departure}
            onChangeText={setDeparture}
          />
        </View>
        
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-600 mb-1">Điểm đến:</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-black"
            placeholder="Nhập điểm đến..."
            value={destination}
            onChangeText={setDestination}
          />
        </View>
        
        <TouchableOpacity className="bg-blue-600 rounded-lg py-3 items-center">
          <Text className="text-white font-bold text-base">Tìm chuyến ngay</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-bold text-gray-800 mb-2">Các tuyến phổ biến</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <View className="flex-row justify-between">
          <View className="flex-1 bg-white p-3 rounded-lg mr-2" style={styles.itemShadow}>
            <Text className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-2">Xuất phát từ</Text>
            {departurePoints.slice(0, 5).map((point, idx) => (
              <TouchableOpacity key={idx} onPress={() => setDeparture(point)} className="py-2 border-b border-gray-100">
                <Text className="text-blue-600 font-medium">{point}</Text>
              </TouchableOpacity>
            ))}
            {departurePoints.length === 0 && <Text className="text-gray-500 text-sm">Không có dữ liệu</Text>}
          </View>

          <View className="flex-1 bg-white p-3 rounded-lg ml-2" style={styles.itemShadow}>
            <Text className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-2">Đi đến</Text>
            {destinationPoints.slice(0, 5).map((point, idx) => (
              <TouchableOpacity key={idx} onPress={() => setDestination(point)} className="py-2 border-b border-gray-100">
                <Text className="text-blue-600 font-medium">{point}</Text>
              </TouchableOpacity>
            ))}
            {destinationPoints.length === 0 && <Text className="text-gray-500 text-sm">Không có dữ liệu</Text>}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: Platform.select({
    web: {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  }),
  itemShadow: Platform.select({
    web: {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
  }),
});
