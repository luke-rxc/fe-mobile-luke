import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { formatToAmount } from '@utils/string';
import { getImageLink } from '@utils/link';
import type { ContentInfoModel, VoteDisplayButtonModel, VoteItemModel } from '../../../models';
import { usePresetVoteItemService } from '../../../services';

type VoteItemProps = HTMLAttributes<HTMLDivElement> & {
  /** 투표 id */
  voteId: number;
  /** 투표 항목 */
  vote: VoteItemModel;
  /** 버튼 활성 상태 */
  active: boolean;
  /** 텍스트 컬러 */
  color: string;
  /** 버튼 컬러 */
  button: VoteDisplayButtonModel;
  /** 컨텐츠 정보 */
  contentInfo: ContentInfoModel;
  /** 투표상태 업데이트 */
  onVoteUpdate: (remainVote: number, item?: { id: number; voteCount: number }) => void;
  /** 투표 소진완료시 */
  onVoteFinish: (isShared: boolean) => void;
};
const VoteItemComponent = forwardRef<HTMLDivElement, VoteItemProps>(
  ({ className, voteId, vote, active, contentInfo, onVoteUpdate, onVoteFinish }, ref) => {
    const { id, name, voteCount, primaryImage } = vote;
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const thumbImageRef = useRef<HTMLDivElement | null>(null);

    const onVoteSuccess = useCallback(() => {
      if (!thumbRef.current) return;
      handleAddScaleAnimation();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { handleTapVote } = usePresetVoteItemService({
      voteId,
      vote,
      contentInfo,
      onVoteUpdate,
      onVoteFinish,
      onVoteSuccess,
    });
    const handleImageLoad = useCallback(() => {
      if (thumbRef.current) {
        window.removeEventListener('resize', handleSetThumbViewHeight);
        thumbRef.current.style.height = '';
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetThumbViewHeight = useCallback(() => {
      const thumbEl = thumbRef.current;
      if (thumbEl) {
        thumbEl.style.height = `${thumbEl.offsetWidth / 10}rem`;
      }
    }, []);

    const handleAddScaleAnimation = useCallback(() => {
      if (thumbRef.current) {
        handleRemoveScaleAnimation();
        thumbRef.current.classList.add('is-animation');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRemoveScaleAnimation = useCallback(() => {
      if (thumbRef.current) {
        thumbRef.current.classList.remove('is-animation');
      }
    }, []);

    useEffect(() => {
      const thumbImg = thumbImageRef.current;
      window.addEventListener('resize', handleSetThumbViewHeight);
      if (thumbImg) {
        thumbImg.addEventListener('animationend', handleRemoveScaleAnimation);
      }
      return () => {
        window.removeEventListener('resize', handleSetThumbViewHeight);
        if (thumbImg) {
          thumbImg.removeEventListener('animationend', handleRemoveScaleAnimation);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
      handleSetThumbViewHeight();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={ref} className={className}>
        <div className="item-thumb">
          <div ref={thumbRef} className="thumb-inner">
            <span ref={thumbImageRef} className="image-wrapper">
              <Image
                src={getImageLink(primaryImage.path, 1080)}
                blurHash={primaryImage.blurHash}
                lazy
                onLoad={handleImageLoad}
              />
            </span>
          </div>
        </div>
        <div className="item-info">
          <div className="item-title">{name}</div>
          <div className="item-count">{formatToAmount(voteCount)}</div>
          <div className="btn-box">
            <Button variant="primary" size="bubble" bold disabled={!active} onClick={() => handleTapVote(id)}>
              투표
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

/**
 * 투표 항목 컴포넌트
 */
export const VoteItem = styled(VoteItemComponent)`
  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  & .item-thumb {
    width: 100%;
    padding: 0.4rem;
    & .thumb-inner {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      border-radius: 50%;
      & > .image-wrapper {
        display: inline-block;
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 0;
        line-height: 0;
      }
      & img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      &.is-animation {
        & > .image-wrapper {
          animation: bounce 0.25s ease-in-out;
        }
      }
    }
  }
  & .item-info {
    position: relative;
    height: 13.8rem;
    & .item-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: center;
      position: relative;
      color: ${({ color, theme }) => color || theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.mediumB};
      padding-top: 0.8rem;
      text-align: center;
    }
    & .item-count {
      color: ${({ color, theme }) => color || theme.color.gray50};
      font: ${({ theme }) => theme.fontType.mini};
      opacity: ${({ color }) => (color ? 0.5 : 1)};
      margin-top: 0.4rem;
      margin-bottom: 1.8rem;
      text-align: center;
    }

    & .btn-box {
      position: absolute;
      bottom: 2.4rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      ${Button} {
        width: 7.4rem;
        height: 4rem;
        border-radius: 2rem;
        color: ${({ button, theme }) => button.color || theme.color.white};
        background-color: ${({ button, theme }) => button.background || theme.color.brand.tint};
        &:disabled {
          color: ${({ theme }) => theme.color.text.textDisabled};
          background-color: ${({ theme }) => theme.color.states.disabledBg};
        }
      }
    }
  }
`;
