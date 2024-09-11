import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { MediaViewerRatio } from '../../../constants';
import type { DisplayMediaModel, LandingActionModel } from '../../../models';
import { getLandingLink } from '../../../utils';

export type MediaBoxProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'id'> & {
  /** 타이틀 */
  title: string;
  /** 서브타이틀 */
  subTitle: string;
  /** 랜딩 */
  actions: LandingActionModel;
  /** 미디어 정보 */
  media: DisplayMediaModel;
  /** 미디어 노출 비율 */
  mediaViewRatio: MediaViewerRatio;
  /** 라운드 여부 */
  round: boolean;
  /** 텍스트 컬러 */
  color: string;
  onActions?: () => void;
};

const MediaBoxComponent = forwardRef<HTMLDivElement, MediaBoxProps>(
  ({ className, title, subTitle, media, actions, mediaViewRatio, onActions }, ref) => {
    const mediaRef = useRef<HTMLDivElement | null>(null);
    const link = getLandingLink(actions);
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
    const [successMedia, setSuccessMedia] = useState<boolean>(false); // 미디어 에러상태
    const [viewH, setViewH] = useState<number>(0);

    const handleAction = useCallback(() => {
      onActions?.();
    }, [onActions]);

    useEffect(() => {
      if (!mediaRef.current) return;

      const width = mediaRef.current.offsetWidth;
      const height = Math.floor((width * mediaViewRatio.height) / mediaViewRatio.width) / 10; // rem단위
      setViewH(height);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={className} ref={ref}>
        <div ref={mediaRef}>
          <Conditional
            condition={!!link}
            trueExp={<Action is="a" link={link} onClick={handleAction} />}
            falseExp={<></>}
          >
            <div
              className={classNames('media-box', {
                'is-error': errorMedia,
                'is-loaded': successMedia,
              })}
              style={{
                paddingTop: `${viewH}rem`,
              }}
            >
              <Image
                className="media"
                src={getImageLink(media.path)}
                blurHash={media.blurHash}
                onError={() => setErrorMedia(true)}
                onLoad={() => setSuccessMedia(true)}
                lazy
              />
            </div>
            {(title || subTitle) && (
              <div className="text-wrapper">
                {title && <p className="title">{title}</p>}
                {subTitle && <p className="sub">{subTitle}</p>}
              </div>
            )}
          </Conditional>
        </div>
      </div>
    );
  },
);

/**
 * 미디어 뷰 컴포넌트
 */
export const MediaBox = styled(MediaBoxComponent)`
  ${Action} {
    display: block;
  }
  & .media-box {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: ${({ round, theme }) => (round ? theme.radius.r8 : '0rem')};

    & .media {
      position: absolute;
      top: 50%;
      height: 100%;
      left: 0;
      transform: translateY(-50%);
      & img {
        width: 100%;
        vertical-align: middle;
        border-radius: ${({ round, theme }) => (round ? theme.radius.r8 : '0rem')};
      }
    }

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
      border-radius: ${({ round, theme }) => (round ? theme.radius.r8 : '0rem')};
      content: '';
    }
    &.is-loaded:before {
      background: none;
    }
  }
  & .text-wrapper {
    margin-top: 1.2rem;
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
    text-align: center;
    word-break: break-all;

    .title {
      font: ${({ theme }) => theme.content.contentStyle.fontType.title2B};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .sub {
      margin-top: 0.4rem;
      font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
`;
