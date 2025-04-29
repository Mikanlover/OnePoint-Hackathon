export interface ModelSettings {
  temperature: number;
  maxTokens: number;
  simplifyThreshold: 'low' | 'medium' | 'high';
}

export interface MessageType {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isRedirect?: boolean;
  redirectUrl?: string;
}

export interface QueryResponse {
  content: string;
  isRedirect: boolean;
  redirectUrl?: string;
}