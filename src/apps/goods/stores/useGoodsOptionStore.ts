import { create } from 'zustand';
import { ExpiredInfoType, OptionResultValuesProps } from '../types';

interface GoodsOptionProps {
  id: number;
  options: OptionResultValuesProps[];
  expired?: ExpiredInfoType;
}

interface GoodsOptionState {
  goodsOptions: GoodsOptionProps[];
  actions: GoodsOptionActions;
}

interface GoodsOptionActions {
  updateGoodsOptions: (option: GoodsOptionProps) => void;
  deleteGoodsOption: (id: number) => void;
  clearGoodsOptions: () => void;
}

type GoodsOptionsStoreState = GoodsOptionState;

const useStore = create<GoodsOptionsStoreState>()((set) => ({
  goodsOptions: [],
  actions: {
    updateGoodsOptions: (option: GoodsOptionProps) => {
      set((state) => {
        const { id, options, expired } = option;
        const { goodsOptions } = state;
        const selected = goodsOptions.find(({ id: _id }) => _id === id);

        if (selected) {
          const selectedOption = { ...selected, options, expired };
          const otherOption = goodsOptions.filter(({ id: _id }) => _id !== id);

          return { ...state, goodsOptions: [...otherOption, selectedOption] };
        }

        return { ...state, goodsOptions: [...goodsOptions, { ...option }] };
      });
    },
    deleteGoodsOption: (id: number) => {
      set((state) => ({ ...state, goodsOptions: state.goodsOptions.filter(({ id: _id }) => _id !== id) }));
    },
    clearGoodsOptions: () => {
      set((state) => ({ ...state, goodsOptions: [] }));
    },
  },
}));

export const useGoodsOptionsState = () => useStore((state) => state.goodsOptions);

export const useGoodsOptionsAction = () => useStore((state) => state.actions);
