import { useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';
import { useElementSize } from './useElementSize';
import { ActionButtonType } from '../constants';

interface Props {
  viewType: ActionButtonType;
  activeViewType: ActionButtonType | undefined;
}

/**
 * 가상 list hook
 */
export const useVirtualList = ({ viewType, activeViewType }: Props) => {
  // list area ref
  const listAreaRef = useRef<HTMLDivElement>(null);
  // list ref
  const listRef = useRef<VariableSizeList>(null);
  // scroll position ref
  const scrollRef = useRef<{ currentIndex: number; total: number }>({ currentIndex: 0, total: 0 });
  // list area width, height
  const [listAreaWidth, listAreaHeight] = useElementSize(listAreaRef, !!activeViewType);
  // list item size map array
  const sizeMap = useRef<Array<number>>([]);

  const [isMessageScrollTop, setIsMessageScrollTop] = useState<boolean>(false);
  const [isMessageScrollBottom, setIsMessageScrollBottom] = useState<boolean>(true);

  /**
   * message ref update
   */
  const updateMessageScrollRef = (currentIndex: number, total: number) => {
    scrollRef.current.currentIndex = currentIndex;
    scrollRef.current.total = total;
  };

  /**
   * 메세지창 스크롤 최하단 이동
   */
  const toMessageScrollBottom = (messageLength?: number) => {
    if (listRef?.current) {
      listRef.current.scrollToItem(messageLength ?? scrollRef.current.total, 'end');
    }
  };

  /**
   * list item 높이 설정
   */
  const setListItemHeight = (index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      const items = Object.assign([], sizeMap.current) as Array<number>;
      items[index] = size;
      sizeMap.current = items;
      listRef.current?.resetAfterIndex(index);
    }
  };

  /**
   * list item 높이 조회
   */
  const getListItemHeight = (index: number) => {
    return viewType === ActionButtonType.AUCTION ? 44 : sizeMap.current[index] + 4 || 87;
  };

  /**
   * list sizemap 초기화
   */
  const clearListSizeMap = () => {
    sizeMap.current = [];
  };

  /**
   * list total height 조회
   */
  const getListTotalHeight = () => {
    return (sizeMap?.current || []).reduce((target, itemHeight) => {
      return target + itemHeight;
    }, 0);
  };

  /**
   * list scroll event
   */
  const onScroll = (
    scrollOffset: number,
    scrollUpdateWasRequested: boolean,
    outerRef: React.RefObject<HTMLElement>,
  ) => {
    if (scrollUpdateWasRequested === false) {
      setIsMessageScrollTop((prev) => {
        if (prev) {
          return false;
        }

        return prev;
      });

      setIsMessageScrollBottom((prev) => {
        if (prev) {
          return false;
        }

        return prev;
      });
    }

    if (!outerRef.current) {
      return;
    }

    if (scrollOffset === 0) {
      setIsMessageScrollTop((prev) => {
        if (!prev) {
          return true;
        }

        return prev;
      });
    } else if (scrollOffset + outerRef.current.offsetHeight === outerRef.current.scrollHeight) {
      setIsMessageScrollBottom((prev) => {
        if (!prev) {
          return true;
        }

        return prev;
      });
    }
  };

  /**
   * message scroll 변수 초기화
   */
  const resetMessageScroll = () => {
    setIsMessageScrollTop((prev) => {
      if (prev) {
        return false;
      }

      return prev;
    });
    setIsMessageScrollBottom((prev) => {
      if (!prev) {
        return true;
      }

      return prev;
    });
  };

  return {
    listAreaRef,
    listRef,
    scrollRef,
    listAreaWidth,
    listAreaHeight,
    sizeMap,
    updateMessageScrollRef,
    toMessageScrollBottom,
    setListItemHeight,
    getListItemHeight,
    getListTotalHeight,
    clearListSizeMap,
    isMessageScrollTop,
    isMessageScrollBottom,
    onScroll,
    resetMessageScroll,
  };
};
