/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Spinner } from '@pui/spinner';

export interface FeedLoadIndicatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * LoadIndicator component
 */
export const LoadIndicator = styled(({ hasMore, onLoadMore, ...props }: FeedLoadIndicatorProps) => {
  const indicator = useRef<HTMLDivElement>(null);
  const [loading, setLoadState] = useState<boolean>(false);

  /**
   * 화면에 노출/미노출 상태 변경에 따른 spinner show/hide 및 onLoadMore 호출
   */
  const handleIntersect = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && hasMore) {
      setLoadState(true);
      setTimeout(() => onLoadMore?.(), 0);
    } else {
      setLoadState(false);
    }
  };

  /**
   * IntersectionObserver 세팅
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (indicator.current && hasMore) {
      observer = new IntersectionObserver(handleIntersect);
      observer.observe(indicator.current);
    } else {
      setLoadState(false);
    }

    return () => observer && observer.disconnect();
  }, [hasMore]);

  return (
    <div ref={indicator} {...props}>
      {loading && hasMore && <Spinner size="small" />}
    </div>
  );
})`
  ${({ theme }) => theme.mixin.centerItem()};
`;
