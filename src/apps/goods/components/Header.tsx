import React from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { getWebLink } from '@utils/link';
import { WebLinkTypes } from '@constants/link';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { HeaderModel } from '../models';

type HeaderProps = HeaderModel & {
  goodsImagePath?: string;
  onClickTitle?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  titleImagePath,
  showroomCode,
  transitionTrigger,
  goodsImagePath,
  onClickTitle: handleClickTitle,
}) => {
  const { isApp } = useDeviceDetect();
  const webHref = !isApp && showroomCode ? getWebLink(WebLinkTypes.SHOWROOM, { showroomCode }) : undefined;

  useHeaderDispatch({
    type: 'brand',
    overlay: true,
    enabled: true,
    title: title || '',
    titleImagePath,
    shareInfo: { type: 'referrals' },
    transitionTrigger,
    link: webHref,
    showroomCode,
    transitionOffset: ['end', 'start'],
    quickMenus: [{ type: 'cart', imagePath: goodsImagePath }, 'menu'],
    onClickTitle: handleClickTitle,
  });

  return null;
};
