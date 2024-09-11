import { useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { linkURL } from '@utils/path';

export const useCopyPath = (): ((path: string) => void) => {
  const copyToClipboard = useCallback((path: string, msg = '링크가 복사되었습니다.') => {
    const url = linkURL(path);
    copy(url);
    alert(msg);
  }, []);
  return copyToClipboard;
};
