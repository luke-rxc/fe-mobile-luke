import { useMemo } from 'react';
import { UniversalLinkTypes } from '@constants/link';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { HeaderState } from '@features/landmark/types/header';
import { useLink } from '@hooks/useLink';
import { PresetType } from '../constants';
import type { ContentStoryModel, ReplyDisplayModel } from '../models';
import { useLogService } from '../services';
import { getPresetVisible } from '../utils';

type QuickMenus = Extract<HeaderState, { type: 'brand' }>['quickMenus'];
type ContentHeaderProps = {
  /** 콘텐츠 value */
  content: ContentStoryModel;
  /** 댓글 아이콘 클릭 콜백 */
  onClickReply: () => void;
};

export const ContentHeader = ({ content, onClickReply }: ContentHeaderProps) => {
  const { code, componentList, replyCount, showroom } = content;
  const { name, code: showroomCode, brand } = showroom;
  const { getLink } = useLink();
  const { logShowroomTab } = useLogService();

  const quickMenus = useMemo<QuickMenus>(() => {
    let commentInfo: {
      count: number;
      notiTitle: string;
      notiDescription: string;
      onClickReply: () => void;
    } | null = null;
    const replyComp = componentList.find((preset) => preset.componentType === PresetType.REPLY);

    if (replyComp && getPresetVisible(replyComp, content.dateTime)) {
      const displayData: ReplyDisplayModel = JSON.parse(replyComp.contents);
      const { noticeTitle, noticeSubTitle } = displayData;

      commentInfo = {
        count: replyCount,
        notiTitle: noticeTitle?.text ?? '',
        notiDescription: noticeSubTitle.text ?? '',
        onClickReply,
      };
    }

    return commentInfo ? [{ type: 'comment', ...commentInfo }, 'cart', 'menu'] : ['cart', 'menu'];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 헤더 탑바 쇼룸 클릭
   */
  const handleLinkShowroom = () => {
    logShowroomTab({
      contentCode: code,
      showroomCode,
    });
  };

  useHeaderDispatch({
    type: 'brand',
    overlay: true,
    enabled: true,
    link: getLink(UniversalLinkTypes.SHOWROOM, { showroomCode }),
    title: name || '',
    titleImagePath: brand?.primaryImage?.path || undefined,
    quickMenus,
    showroomCode,
    onClickTitle: handleLinkShowroom,
  });

  return null;
};
