import find from 'lodash/find';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import isString from 'lodash/isString';
import { forwardRef, memo } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { getImageLink } from '@utils/link';
import { SetTopBarParams } from '@utils/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { MWebHeader, MWebHeaderProps, MwebHeaderRef } from '@pui/mwebHeader';
import { QuickMenus, QuickMenusProps } from '../quickMenu';

/**
 * Quick Menu Type
 */
type QuickMenuType = QuickMenusProps['menus'];

/**
 * BrandHeader의 기본 props
 */
type BrandHeaderBaseProps = Omit<SetTopBarParams, 'commentInfo'> & Omit<MWebHeaderProps, 'utils' | 'utilsColor'>;

export interface BrandHeaderProps extends BrandHeaderBaseProps {
  /** 타이틀(브랜드명) */
  title: string;
  /** header우측 유틸 메뉴 */
  quickMenus?: QuickMenuType;
}

/**
 * setTopBar에 전달하기 위한 CommentInfo를 반환
 */
const getCommentInfo = (quickMenus: QuickMenuType): SetTopBarParams['commentInfo'] | undefined => {
  const commentInfo = find(quickMenus, (quickMenu) => !isString(quickMenu) && quickMenu.type === 'comment') as
    | Extract<QuickMenuType, { type: 'comment' }>
    | undefined;

  return commentInfo && merge({}, { count: 0 }, pick(commentInfo, ['count', 'notiTitle', 'notiDescription']));
};

/**
 * 쇼룸, 상품, 콘텐츠 페이지의 브랜드(쇼룸) 정보를 가지고있는 Header
 *
 * app => setTopBar / web => MWebHeader
 */
export const BrandHeader = memo(
  forwardRef<MwebHeaderRef, BrandHeaderProps>(
    ({ title = '', titleImagePath, showroomCode, shareInfo, quickMenus, ...props }, ref) => {
      const { isApp } = useDeviceDetect();
      const { setTopBar } = useWebInterface();

      useDeepCompareEffect(() => {
        if (isApp) {
          const commentInfo = quickMenus && getCommentInfo(quickMenus);
          setTopBar({ title, titleImagePath, showroomCode, commentInfo, shareInfo });
        }
      }, [isApp, title, titleImagePath, showroomCode, quickMenus]);

      if (isApp) {
        return null;
      }

      return (
        <MWebHeader
          ref={ref}
          title={title}
          titleImagePath={titleImagePath && getImageLink(titleImagePath)}
          utils={<QuickMenus menus={quickMenus} />}
          {...props}
        />
      );
    },
  ),
);
