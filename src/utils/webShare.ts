import copy from 'copy-to-clipboard';

type WebShareReturnValues = {
  type: 'share' | 'clipboard';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
};

export type WebShareOptionParams = {
  /** 공유할 URL */
  url: string;
  /**
   * Share API 이용시 Props
   * @description
   * - IOS : 공유 레이어 타이틀은 title prop이 노출
   * - Android : 공유 레이어 타이틀은 text prop이 노출
   */
  share?: {
    /** 공유 타이틀 */
    title?: string;
    /** 공유 설명 */
    text?: string;
  };
  /** 공유 성공(=Clipboard 복사성공)시 콜백 */
  onSuccess?: ({ type }: WebShareReturnValues) => void;
  /** 공유 실패(=Clipboard 복사실패)시 콜백 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: ({ type, error }: WebShareReturnValues) => void;
};

export const webShare = async (options: WebShareOptionParams) => {
  const { url, share, onSuccess, onError } = options;
  const { title, text } = share ?? {};

  if (!navigator.share) {
    if (copy(url)) {
      onSuccess?.({ type: 'clipboard' });
    } else {
      onError?.({ type: 'clipboard' });
    }
    return;
  }

  try {
    await navigator.share({ title, text, url });
    onSuccess?.({ type: 'share' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    onError?.({ type: 'share', error: e });
  }
};
