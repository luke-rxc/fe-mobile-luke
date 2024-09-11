import { forwardRef, useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { MediaViewerRatio } from '../../../constants';
import type { DisplayMediaModel, LandingActionModel } from '../../../models';
import { getLandingLink } from '../../../utils';

export type ImageBoxProps = HTMLAttributes<HTMLDivElement> & {
  /** 미디어 정보 */
  media: DisplayMediaModel;
  /** 랜딩 */
  actions: LandingActionModel;
  /** 뷰어 사이즈 */
  viewerRatio: MediaViewerRatio;
  /** action cb */
  onActions?: () => void;
};

const ImageBoxComponent = forwardRef<HTMLDivElement, ImageBoxProps>(
  ({ className, media, actions, viewerRatio, onActions = () => {} }, ref) => {
    const link = getLandingLink(actions);
    const [errorMedia, setErrorMedia] = useState<boolean>(false);
    const [successMedia, setSuccessMedia] = useState<boolean>(false);

    const mediaInfo: {
      videoW: number;
      videoH: number;
      centerX: number;
      centerY: number;
    } = useMemo(() => {
      // 기기에 따라 소수점 렌더 처리 될 경우, 흰 라인 발생 이슈로 정수로 처리
      const viewerWidth = window.innerWidth;
      const viewerHeight = Math.floor((viewerWidth * viewerRatio.height) / viewerRatio.width);
      const videoHeight = (media.height * viewerWidth) / media.width;

      let targetW = 0;
      let targetH = 0;
      let centerX = 0;
      let centerY = 0;
      if (viewerHeight > videoHeight) {
        targetW = Math.round((media.width * viewerHeight) / media.height);
        targetH = viewerHeight;
        centerX = Math.floor((targetW - viewerWidth) / 2) * -1;
      } else {
        targetW = viewerWidth;
        targetH = Math.round(videoHeight);
        centerY = Math.floor((targetH - viewerHeight) / 2) * -1;
      }

      return {
        videoW: targetW,
        videoH: targetH,
        centerX,
        centerY,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <div className={className} ref={ref}>
        <Conditional condition={!!link} trueExp={<Action is="a" link={link} onClick={onActions} />} falseExp={<></>}>
          <ImageBoxStyled
            {...mediaInfo}
            className={classNames('media-box', {
              'is-error': errorMedia,
              'is-loaded': successMedia,
            })}
          >
            <Image
              className="media"
              src={getImageLink(media.path)}
              blurHash={media.blurHash}
              onError={() => setErrorMedia(true)}
              onLoad={() => setSuccessMedia(true)}
              lazy
            />
          </ImageBoxStyled>
        </Conditional>
      </div>
    );
  },
);

/**
 * 미디어 뷰 컴포넌트
 */
export const ImageBox = styled(ImageBoxComponent).attrs(
  ({ videoW, videoH, centerX, centerY }: { videoW: number; videoH: number; centerX: number; centerY: number }) => {
    return {
      videoW,
      videoH,
      centerX,
      centerY,
    };
  },
)`
  ${Action} {
    display: block;
  }

  & .media-box {
    overflow: hidden;
    position: absolute;
    z-index: 0;
    height: 100%;
    inset: 0px;

    &:before {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
      content: '';
    }

    &.is-loaded:before {
      background: none;
    }
  }
`;

export const ImageBoxStyled = styled.div.attrs(
  ({ videoW, videoH, centerX, centerY }: { videoW: number; videoH: number; centerX: number; centerY: number }) => {
    return {
      videoW,
      videoH,
      centerX,
      centerY,
    };
  },
)`
  & img {
    position: relative;
    width: ${({ videoW }) => `${videoW / 10}rem`};
    height: ${({ videoH }) => `${videoH / 10}rem`};
    transform: ${({ centerX, centerY }) => `translate3d(${centerX / 10}rem,${centerY / 10}rem, 0rem)`};
    object-fit: cover;
    vertical-align: top;
  }

  & .media {
    display: block;
    overflow: hidden;
    position: absolute;
    z-index: 0;
    width: ${({ videoW }) => `${videoW / 10}rem`};
    height: ${({ videoH }) => `${videoH / 10}rem`};
    transform: ${({ centerX, centerY }) => `translate3d(${centerX / 10}rem,${centerY / 10}rem, 0rem)`};
    inset: 0px;
  }
`;
