import { create } from 'zustand';
import { LIVE_PURCHASE_VERIFICATION_LOTTIE_VIEW_COUNT } from '../constants';

interface PurchaseVerificationItem {
  id: string;
  lottieNum: number;
  ended: boolean;
}

interface PurchaseVerificationState {
  purchaseVerificationList: PurchaseVerificationItem[];
  queueList: PurchaseVerificationItem[];
  pushItem: (newItem: PurchaseVerificationItem) => void;
  moveItem: () => void;
  getLastLottieNum: () => number;
  updateItem: (id: string) => void;
}

/**
 * 라이브 구매인증 store
 */
export const useLivePurchaseVerificationStore = create<PurchaseVerificationState>((set, get) => ({
  purchaseVerificationList: [],
  queueList: [],
  pushItem: (newItem: PurchaseVerificationItem) =>
    set((state) => {
      return {
        queueList: [...state.queueList, newItem],
      };
    }),
  updateItem: (id: string) =>
    set((state) => {
      return {
        purchaseVerificationList: state.purchaseVerificationList.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ended: true,
            };
          }
          return item;
        }),
      };
    }),
  moveItem: () => {
    set((state) => {
      if (
        state.purchaseVerificationList.filter((item) => !item.ended).length <
          LIVE_PURCHASE_VERIFICATION_LOTTIE_VIEW_COUNT &&
        state.queueList.length >= 1
      ) {
        const targetItem = state.queueList[0];
        const purchaseVerificationList = [...state.purchaseVerificationList, targetItem];
        const queueList = state.queueList.slice(1);
        return { purchaseVerificationList, queueList };
      }

      return state;
    });
  },
  getLastLottieNum: () => {
    const { purchaseVerificationList, queueList } = get();
    const items = [...purchaseVerificationList, ...queueList];
    return items.length > 0 ? items[items.length - 1].lottieNum ?? 0 : 0;
  },
}));
