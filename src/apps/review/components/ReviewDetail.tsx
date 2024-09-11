import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { WebHeaderHeight } from '@constants/ui';
import { PageError } from '@features/exception/components';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useDialog } from '@hooks/useDialog';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { Divider } from '@pui/divider';
import { signinCompleted } from '@utils/webInterface';
import type { ReviewDetailModel } from '../models';
import { useIntersectionService, useLogService } from '../services';
import { ReviewDetailGoods } from './ReviewDetailGoods';
import { ReviewDetailReport } from './ReviewDetailReport';
import { ReviewDetailContent } from './ReviewDetailContent';
import { ReviewDetailMedia } from './ReviewDetailMedia';
import { ReviewDetailFloating } from './ReviewDetailFloating';

export type ReviewDetailItemProps = HTMLAttributes<HTMLDivElement> & {
  /** 리뷰 데이터 */
  review: ReviewDetailModel;
  /** 리뷰 데이터 재호출 */
  onReloadReview: () => void;
};
const ReviewDetailComponent = forwardRef<HTMLDivElement, ReviewDetailItemProps>(
  ({ className, review, onReloadReview }, ref) => {
    const { isLogin } = useAuth();
    const { openModal } = useModal();
    const { showToastMessage, setTopBar, signIn } = useWebInterface();
    const { openDialog } = useDialog();
    const { isApp } = useDeviceDetect();
    const { logViewReviewDetail, logSwipeReviewDetail } = useLogService();
    const { sectionRef: boundaryRef, inView: boundaryInView } = useIntersectionService({ once: true });

    const { content, goods } = review;
    const { mediaList, isMine, isReported } = content;
    const [isExistModal, setIsExistModal] = useState(true); // 모달 생성 여부
    const isBlockingReview = !isMine && isReported;
    const textElRef = useRef<HTMLDivElement | null>(null);
    const textRef = useCallback((el) => {
      if (!el || textElRef.current) return;
      textElRef.current = el;
      // 리뷰 텍스트 영역이 뷰포트내 노출 되지 않을 경우 모달로 노출
      setIsExistModal(el.offsetTop > window.innerHeight);
    }, []);

    const logParams = useMemo(() => {
      return {
        goodsId: goods.id,
        goodsName: goods.name,
        reviewId: content.id,
        optionId: goods.options?.id ?? null,
        optionName:
          goods.options?.itemList && goods.options.itemList.length > 0
            ? goods.options.itemList.map((item) => item.value).join(',')
            : '',
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { initializeValues } = useWebInterface();
    const topBarHeight = useRef(WebHeaderHeight); // 탑 영역 사이즈
    const sectionElRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useCallback((el) => {
      if (!el) return;
      sectionElRef.current = el;
    }, []);

    /**
     * 신고하기
     */
    const handleReportReview = async () => {
      if (isLogin) {
        openModal({
          disableScroll: true,
          render: ({ onClose: handleCloseModal }) => (
            <ReviewDetailReport
              reviewId={content.id}
              onCancel={handleCloseModal}
              onConfirm={({ isSuccess, message }: { isSuccess: boolean; message: string }) => {
                handleCloseModal();
                if (!isSuccess) {
                  openDialog({
                    title: message,
                    confirm: {
                      label: '확인',
                    },
                  });
                } else {
                  showToastMessage({ message: message ?? '신고되었습니다' });
                }
              }}
            />
          ),
          fadeTime: 0.2,
          timeout: 0.25,
          nonInnerBg: true,
        });

        return;
      }

      const isSignIn = await signIn();
      if (isSignIn) {
        onReloadReview();
      }
    };

    /**
     * 스낵바 모달 클릭시 리뷰 텍스트 영역으로 이동
     */
    const handleReviewModalClick = (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!textElRef.current) return;
      const targetY = textElRef.current.offsetTop;
      window.scrollTo({
        top: targetY,
        left: 0,
        behavior: 'smooth',
      });
    };

    useEffect(() => {
      logViewReviewDetail(logParams);

      if (!isApp) return;
      // 로그인 완료시 리뷰 데이터 갱신
      signinCompleted().then(() => {
        onReloadReview();
      });

      const isShowMoreTopBtn = !content.isMine && !content.isReported; // 신고가 가능한 상태인 경우, 앱 상단 리뷰 더보기 버튼 노출
      const option = {
        title: '',
        ...(isShowMoreTopBtn && {
          reviewInfo: {
            reviewId: content.id,
          },
        }),
      };
      setTopBar(option);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (boundaryInView) {
        logSwipeReviewDetail(logParams);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boundaryInView]);

    useLayoutEffect(() => {
      if (!isApp) return;
      if (initializeValues && initializeValues.topInset) {
        topBarHeight.current = initializeValues.topInset;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initializeValues]);

    return (
      <div
        ref={ref}
        className={classNames(className, {
          'is-reported': isReported,
        })}
      >
        {isBlockingReview && <PageError className="reported" isFull defaultMessage="신고된 콘텐츠 입니다" />}
        {!isBlockingReview && (
          <div ref={sectionRef}>
            <div className="media-section">
              {!!mediaList.length &&
                mediaList.map((media) => {
                  return <ReviewDetailMedia key={media.id} media={media} className="media-box" />;
                })}
            </div>
            <div className="text-section" ref={textRef}>
              <ReviewDetailContent review={content} onReportReview={handleReportReview} />
              <Divider />
              <ReviewDetailGoods id={content.id} goods={goods} />
            </div>
            {isExistModal && (
              <ReviewDetailFloating
                review={review}
                onClickContent={handleReviewModalClick}
                onReportReview={handleReportReview}
              />
            )}
            <div ref={boundaryRef} className="boundary" />
          </div>
        )}
      </div>
    );
  },
);

export const ReviewDetail = styled(ReviewDetailComponent)`
  position: relative;

  &.is-reported {
    position: static;

    & .reported {
      height: 100vh !important;
    }
  }

  & .media-box {
    overflow: hidden;
    position: relative;
    width: 100%;
    margin-top: 0.1rem;

    &:first-child {
      margin-top: 0;
    }
  }

  & .text-section {
    ${({ theme }) => theme.mixin.safeArea('padding-bottom', 64)};

    ${Divider} {
      margin: 0.8rem 0;
    }
  }

  & .boundary {
    height: 1px;
  }
`;
