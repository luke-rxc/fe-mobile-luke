import { create } from 'zustand';

interface RegionState {
  // 툴바 클리어 버튼
  clearButton: { disabled: boolean };
  // 툴바 클리어 버튼 활성화
  enableClearButton: () => void;
  // 툴바 클리어 버튼 비활성화
  disableClearButton: () => void;
}

export const useRegionStore = create<RegionState>((set) => ({
  clearButton: { disabled: true },
  enableClearButton: () => set(() => ({ clearButton: { disabled: false } })),
  disableClearButton: () => set(() => ({ clearButton: { disabled: true } })),
}));
