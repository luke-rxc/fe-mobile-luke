import { create } from 'zustand';
import { nanoid } from '@utils/nanoid';
import { ToastProps } from '@pui/toast';

export interface ToastActiveListProps {
  props: ToastProps;
  id: string;
}

export interface ToastState {
  activeToasts: ToastActiveListProps[];
  addToast: (props: ToastProps) => void;
  removeToast: (id: string) => void;
  removeAllToast: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  activeToasts: [],
  addToast: (props: ToastProps) => {
    const id = nanoid();
    set((state) => ({ activeToasts: [...state.activeToasts, { props, id }] }));
  },
  removeToast: (id: string) => {
    set((state) => ({ activeToasts: state.activeToasts.filter((toast: ToastActiveListProps) => toast.id !== id) }));
  },
  removeAllToast: () => {
    set(() => ({ activeToasts: [] }));
  },
}));
