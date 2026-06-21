import { useState, useEffect, useRef } from 'react';
import { authFetch, API_BASE_URL } from '../utils/authService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { UserIcon } from '../assets/icons';

// If SendIcon doesn't exist, we fallback to text
const SendIconFallback = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const SupportChat = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);



  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }


  function connectWebSocket(sessionId) {
    if (stompClient.current) {
      stompClient.current.deactivate();
    }

    const token = localStorage.getItem('accessToken');
    const wsUrl = `${API_BASE_URL}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${sessionId}`, (message) => {
          const body = JSON.parse(message.body);
          setMessages(prev => [...prev, body]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      },
    });

    client.activate();
    stompClient.current = client;
  }

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/v1/admin/chat/sessions`);
        const data = await response.json();
        if (data.success) {
          setSessions(data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách chat:', error);
      }
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    async function fetchHistory(sessionId) {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/v1/chat/history/${sessionId}`);
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch sử chat:', error);
      }
    }

    if (activeSession) {
      fetchHistory(activeSession.id);
      connectWebSocket(activeSession.id);
    }
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [activeSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSession || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: `/app/chat/${activeSession.id}`,
      body: JSON.stringify({
        senderId: null, // null means admin
        content: newMessage,
      }),
    });
    setNewMessage('');
  };

  const closeSession = async (sessionId) => {
    if(!window.confirm("Bạn có chắc muốn đóng phiên chat này?")) return;
    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/admin/chat/sessions/${sessionId}/close`, { method: 'POST' });
      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
        if (activeSession?.id === sessionId) {
          setActiveSession(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Lỗi khi đóng phiên chat', error);
    }
  };

  return (
    <div className="support-chat-container" style={{ display: 'flex', height: 'calc(100vh - 128px)', gap: '20px' }}>
      
      {/* Sidebar: List of Sessions */}
      <div className="chat-sidebar" style={{ width: '300px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Khách hàng cần hỗ trợ</h3>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {sessions.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>Không có cuộc trò chuyện nào</p>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id} 
                onClick={() => setActiveSession(session)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  backgroundColor: activeSession?.id === session.id ? '#f0f7ff' : '#fafafa',
                  border: `1px solid ${activeSession?.id === session.id ? '#cce3ff' : '#eee'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{session.userName || session.userPhone}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {new Date(session.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div 
                  style={{ fontSize: '12px', color: 'red', cursor: 'pointer', padding: '4px 8px', backgroundColor: '#fee', borderRadius: '4px' }}
                  onClick={(e) => { e.stopPropagation(); closeSession(session.id); }}
                >
                  Đóng
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main" style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {activeSession ? (
          <>
            <div className="chat-header" style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
              <UserIcon size={24} style={{ marginRight: '10px', color: '#555' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{activeSession.userName || activeSession.userPhone}</h3>
                <span style={{ fontSize: '12px', color: '#10b981' }}>Đang trực tuyến</span>
              </div>
            </div>
            
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f9fafb' }}>
              {messages.map((msg, index) => {
                const isAdmin = msg.senderId === null;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '10px 16px',
                      borderRadius: '16px',
                      backgroundColor: isAdmin ? '#e15234' : '#fff',
                      color: isAdmin ? '#fff' : '#333',
                      border: isAdmin ? 'none' : '1px solid #eee',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      borderBottomRightRadius: isAdmin ? '4px' : '16px',
                      borderBottomLeftRadius: !isAdmin ? '4px' : '16px',
                    }}>
                      <div style={{ wordBreak: 'break-word', lineHeight: '1.4' }}>{msg.content}</div>
                      <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'right', color: isAdmin ? '#ffcfc4' : '#999' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input" style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', backgroundColor: '#fff' }}>
              <input
                type="text"
                placeholder="Nhập tin nhắn trả lời..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '24px',
                  border: '1px solid #ddd',
                  outline: 'none',
                  fontSize: '14px',
                  marginRight: '12px'
                }}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                style={{
                  backgroundColor: newMessage.trim() ? '#e15234' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
              >
                <SendIconFallback size={20} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', flexDirection: 'column' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '20px' }}>
              <path d="M12 2C6.477 2 2 6.03 2 11C2 13.06 2.766 14.953 4.047 16.5C3.766 18.063 2.5 19.5 2.5 19.5C2.5 19.5 5.25 19.5 7.422 18.234C8.828 18.734 10.375 19 12 19C17.523 19 22 14.97 22 11C22 6.03 17.523 2 12 2Z" fill="#FFF5F2" stroke="#FF7B54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11H8.01" stroke="#F05123" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11H12.01" stroke="#F05123" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 11H16.01" stroke="#F05123" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 style={{ color: '#111827', fontWeight: '600', margin: '0 0 8px 0' }}>Chat Hỗ Trợ</h2>
            <p style={{ color: '#6B7280', margin: 0 }}>Chọn một khách hàng ở danh sách bên trái để bắt đầu trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;