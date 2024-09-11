import React, { useEffect } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoadingStore } from '@stores/useLoadingStore';
import { useContentListService } from '../services';
import { ContentInfiniteList, ContentListError } from '../components';
import { ContentListMessage } from '../constants';

interface Props {
  showroomId: string;
}

export const ContentListContainer: React.FC<Props> = ({ showroomId }) => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const {
    contentsList: contentsInfiniteData,
    contentsListError,
    isContentListError,
    isContentListLoading,
    isContentListFetching,
    hasMoreContentList,
    handleLoadContentList,
  } = useContentListService({
    showroomId: +showroomId,
    enabled: true,
  });

  useHeaderDispatch({
    type: 'mweb',
    enabled: !isContentListLoading,
    title: 'Content',
    quickMenus: ['cart', 'menu'],
  });

  /**
   * 로딩바 처리
   */
  useEffect(() => {
    if (isContentListLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentListLoading]);

  /** Loading 처리 */
  if (isContentListLoading) {
    return null;
  }

  const contentsList = contentsInfiniteData?.pages || [];

  /** Rendering: error */
  if (isContentListError || !contentsInfiniteData) {
    return <ContentListError data={contentsListError?.data} />;
  }

  /** Rendering: List nothing */
  if (contentsList.length === 0) {
    return <ContentListError customMessage={ContentListMessage.ERROR_NOTHING_LIST} />;
  }

  return (
    <>
      <ContentInfiniteList
        contentsList={contentsList}
        hasMoreContentList={hasMoreContentList}
        isContentListFetching={isContentListFetching}
        onLoadContentList={handleLoadContentList}
      />
    </>
  );
};
