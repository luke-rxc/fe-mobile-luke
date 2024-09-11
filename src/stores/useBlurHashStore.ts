import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface BlurHashState {
  blurhashMap: Map<string, string>;
}

export interface BlurHashAction {
  get: (blurhash: string) => string | undefined;
  set: (blurhash: string, base64URL: string) => void;
  del: (blurhash: string) => boolean;
  clear: () => void;
}

export const useBlurHashStore = create(
  devtools<BlurHashState & BlurHashAction>((set, get) => ({
    blurhashMap: new Map<string, string>(),
    clear: () => set(() => ({ blurhashMap: new Map() })),
    del: (blurhash) => get().blurhashMap.delete(blurhash),
    get: (blurhash) => get().blurhashMap.get(blurhash),
    set: (blurhash, base64URL) => {
      if (get().blurhashMap.get(blurhash) !== blurhash) {
        const newBlurHashMap = new Map(get().blurhashMap);
        newBlurHashMap.set(blurhash, base64URL);
        set(() => ({ blurhashMap: newBlurHashMap }));
      }
    },
  })),
);
