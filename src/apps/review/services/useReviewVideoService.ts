import { useCallback, useRef, useState } from 'react';
import remove from 'lodash/remove';
import sample from 'lodash/sample';
import { isUndefined } from 'lodash';

export const useVideoListService = () => {
  const timeId = useRef<NodeJS.Timeout | null>(null);
  const currentReviewVideoId = useRef<number>(-1);
  const [activeReviewVideoId, setActiveReviewVideoId] = useState(-1);
  const inViewList = useRef<number[]>([]); // 뷰포트내에 노출 되고 있는 리뷰 id
  const handleVideoInView = (reviewId: number, inView: boolean) => {
    if (timeId.current) {
      clearTimeout(timeId.current);
    }
    const list = inViewList.current;
    if (inView) {
      const hasList = list.includes(reviewId);
      if (!hasList) {
        list.push(reviewId);
      }
    } else {
      remove(list, (n) => n === reviewId);
    }

    if (!list.length) {
      currentReviewVideoId.current = -1;
      setActiveReviewVideoId(-1);
    }

    timeId.current = setTimeout(handleRandomId, 400);
  };

  /**
   * 뷰포트 내 인입된 리뷰 중 랜덤 추출
   */
  const handleRandomId = useCallback(() => {
    const currentReviewVideoIdValue = currentReviewVideoId.current;
    const currentInViewList = inViewList.current;
    const hasVideoId = currentInViewList.includes(currentReviewVideoIdValue);
    if (hasVideoId) return; // 그대로 유지

    const random = sample(currentInViewList);
    if (isUndefined(random)) return;
    currentReviewVideoId.current = random;
    setActiveReviewVideoId(random);
  }, []);

  return {
    activeReviewVideoId,
    handleVideoInView,
  };
};
