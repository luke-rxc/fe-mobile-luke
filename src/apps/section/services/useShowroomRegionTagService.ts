import { useEffect, useRef, useState } from 'react';
import { useUnmount } from 'react-use';
import isEmpty from 'lodash/isEmpty';
import { useModal } from '@hooks/useModal';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { createDebug } from '@utils/debug';
import { getShowroomTagFilter } from '../apis';
import { ShowroomRegionQueryKey } from '../constants';
import { useRegionEventListeners } from '../hooks';
import { toRegionTagFilter } from '../models';
import { useRegionStore } from '../stores';
import { useShowroomRegionLog } from './logs';

type RegionFilterInitialDataTypes = {
  rootPlace: string;
  tagFilter?: number[];
};

const debug = createDebug();

export const useShowroomRegionTagService = (showroomId: number) => {
  const tagRef = useRef<Map<number, string>>(new Map());
  const [initialData, setInitialData] = useState<RegionFilterInitialDataTypes | null>(null);

  const disableClearButton = useRegionStore((state) => state.disableClearButton);
  const enableClearButton = useRegionStore((state) => state.enableClearButton);

  const { closeModal } = useModal();
  const { initialValues, toolbarButtonTappedValue, setToolbarButton, close } = useWebInterface();
  const { logTabTagFilterReset, logCompleteTagFilter, logViewTagFilter } = useShowroomRegionLog();

  // 태그 필터 조회
  const { data, error, isError, isLoading, isFetching, isFetched, isSuccess } = useQuery(
    [
      ShowroomRegionQueryKey.ALL,
      ShowroomRegionQueryKey.ROOM_FILTER_TAG,
      { showroomId, rootPlace: initialData?.rootPlace ?? '' },
    ],
    () => getShowroomTagFilter({ showroomId, rootPlace: initialData?.rootPlace ?? '' }),
    {
      select: (response) => toRegionTagFilter(response, initialData?.tagFilter),
      enabled: !!initialData,
      cacheTime: 0,
    },
  );

  // 태그 초기화 핸들러
  const handleClearTags = () => {
    // 초기화 이벤트 로깅
    logTabTagFilterReset();

    // 태그 정보 초기화
    tagRef.current.clear();

    // 태그 버튼 초기화 dispatch
    window.dispatchEvent(new CustomEvent('prizm:region:filter:clear'));

    // 초기화 버튼 disabled
    disableClearButton();
    setToolbarButton({ type: 'clear', isEnabled: false });
  };

  // 완료 버튼 클릭 이벤트
  const handleClickComplete = () => {
    const response = {
      rootPlace: initialData?.rootPlace,
      ...(tagRef.current.size && { tagFilter: Array.from(tagRef.current.keys()) }),
    };

    logCompleteTagFilter({ id: Array.from(tagRef.current.keys()), name: Array.from(tagRef.current.values()) });

    close(response, { doWeb: () => closeModal('', response) });
  };

  // 태그 클릭 이벤트 리스너
  useRegionEventListeners('prizm:region:filter:click', (event) => {
    const { selected, id, name } = event.detail;

    if (selected) {
      tagRef.current.set(id, name);

      if (tagRef.current.size === 1) {
        enableClearButton();
        setToolbarButton({ type: 'clear', isEnabled: true });
      }
    } else {
      tagRef.current.delete(id);

      if (tagRef.current.size === 0) {
        disableClearButton();
        setToolbarButton({ type: 'clear', isEnabled: false });
      }
    }

    debug.log('Filter click', event.detail, tagRef.current);
  });

  useEffect(() => {
    if (isEmpty(initialValues)) return;

    const { rootPlace, tagFilter } = initialValues as RegionFilterInitialDataTypes;

    setInitialData({ rootPlace, ...(Array.isArray(tagFilter) && { tagFilter: [...tagFilter] }) });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    if (data?.sanitizeTags) {
      // 유효한 태그 기준으로 초기화
      tagRef.current = new Map(data.sanitizeTags);

      tagRef.current.size && enableClearButton();
      tagRef.current.size && setToolbarButton({ type: 'clear', isEnabled: true });

      logViewTagFilter({ id: Array.from(tagRef.current.keys()), name: Array.from(tagRef.current.values()) });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.sanitizeTags]);

  useEffect(() => {
    toolbarButtonTappedValue?.type === 'clear' && handleClearTags();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbarButtonTappedValue]);

  // UnMount 시 초기화 버튼 비활성화
  useUnmount(() => disableClearButton());

  return {
    data,
    error,
    isError,
    isLoading: !initialData || isLoading,
    isFetching,
    isFetched,
    isSuccess,
    handleClearTags,
    handleClickComplete,
  };
};
