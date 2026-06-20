import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon } from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../theme';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'text-encoding/lib/encoding'; // polyfill for React Native

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [user, setUser] = useState(null);
  const stompClient = useRef(null);
  const insets = useSafeAreaInsets();

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
      if (userRes.data && userRes.data.success) {
        const currentUser = userRes.data.data;
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
        connectWebSocket(sid);
      }
    } catch (error) {
      console.error('Lỗi khởi tạo chat:', error);
    }
  };

  const connectWebSocket = async (sid) => {
    const token = await AsyncStorage.getItem('token');
    
    // In dev, assuming 10.0.2.2 or localhost
    const wsUrl = api.defaults.baseURL.replace('/api/v1', '') + '/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      debug: function (str) {
        // console.log(str);
      },
      onConnect: () => {
        client.subscribe(`/topic/chat/${sid}`, (message) => {
          const body = JSON.parse(message.body);
          // Only add if it's not sent by me (to avoid duplication since GiftedChat adds optimistically)
          if (body.senderId !== user?._id) {
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
          }}
        >
          <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: 'bold' }}>Gửi</Text>
        </LinearGradient>
      </Send>
    );
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#eef2f3']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={24} color={COLORS.neutral[800]} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Hỗ trợ trực tuyến</Text>
            <Text style={styles.headerSubtitle}>Luôn sẵn sàng hỗ trợ bạn</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {user ? (
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={user}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            placeholder="Nhập tin nhắn..."
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.semantic.success,
    marginTop: 2,
  }
});