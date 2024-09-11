import { useState, useEffect } from 'react';
import { LiveDealBannerStatus, ActionButtonType } from '../constants';

interface Props {
  activeViewType: ActionButtonType | undefined;
  inputFocused: boolean;
}

/**
 * Deal banner status hook
 */
export const useDealBannerStatus = ({ activeViewType, inputFocused }: Props) => {
  const [status, setStatus] = useState<LiveDealBannerStatus>(LiveDealBannerStatus.DEFAULT);

  useEffect(() => {
    if (!activeViewType) {
      return;
    }

    if (activeViewType === ActionButtonType.EMPTY) {
      setStatus(LiveDealBannerStatus.IN);
      return;
    }

    if (inputFocused) {
      setStatus(LiveDealBannerStatus.HIDE);
      return;
    }

    if (status === LiveDealBannerStatus.HIDE) {
      setStatus(LiveDealBannerStatus.HIDE_OUT);
    } else if (status !== LiveDealBannerStatus.HIDE_OUT) {
      setStatus(LiveDealBannerStatus.OUT);
    }
  }, [activeViewType, inputFocused, status]);

  return { status };
};
