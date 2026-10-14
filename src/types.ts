export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Message {
  id: number;
  text: string;
  isOutgoing: boolean;
}

export interface SendMessagePayload {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  message: string;
}

export interface GreenApiNotification {
  receiptId: number;
  body: {
    typeWebhook: string;
    senderData: {
      chatId: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
}