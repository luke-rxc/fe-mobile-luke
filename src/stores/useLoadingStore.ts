import { create } from 'zustand';
import { SpinnerProps } from '@pui/spinner';

export interface LoadInfoProps {
  isLoading: boolean;
  props?: SpinnerProps;
}

export interface LoadingState {
  loadInfo: LoadInfoProps;
  showLoading: (props?: SpinnerProps) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>()((set) => ({
  loadInfo: { isLoading: false },
  showLoading: (props?: SpinnerProps) => {
    set(() => ({ loadInfo: { isLoading: true, props } }));
  },
  hideLoading: () => {
    set(() => ({ loadInfo: { isLoading: false } }));
  },
}));
