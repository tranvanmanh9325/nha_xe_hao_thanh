import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GiftedChat, Bubble, Send, InputToolbar, Avatar } from 'react-native-gifted-chat';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { ArrowLeftIcon } from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../theme';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'text-encoding/lib/encoding'; // polyfill for React Native
import { useTranslation } from 'react-i18next';

export default function ChatScreen({ navigation }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [user, setUser] = useState(null);
  const stompClient = useRef(null);
  const insets = useSafeAreaInsets();

  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

  useEffect(() => {
    initChat();
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const initChat = async () => {
    try {
      // 1. Get user profile
      const userRes = await api.get('/auth/me');
      let currentUserId = null;
      if (userRes.data && userRes.data.success) {
        const currentUser = userRes.data.data;
        currentUserId = currentUser.id;
        setUser({
          _id: currentUser.id,
          name: currentUser.fullName,
          avatar: 'https://ui-avatars.com/api/?name=' + currentUser.fullName,
        });
      }

      // 2. Get or create session
      const sessionRes = await api.get('/chat/session');
      if (sessionRes.data && sessionRes.data.success) {
        const sid = sessionRes.data.data.id;
        setSessionId(sid);

        // 3. Load history
        const historyRes = await api.get(`/chat/history/${sid}`);
        if (historyRes.data && historyRes.data.success) {
          const formattedMessages = historyRes.data.data.map(msg => ({
            _id: msg.id,
            text: msg.content,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.senderId || 'admin',
              name: msg.senderName || 'Hào Thanh Support',
            },
          })).reverse(); // GiftedChat displays in reverse order
          setMessages(formattedMessages);
        }

        // 4. Connect STOMP WebSocket
        connectWebSocket(sid, currentUserId);
      }
    } catch (error) {
      console.error('Lỗi khởi tạo chat:', error);
    }
  };

  const connectWebSocket = async (sid, currentUserId) => {
    const token = await AsyncStorage.getItem('auth_token');
    
    // SockJS must use HTTP/HTTPS URL, NOT WS/WSS
    const baseUrl = api.defaults.baseURL.replace('/api/v1', '');
    const sockJsUrl = baseUrl + '/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(sockJsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log("STOMP CONNECTED VIA SOCKJS!");
        client.subscribe(`/topic/chat/${sid}`, (message) => {
          const body = JSON.parse(message.body);
          // Safely compare IDs by converting both to String
          if (String(body.senderId) !== String(currentUserId)) {
            const incomingMsg = {
              _id: body.id,
              text: body.content,
              createdAt: new Date(body.createdAt),
              user: {
                _id: body.senderId || 'admin',
                name: body.senderName || 'Hào Thanh Support',
              },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [incomingMsg]));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket Error:', event);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket Closed:', event);
      }
    });

    client.activate();
    stompClient.current = client;
  };

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    if (stompClient.current && stompClient.current.connected && sessionId && user) {
      const msg = newMessages[0];
      stompClient.current.publish({
        destination: `/app/chat/${sessionId}`,
        body: JSON.stringify({
          senderId: user._id,
          content: msg.text,
        }),
      });
    }
  }, [sessionId, user]);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.brand[500],
            borderRadius: 20,
            borderTopRightRadius: 4,
            marginBottom: 4,
            ...SHADOWS.md,
          },
          left: {
            backgroundColor: COLORS.white,
            borderRadius: 20,
            borderTopLeftRadius: 4,
            marginBottom: 4,
            ...SHADOWS.sm,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.03)'
          }
        }}
        textStyle={{
          right: {
            color: COLORS.white,
            fontSize: 15,
            lineHeight: 22,
          },
          left: {
            color: COLORS.neutral[900],
            fontSize: 15,
            lineHeight: 22,
          }
        }}
      />
    );
  };

  const renderDay = (props) => {
    if (props.currentMessage && props.currentMessage.createdAt) {
      const date = new Date(props.currentMessage.createdAt);
      const dateString = date.toDateString();

      let dateText = '';
      if (dateString === todayStr) {
        dateText = 'Hôm nay';
      } else if (dateString === yesterdayStr) {
        dateText = 'Hôm qua';
      } else {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        dateText = `${d}/${m}/${y}`;
      }
      
      return (
        <View style={{ marginVertical: 10, alignItems: 'center' }}>
          <Text style={{ color: COLORS.neutral[500], fontSize: 12, fontWeight: '500' }}>
            {dateText}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderAvatar = (props) => {
    return (
      <Avatar
        {...props}
        containerStyle={{
          left: {
            transform: [{ translateY: -12 }],
          }
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: COLORS.white,
          borderRadius: 30,
          borderTopColor: 'transparent',
          marginHorizontal: 15,
          marginBottom: 10,
          paddingVertical: 4,
          paddingHorizontal: 4,
          ...SHADOWS.lg,
        }}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={[COLORS.brand[400], COLORS.brand[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 4,
            ...SHADOWS.sm,
            paddingLeft: 2, // slight padding to visually center the dart
          }}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {/* Lớp nền chính của máy bay giấy */}
            <Path d="M3 4 L22 12 L3 20 L10 12 Z" fill="white" />
            {/* Lớp bóng đổ bên dưới để tạo hiệu ứng 3D gấp giấy */}
            <Path d="M10 12 L22 12 L3 20 Z" fill="black" fillOpacity="0.15" />
          </Svg>
        </LinearGradient>
      </Send>
    );
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#eef2f3']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon size={24} color={COLORS.neutral[800]} />
            </TouchableOpacity>
            
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://ui-avatars.com/api/?name=Hào+Thanh&background=0D8ABC&color=fff&rounded=true' }} 
                style={styles.headerAvatar} 
              />
              <View style={styles.activeDot} />
            </View>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{t('chat.title')}</Text>
              <Text style={styles.headerSubtitle}>Đang hoạt động</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            {/* Space for future icons like Call/Info */}
          </View>
        </View>

        {user ? (
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={user}
            renderBubble={renderBubble}
            renderAvatar={renderAvatar}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            renderDay={renderDay}
            timeFormat="HH:mm"
            placeholder={t('chat.inputPlaceholder')}
            showUserAvatar={false}
            renderAvatarOnTop={true}
            alwaysShowSend={true}
            bottomOffset={Platform.OS === 'ios' ? insets.bottom + 10 : 10}
            messagesContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Đang kết nối...</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 4,
    marginLeft: -8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.neutral[200],
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.semantic.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerTitleContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  }
});