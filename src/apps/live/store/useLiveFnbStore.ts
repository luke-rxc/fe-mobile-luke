import { create } from 'zustand';

interface LiveFnbState {
  showFaq: boolean;
  showFaqDot: boolean;
  faqClassName: string;
  initialShowFaq: (show: boolean) => void;
  updateShowFaqDot: (show: boolean) => void;
  updateShowFaq: (className?: string) => void;
  updateHideFaq: (className?: string) => void;
}

export const useLiveFnbStore = create<LiveFnbState>((set) => ({
  showFaq: false,
  showFaqDot: false,
  faqClassName: '',
  initialShowFaq: (show: boolean) =>
    set(() => {
      return {
        showFaq: show,
      };
    }),
  updateShowFaqDot: (show: boolean) =>
    set(() => {
      return {
        showFaqDot: show,
      };
    }),
  updateShowFaq: (className?: string) =>
    set((state) => {
      return {
        showFaqDot: true,
        showFaq: true,
        faqClassName: className || state.faqClassName,
      };
    }),
  updateHideFaq: (className?: string) =>
    set((state) => {
      return {
        showFaqDot: false,
        showFaq: true,
        faqClassName: className || state.faqClassName,
      };
    }),
}));
