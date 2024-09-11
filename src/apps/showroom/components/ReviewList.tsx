import styled from 'styled-components';
import { useRef, useMemo, useEffect } from 'react';
import { ReviewListType } from '@features/review/constants';
import { toReviewListLink } from '@features/review/utils';
import { List, ListProps } from '@pui/list';
import { ButtonText } from '@pui/buttonText';
import { TitleSection } from '@pui/titleSection';
import { ReviewCard, ReviewCardProps } from '@pui/reviewCard';
import { getColor } from '../utils';

export interface ReviewListProps {
  reviews: ReviewCardProps[];
  sectionLinkId?: number | null;
  className?: string;
  onClickReviewLink?: (reviewId: string) => void;
  onInViewSection?: () => void;
  onClickSectionLink?: () => void;
}

const ReviewListComponent: React.FC<ReviewListProps> = ({
  reviews,
  sectionLinkId,
  className,
  onClickReviewLink,
  onInViewSection,
  onClickSectionLink,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * Review item Map Key 생성함수
   */
  const createReviewMapKey: ListProps<ReviewCardProps>['getKey'] = (item, index) => `${item.id || index}`;

  /**
   * Review item에 전달할 이벤트핸들러 생성 함수
   */
  const createReiveHandlers: ListProps<ReviewCardProps>['getHandlers'] = (item) => ({
    onClick: () => onClickReviewLink?.(item.id || ''),
  });

  const sectionLink = sectionLinkId ? toReviewListLink(ReviewListType.SHOWROOM, { id: sectionLinkId }) : '';

  /**
   * 더보기 버튼 컴포넌트
   */
  const moreLink = useMemo(
    () => sectionLinkId && <ButtonText is="a" link={sectionLink} onClick={onClickSectionLink} children="더보기" />,
    [sectionLinkId, onClickSectionLink, sectionLink],
  );

  /**
   * Intersection Observer 구독/해제
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (rootRef.current && onInViewSection) {
      observer = new IntersectionObserver(
        ([entry], _observer) => {
          if (entry.isIntersecting) {
            onInViewSection();
            _observer.disconnect();
          }
        },
        { threshold: 0.8 },
      );
      observer.observe(rootRef.current);
    }

    return () => observer && observer.disconnect();
  }, [onInViewSection]);

  return (
    <div ref={rootRef} className={className}>
      <TitleSection title="리뷰" suffix={moreLink} />
      <List source={reviews} component={ReviewCard} getKey={createReviewMapKey} getHandlers={createReiveHandlers} />
    </div>
  );
};

/**
 * 리뷰 섹션피드
 */
export const ReviewList = styled(ReviewListComponent)`
  padding-bottom: 3.2rem;

  ${TitleSection} {
    .title {
      color: ${getColor('contentColor')};
    }

    .subtitle {
      color: ${getColor('contentColor')};
      opacity: 0.5;
    }

    ${ButtonText} {
      color: ${getColor('sectionMoreTextColor')};

      &:active {
        background: ${getColor('sectionMorePressedColor')};
      }
    }
  }

  ${List} {
    display: flex;
    gap: ${({ theme }) => theme.spacing.s16};
    padding: 0 ${({ theme }) => theme.spacing.s24};
    overflow: hidden;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }

  ${ReviewCard} {
    flex-shrink: 0;
  }
`;
