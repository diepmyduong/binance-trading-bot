export type IChatBotImageMessage = {
  apiKey?: string;
  psids: string[];
  image: string;
  context?: any;
};
export type IChatBotTextMessage = {
  apiKey?: string;
  psids: string[];
  message: string;
  context?: any;
};