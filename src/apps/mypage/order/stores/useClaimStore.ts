import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReasonProps {
  reasonCode: string;
  reason?: string;
  fileIdList?: Array<number>;
}

interface ItemInfoProps {
  /** 주문 상품 id */
  itemId?: number | string;
  /** 주문 옵션 id  */
  itemOptionId?: number | string;
  /** 출고 id */
  exportId?: string | number;
  /** 교환할 상품 옵션 아이디 */
  goodsOptionId?: number | string;
}

interface ClaimCancelState {
  /** 사유 */
  reasonItem: ReasonProps;
  /** 기준 상품 및 묶음 상품 정보 포함 리스트 */
  itemInfoList: ItemInfoProps[];
  /** 반품 회수 방법 */
  recallMethod: string;
  updateReasonItem: (data: ReasonProps) => void;
  resetReasonItem: () => void;
  updateItemInfoList: (data: ItemInfoProps[]) => void;
  resetItemInfoList: () => void;
  updateRecallMethod: (data: string) => void;
  resetRecallMethod: () => void;
  resetAllData: () => void;
}

export const useClaimStore = create<ClaimCancelState>()(
  persist(
    (set) => ({
      reasonItem: { reasonCode: '' },
      itemInfoList: [],
      recallMethod: '',
      updateReasonItem: (data: ReasonProps) => {
        set((state) => ({ reasonItem: { ...state.reasonItem, ...data } }));
      },
      resetReasonItem: () => {
        set(() => ({ reasonItem: { reasonCode: '' } }));
      },
      updateItemInfoList: (data: ItemInfoProps[]) => {
        set((state) => ({ itemInfoList: [...state.itemInfoList, ...data] }));
      },
      resetItemInfoList: () => {
        set(() => ({ itemInfoList: [] }));
      },
      updateRecallMethod: (data: string) => {
        set(() => ({ recallMethod: data }));
      },
      resetRecallMethod: () => {
        set(() => ({ recallMethod: '' }));
      },
      resetAllData: () => {
        useClaimStore.persist.clearStorage();
      },
    }),
    {
      name: 'prizm_web_zustand_persist_claim_store',
    },
  ),
);
