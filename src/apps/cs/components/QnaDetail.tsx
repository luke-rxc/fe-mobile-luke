import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Button } from '@pui/button';
import { userAgent } from '@utils/ua';
import { GoodsSmallProps, GoodsSmall } from '@pui/goodsSmall';
import { OutgoingCallStatus, TicketStatusGroup, TicketStatusGroupLabel } from '../constants';
import { QnaComment, QnaCommentProps } from './QnaComment';

interface QnaComments extends QnaCommentProps {
  commentId: number;
}

export interface QnaDetailProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  className?: string;
  // 제목
  title: string;
  // 티켓 상태
  status: TicketStatusGroup;
  // 티켓 상태 레이블
  statusLabel: TicketStatusGroupLabel;
  // 작성일시
  relativeTime: string;
  // 상품정보
  goodsInfo?: GoodsSmallProps;
  // 코멘트
  comments: QnaComments[];
  // 유선 상담 상태
  outgoingCallStatus: OutgoingCallStatus;
  // 유선 상담 상태 변경 중 여부
  isLoadingOutgoingCallStatus?: boolean;
  // 유선 상담 신청 클릭 핸들러
  onClickOutgoingCallRequest?: () => void;
  // 유선 상담 대기 중 클릭 핸들러
  onClickOutgoingCallWaiting?: () => void;
  // 문의 추가 가능 여부
  inquiryable?: boolean;
  // 문의 추가 클릭 핸들러
  onClickAddInquiry?: () => void;
}

const QnaDetailComponent = forwardRef<HTMLDivElement, QnaDetailProps>(
  (
    {
      className,
      title,
      status,
      statusLabel,
      relativeTime,
      goodsInfo,
      comments,
      outgoingCallStatus,
      isLoadingOutgoingCallStatus = false,
      onClickOutgoingCallRequest: handleClickOutgoingCallRequest,
      onClickOutgoingCallWaiting: handleClickOutgoingCallWaiting,
      inquiryable = false,
      onClickAddInquiry: handleClickAddInquiry,
      ...props
    },
    ref,
  ) => {
    const { isApp } = userAgent();

    // 버튼 노출 여부
    const showButtons = outgoingCallStatus !== OutgoingCallStatus.NONE || inquiryable;

    return (
      <div ref={ref} className={classnames(className, { 'is-app': isApp })} {...props}>
        <article className={classnames('article', { inquiryable })}>
          {/* 상품 정보 */}
          {goodsInfo && <GoodsSmall {...goodsInfo} />}

          {/* 문의글 헤더 */}
          <header className="article-header">
            <div className="article-header-inner">
              <h1 className="title">{title}</h1>
              <div className="title-meta">
                <span className={classnames('status', { 'is-waiting': status === TicketStatusGroup.WAITING })}>
                  {statusLabel}
                </span>
                <span className="division" />
                <span className="time">{relativeTime}</span>
              </div>
            </div>
          </header>

          <div className="article-content">
            <ul className="comment-list">
              {comments.map(({ commentId, ...rest }, index) => {
                const first = index < 1;

                return (
                  <li key={commentId} className="comment-item">
                    {/* 첫번째 문의가 아닌 경우만 divider 노출 */}
                    {!first && !rest.manager && <div className="divider" />}
                    {/* 문의 및 답변 */}
                    <QnaComment hideHeader={first} {...rest} />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CTA 영역 */}
          {showButtons && (
            <div className="btn-wrapper">
              {/* 유선 상담 CTA */}
              {outgoingCallStatus !== OutgoingCallStatus.NONE && (
                <Button
                  variant="secondary"
                  size="large"
                  haptic="tapMedium"
                  block
                  bold
                  loading={isLoadingOutgoingCallStatus}
                  onClick={handleClickOutgoingCallRequest}
                  children="전화 상담 신청"
                  // * 상담 접수 완료 시 오버라이드
                  {...(outgoingCallStatus === OutgoingCallStatus.REQUESTED && {
                    // TODO: secondary selected UI 수정시 영향범위가 커질 수 있어서 primary selected로 임시 대응
                    variant: 'primary',
                    selected: true,
                    onClick: handleClickOutgoingCallWaiting,
                    children: '상담 대기 중',
                  })}
                />
              )}
              {/* 문의 추가 CTA */}
              {inquiryable && (
                <Button variant="primary" size="large" haptic="tapMedium" block bold onClick={handleClickAddInquiry}>
                  문의 추가
                </Button>
              )}
            </div>
          )}
        </article>
      </div>
    );
  },
);

export const QnaDetail = styled(QnaDetailComponent)`
  &.is-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  .article {
    display: flex;
    flex-direction: column;
    padding-bottom: 2.4rem;

    &.inquiryable {
      padding-bottom: 10.4rem;
    }

    &-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 0;
      padding: 0;

      &-inner {
        width: 100%;
        padding: 1.65rem 2.4rem;

        .title {
          font: ${({ theme }) => theme.fontType.largeB};
          color: ${({ theme }) => theme.color.black};
          margin-bottom: 0.4rem;
        }

        .title-meta {
          display: flex;
          align-items: center;
          font: ${({ theme }) => theme.fontType.mini};
          line-height: 1.4rem;
          color: ${({ theme }) => theme.color.gray50};

          .status:not(.is-waiting) {
            color: ${({ theme }) => theme.color.black};
          }

          .division {
            padding: 0 0.8rem;
          }

          .division:after {
            display: block;
            background-color: ${({ theme }) => theme.color.gray8};
            content: '';
            height: 1rem;
            width: 0.1rem;
          }
        }
      }
    }
  }

  .comment-list {
    display: flex;
    flex-direction: column;
  }

  .comment-item {
    margin-top: 2.4rem;

    &:first-child {
      margin-top: 1.2rem;
    }

    .divider {
      width: 100%;
      margin-bottom: 2.4rem;
      padding: 0 24px;

      &:after {
        display: block;
        height: 0.5px;
        background-color: ${({ theme }) => theme.color.gray8};
        content: '';
      }
    }
  }

  .btn-wrapper {
    position: fixed;
    display: flex;
    justify-content: space-between;
    gap: 0.8rem;
    width: 100%;
    padding: 2.4rem;
    ${({ theme }) => theme.mixin.safeArea('bottom')};

    z-index: 1;
  }
`;
