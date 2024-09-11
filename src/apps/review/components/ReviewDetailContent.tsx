import { forwardRef, useCallback, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { Option } from '@pui/icon';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { toDateFormat } from '@utils/date';
import nl2br from '@utils/nl2br';
import type { ReviewDetailItemContentModel } from '../models';
import { DropDown } from './DropDown';

/**
 * 리뷰 텍스트 영역
 */
export type ReviewDetailContentProps = HTMLAttributes<HTMLDivElement> & {
  review: ReviewDetailItemContentModel;
  /** 모달 내 리뷰 텍스트인지 여부 */
  modalType?: boolean;
  /** 더보기 - 신고하기 */
  onReportReview?: () => void;
};
const ReviewDetailContentComponent = forwardRef<HTMLDivElement, ReviewDetailContentProps>(
  ({ className, review, modalType = false, onReportReview }, ref) => {
    const { isApp } = useDeviceDetect();
    const { contents, userProfileImage, userNickname, createdDate, options, isMine, isReported } = review;
    const isShowMore = !isApp && !isMine && !isReported;
    const profileProps: ProfilesProps = {
      showroomCode: '',
      liveId: null,
      image: {
        src: userProfileImage.path,
        lazy: true,
      },
      size: 40,
      status: 'none',
      disabledLink: true,
    };

    const [isMask, setIsMask] = useState(false);
    const [isShowOption, setIsShowOption] = useState<boolean>(false);

    const handleShowOption = useCallback((e) => {
      e.stopPropagation();
      setIsShowOption(true);
    }, []);

    /** 리뷰 신고하기 */
    const handleReportComment = async () => {
      setIsShowOption(false);
      onReportReview?.();
    };

    const textRef = useCallback((el) => {
      if (!el) return;
      if (el.offsetHeight > 50) {
        // 모달 타입 - 3줄 부터 마스크 처리
        setIsMask(true);
      }
    }, []);

    return (
      <div
        ref={ref}
        className={classNames(className, {
          'is-modal': modalType,
        })}
      >
        <div className="review-user">
          <div className="user-profile">
            <Profiles {...profileProps} />
          </div>
          <div className="user-info">
            <p className="name">{userNickname}</p>
            <p className="date">{toDateFormat(createdDate, 'yyyy. M. d')}</p>
          </div>
          {isShowMore && (
            <Action is="button" className="btn-more" onClick={handleShowOption}>
              <Option color="gray50" className="more-option" />
            </Action>
          )}
        </div>
        <div className="content">
          {!!options.itemList.length && (
            <div className="options-text">
              옵션 :
              {options.itemList.map((option) => {
                return (
                  <span className="option" key={option.value}>
                    {option.value}
                  </span>
                );
              })}
            </div>
          )}
          <div
            className={classNames('review-text', {
              'is-mask ': modalType && isMask,
            })}
          >
            <div className="inner" ref={textRef}>
              {nl2br(contents)}
            </div>
          </div>
          {isShowOption && (
            <div className="drop-options">
              <DropDown
                menus={[
                  {
                    label: <span className="report">신고</span>,
                    action: handleReportComment,
                  },
                ]}
                onClose={() => setIsShowOption(false)}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

export const ReviewDetailContent = styled(ReviewDetailContentComponent)`
  position: relative;

  & .review-user {
    display: flex;
    align-items: center;
    padding: 1.6rem 1.6rem 0 1.6rem;

    & .user-profile {
      flex-basis: 0.4rem;
    }

    & .user-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: start;
      justify-content: center;

      & .name {
        color: ${({ theme }) => theme.color.text.textPrimary};
        font: ${({ theme }) => theme.fontType.mini};
      }

      & .date {
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.micro};
      }
    }

    ${Action} {
      &.btn-more {
        width: 4rem;
        height: 4rem;
      }
    }
  }

  & .content {
    padding: 0.8rem 2.4rem;

    & .options-text {
      margin-bottom: 0.8rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};

      & .option {
        &:not(:first-of-type)::before {
          display: inline-block;
          width: 0.1rem;
          height: 1.2rem;
          margin: ${({ theme }) => `${theme.spacing.s2} ${theme.spacing.s8} 0`};
          background: ${({ theme }) => theme.color.backgroundLayout.line};
          vertical-align: top;
          content: '';
        }

        &:first-of-type {
          margin-left: ${({ theme }) => theme.spacing.s8};
        }
      }
    }

    & .review-text {
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.medium};
      text-size-adjust: none;
    }
  }

  & .drop-options {
    position: absolute;
    top: -5rem;
    right: 0.8rem;
    width: 25rem;

    ${DropDown} {
      & .report {
        color: ${({ theme }) => theme.color.red};
      }
    }
  }

  &.is-modal {
    & .review-text {
      overflow: hidden;
      position: relative;
      max-height: 4.8rem;

      &.is-mask {
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1) calc(100% - 1.6rem), transparent 100%);
      }
    }
  }
`;
