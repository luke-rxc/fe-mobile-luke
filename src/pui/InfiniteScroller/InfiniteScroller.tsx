import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { Spinner } from '@pui/spinner';

export type InfiniteScrollerProps = HTMLAttributes<HTMLDivElement> & {
  /** 무한스크롤 활성여부 */
  disabled?: boolean;
  /** 스크롤시 뷰포트 교차에 대한 옵션 (IntersectionObserver 옵션) */
  infiniteOptions?: IntersectionObserverInit;
  /** 스피너를 표시 하기 위한 로딩 여부 */
  loading?: boolean;
  /** 하단 도달시 이벤트 핸들러 */
  onScrolled?: () => void;
};

const InfiniteScrollerComponent = forwardRef<HTMLDivElement, InfiniteScrollerProps>(
  ({ className, children, disabled = false, infiniteOptions, loading, onScrolled, ...props }, ref) => {
    const options = {
      rootMargin: '0px',
      ...infiniteOptions,
    };

    const [subscribe] = useInfiniteScroll<HTMLDivElement>(() => {
      if (onScrolled && disabled === false) {
        onScrolled();
      }
    }, options);

    return (
      <div ref={ref} className={className} {...props}>
        {children}
        <div ref={subscribe} className="infinite-target" />
        {loading && (
          <div className="infinite-loading">
            <Spinner size="small" />
          </div>
        )}
      </div>
    );
  },
);

/**
 * 페이지 하단에 도달시 무한 스크롤 기능을 위한 컴포넌트
 * - 콘텐츠 로드에 대한 스피너 표시 공통 제공
 */
export const InfiniteScroller = styled(InfiniteScrollerComponent)`
  .infinite-loading {
    height: 4.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .infinite-target {
    height: 0.1rem;
    margin-top: -0.1rem;
  }
`;
