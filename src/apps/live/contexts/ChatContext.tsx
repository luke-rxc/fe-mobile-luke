import { createContext } from 'react';

export interface ChatContextValue {
  bidColor?: string | null;
  listAreaWidth: number;
  updateChatItemHeight: (index: number, size: number) => void;
  onClickItem?: (event: React.MouseEvent) => void;
}

export const ChatContext = createContext<ChatContextValue>({
  bidColor: '',
  listAreaWidth: 0,
  updateChatItemHeight: () => {},
  onClickItem: () => {},
});
