/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { ModalWrapperInnerProps, ModalWrapperRenderProps } from '@pui/modal';

export interface ModalContentProps extends ModalWrapperInnerProps {
  /**
   * Render Props
   * @return {onClose} modal Close function
   * @return {transitionState} transition state - 해당 인자를 체크하여 modal 이 닫힐때의 애니메이션 구현
   */
  render: ({ onClose, transitionState }: ModalWrapperRenderProps) => React.ReactNode;
  /** 기본 Modal Wrapper를 쓰지 않을 경우
   * @default false
   */
  nonModalWrapper?: boolean;
}

export interface ModalActiveListProps {
  props: ModalContentProps;
  id: string;
}

export interface MountListProps {
  id: string;
  fn: () => void;
}

/**
 * 모달 상태
 */
export const ModalStatus = {
  /**
   * 열림
   */
  OPENED: 'OPENED',
  /**
   * 닫힘
   */
  CLOSED: 'CLOSED',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ModalStatus = typeof ModalStatus[keyof typeof ModalStatus];

export interface ModalState {
  activeModals: ModalActiveListProps[];
  mountContents: MountListProps[];
  modalDepth: number;
  mount: (data: MountListProps) => void;
  mounted: (id: string) => void;
  open: (props: ModalContentProps, id: string) => void;
  close: (id: string) => void;
  getStatus: (id: string) => ModalStatus;
}

export const useModalStore = create<ModalState>()((set, get) => ({
  activeModals: [],
  mountContents: [],
  modalDepth: 0,
  mount: (data: MountListProps) => {
    set((state) => ({ mountContents: [...state.mountContents, data] }));
  },
  mounted: (id: string) => {
    const mount = get().mountContents.find(({ id: _id }) => _id === id);
    if (mount) {
      mount.fn();
      set((state) => ({
        mountContents: state.mountContents.filter(({ id: _id }) => _id !== id),
      }));
    }
  },
  open: (props: ModalContentProps, id: string) => {
    set((state) => ({ modalDepth: state.activeModals.length + 1 }));
    set((state) => ({ activeModals: [...state.activeModals, { props, id }] }));
  },
  close: (id: string) => {
    set((state) => ({
      modalDepth: state.activeModals.length - 1,
    }));
    set((state) => ({
      activeModals: state.activeModals.filter((modal: ModalActiveListProps) => modal.id !== id),
    }));
  },
  getStatus: (id: string) => {
    return get().activeModals.find((modal) => modal.id === id) ? ModalStatus.OPENED : ModalStatus.CLOSED;
  },
}));
