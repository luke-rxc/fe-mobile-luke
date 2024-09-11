import { useCallback } from 'react';
import { useBlurHashStore } from '@stores/useBlurHashStore';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { getBlurHashBase64WithAsync, DecodeOptions } from '@utils/blurHash';

export const useBlurHash = () => {
  const { isApp } = useDeviceDetect();
  const get = useBlurHashStore((state) => state.get);
  const set = useBlurHashStore((state) => state.set);
  const clear = useBlurHashStore((state) => state.clear);

  const getBlurHashBase64URL = useCallback(
    async ({ blurHash, ...rest }: DecodeOptions) => {
      let base64URL = get(blurHash);

      if (base64URL) {
        return base64URL;
      }

      base64URL = await getBlurHashBase64WithAsync({ blurHash, ...rest });
      !isApp && set(blurHash, base64URL);

      return base64URL;
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isApp],
  );

  return { getBlurHashBase64URL, clear };
};
