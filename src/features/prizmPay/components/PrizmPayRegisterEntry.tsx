import { forwardRef, useState, useEffect, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useImageLoader } from '@hooks/useImageLoader';
import { Button } from '@pui/button';
import { convertHexToRGBA } from '@utils/color';
import { getImageLink } from '@utils/link';

export type PrizmPayRegisterEntryProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  onAddCard?: () => void;
};
const PrizmPayRegisterEntryComp = forwardRef<HTMLDivElement, PrizmPayRegisterEntryProps>(
  ({ className, onAddCard }, ref) => {
    const { preloadImages } = useImageLoader();
    const [isAnimationPlay, setIsAnimationPlay] = useState(false);

    const imageUrls: string[] = useMemo(() => {
      return [
        'service/prizm-pay/card/card1.png',
        'service/prizm-pay/card/card2.png',
        'service/prizm-pay/card/card3.png',
        'service/prizm-pay/card/card4.png',
      ];
    }, []);

    useEffect(() => {
      preloadImages(imageUrls).then(() => {
        setIsAnimationPlay(true);
      });
    }, [imageUrls, preloadImages]);
    return (
      <div ref={ref} className={className}>
        <div className="title-wrapper">
          <p className="title">
            카드를 다시
            <br /> 등록해주세요
          </p>
          <p className="sub-title">프리즘페이가 업데이트되어 재등록이 필요합니다</p>
        </div>

        <div
          className={classNames('media-wrapper', {
            'is-play': isAnimationPlay,
          })}
        >
          {imageUrls.map((item, idx) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div className={`layer layer-${idx + 1}`} key={idx}>
                <img src={getImageLink(item)} alt="" />
              </div>
            );
          })}
        </div>
        <div className="detail-wrapper">
          <p className="title">
            프리즘페이,
            <br />
            무엇이 바뀌었나요?
          </p>
          <p className="sub-title">
            이제 프리즘페이로 5만원 이상 결제 시 무이자 할부를 이용하실 수 있습니다. 업데이트된 서비스 이용을 위해,
            불편하시겠지만 카드를 다시 등록해주세요.
          </p>
        </div>
        <div className="btn-wrapper">
          <div className="btn">
            <Button variant="primary" onClick={onAddCard}>
              카드 재등록
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

export const PrizmPayRegisterEntry = styled(PrizmPayRegisterEntryComp)`
  position: relative;
  & > .title-wrapper {
    padding: 3.5rem 2.4rem 0;
    & .title {
      font: ${({ theme }) => theme.fontType.t32B};
      color: ${({ theme }) => theme.color.tint};
    }
    & .sub-title {
      margin-top: 0.8rem;
      font: ${({ theme }) => theme.fontType.t15};
      color: ${({ theme }) => theme.color.gray50};
    }
  }
  & > .media-wrapper {
    height: 44rem;
    position: relative;
    opacity: 0;

    & .layer {
      position: absolute;
      width: 29.2rem;
      height: 21.6rem;
      left: 0;
      right: 0;
      bottom: 2.4rem;
      margin: 0 auto;
    }

    &.is-play {
      opacity: 1;
      & .layer {
        // drawer  open duration(0.3s)까지 포함하여 딜레이 처리
        transition: transform 0.8s 1.1s cubic-bezier(0.33, 1, 0.68, 1);
      }
      & .layer-2 {
        transform: translate3d(0, -4.8rem, 0);
      }
      & .layer-3 {
        transform: translate3d(0, -9.6rem, 0);
      }
      & .layer-4 {
        transform: translate3d(0, -14.4rem, 0);
      }
    }
  }
  & > .detail-wrapper {
    padding: 0.8rem 2.4rem 11rem;
    & .title {
      font: ${({ theme }) => theme.fontType.t24B};
      color: ${({ theme }) => theme.color.tint};
    }
    & .sub-title {
      margin-top: 1.6rem;
      font: ${({ theme }) => theme.fontType.t14};
      color: ${({ theme }) => theme.color.gray50};
    }
  }

  & > .btn-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    left: 2.4rem;
    right: 2.4rem;
    z-index: 2;
    &:before {
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: -3.2rem;
      width: 100%;
      height: 6.4rem;
      background: linear-gradient(
        180deg,
        ${({ theme }) => convertHexToRGBA(theme.color.surface, 0)} 0%,
        ${({ theme }) => convertHexToRGBA(theme.color.surface, 1)} 100%
      );
      content: '';
    }
    &:after {
      display: block;
      background: ${({ theme }) => theme.color.surface};
      position: absolute;
      left: 0;
      right: 0;
      top: 3.2rem;
      width: 100%;
      height: 20rem;
      content: '';
    }
    & .btn {
      position: relative;
      z-index: 1;
      ${Button} {
        font: ${({ theme }) => theme.fontType.t15B};
        color: ${({ theme }) => theme.color.white};
        width: 100%;
        min-height: 5.6rem;
      }
    }
  }
`;
