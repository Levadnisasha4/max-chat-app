import { Credentials, GreenApiNotification, SendMessagePayload } from '../types';

const API_URL = 'https://api.green-api.com/v3';

export const greenApi = {
  sendMessage: async ({ idInstance, apiTokenInstance, chatId, message }: SendMessagePayload): Promise<any> => {
    const response = await fetch(
      `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message })
      }
    );
    if (!response.ok) throw new Error('Ошибка отправки');
    return response.json();
  },

  receiveNotification: async (idInstance: string, apiTokenInstance: string): Promise<GreenApiNotification | null> => {
    const response = await fetch(
      `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
    );
    if (!response.ok) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  deleteNotification: async (idInstance: string, apiTokenInstance: string, receiptId: number): Promise<void> => {
    await fetch(
      `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
      { method: 'DELETE' }
    );
  }
};