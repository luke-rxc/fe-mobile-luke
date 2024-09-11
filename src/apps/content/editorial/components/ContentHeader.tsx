import { useMemo } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { HeaderState } from '@features/landmark/types/header';
import type { HeaderModel } from '../models';

type ContentHeaderProps = HeaderModel;
type QuickMenus = Extract<HeaderState, { type: 'brand' }>['quickMenus'];

export const ContentHeader = ({
  title = '',
  titleImagePath = '',
  showroomCode,
  transitionTrigger,
  link,
  commentInfo,
  ...props
}: ContentHeaderProps) => {
  const quickMenus = useMemo<QuickMenus>(() => {
    return commentInfo ? [{ type: 'comment', ...commentInfo }, 'cart', 'menu'] : ['cart', 'menu'];
  }, [commentInfo]);

  useHeaderDispatch({
    type: 'brand',
    overlay: true,
    enabled: true,
    link,
    title,
    titleImagePath: titleImagePath || undefined,
    transitionTrigger,
    quickMenus,
    showroomCode,
    onClickTitle: props.onClickTitle,
  });

  return null;
};
