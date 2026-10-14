import { useState, useEffect, useRef, FormEvent } from 'react';
import { greenApi } from '../api/greenApi';
import { Credentials, Message } from '../types';

interface ChatProps {
  credentials: Credentials;
  onLogout: () => void;
}

export default function Chat({ credentials, onLogout }: ChatProps) {
  const [chatId, setChatId] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateChat = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    const cleanPhone = phoneInput.replace(/\D/g, '');
    setChatId(`${cleanPhone}@c.us`);
    setMessages([]);
    setPhoneInput('');
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;

    const tempId = Date.now();
    const newMessage: Message = { id: tempId, text: inputText, isOutgoing: true };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    try {
      await greenApi.sendMessage({
        ...credentials,
        chatId,
        message: inputText
      });
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Не удалось отправить сообщение. Проверьте учетные данные.');
    }
  };

  useEffect(() => {
    const poll = async () => {
      try {
        const notification = await greenApi.receiveNotification(
          credentials.idInstance,
          credentials.apiTokenInstance
        );

        if (notification && notification.body) {
          const { typeWebhook, senderData, messageData } = notification.body;

          if (typeWebhook === 'incomingMessageReceived' && messageData?.typeMessage === 'textMessage') {
            const senderChatId = senderData.chatId;
            if (senderChatId === chatId) {
              setMessages((prev) => [
                ...prev,
                { 
                  id: notification.receiptId, 
                  text: messageData.textMessageData?.textMessage || '', 
                  isOutgoing: false 
                }
              ]);
            }
          }

          await greenApi.deleteNotification(
            credentials.idInstance,
            credentials.apiTokenInstance,
            notification.receiptId
          );
        }
      } catch (error) {
        console.error('Ошибка получения:', error);
      } finally {
        pollingRef.current = setTimeout(poll, 1500);
      }
    };

    poll();
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [chatId, credentials]);

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Чаты</h3>
          <button onClick={onLogout} className="logout-btn">Выйти</button>
        </div>
        <form onSubmit={handleCreateChat} className="new-chat-form">
          <input
            type="tel"
            placeholder="Номер телефона"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />
          <button type="submit">Создать</button>
        </form>
        {chatId && <div className="chat-item active">{chatId.replace('@c.us', '')}</div>}
      </aside>

      <main className="chat-main">
        {!chatId ? (
          <div className="empty-state">
            <p>Выберите чат или создайте новый</p>
          </div>
        ) : (
          <>
            <header className="chat-header">{chatId.replace('@c.us', '')}</header>
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.isOutgoing ? 'outgoing' : 'incoming'}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                placeholder="Введите сообщение..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit">➤</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}