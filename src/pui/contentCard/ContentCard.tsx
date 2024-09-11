import React, { forwardRef, useEffect, useState, MouseEvent, HTMLAttributes, useCallback } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { ContentType } from '@constants/content';
import { UniversalLinkTypes } from '@constants/link/universalLink';
import { useTheme } from '@hooks/useTheme';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDDay } from '@services/useDDay';
import { toDateFormat } from '@utils/date';
import { getAppLink, getWebLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { Action } from '@pui/action';
import { CountDown } from '@pui/countDown';
import { Image, ImageProps } from '@pui/image';

export type ContentCardProps = HTMLAttributes<HTMLDivElement> & {
  /** 컨텐츠 타입 */
  contentType: ContentType;
  /** 컨텐츠 코드 */
  contentCode: string;
  /** 타이틀 */
  title: string;
  /** 컨텐츠 섬네일 이미지 */
  image: Omit<ImageProps, 'lazy' | 'radius'>;
  /** 컨텐츠 Id - 이벤트 로깅을 위해 추가 */
  contentId?: number;
  /** 레이아웃 타입 */
  layoutType?: 'none' | 'swipe';
  /** 컨텐츠 공개 시작일 */
  startDate?: number; // 공개시작일
  /** 컨텐츠 공개 종료일 */
  endDate?: number;
  /** Anchor 클릭 이벤트 콜백 */
  onClickLink?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const ContentCardComponent = forwardRef<HTMLDivElement, ContentCardProps>(
  (
    {
      className,
      contentId,
      contentType,
      contentCode,
      title,
      image,
      layoutType = 'none',
      startDate = 0,
      endDate = 0,
      onClickLink,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { alert } = useWebInterface();
    const { isApp } = userAgent();
    const getLink = isApp ? getAppLink : getWebLink;
    const link = getLink(UniversalLinkTypes.CONTENT, {
      contentType: contentType.toLowerCase(),
      contentCode,
    });

    const { isEnd, remainDay, countDown } = useDDay({ time: startDate });
    const classNames = classnames(className, {
      'layout-swipe': layoutType === 'swipe',
    });
    const [opening, setOpening] = useState(true); // 공개중인지 여부
    const handleLink = useCallback(
      (e: MouseEvent<HTMLAnchorElement>) => {
        if (!!startDate && !opening) {
          e.preventDefault();
          const message = `${toDateFormat(startDate, 'yyyy. M. d a h:mm')
            .replace('AM', '오전')
            .replace('PM', '오후')}에 공개 예정입니다`;

          alert({
            message,
          });
        } else {
          onClickLink?.(e);
        }
      },
      [alert, opening, startDate, onClickLink],
    );

    useEffect(() => {
      if (!!startDate === false) {
        return;
      }
      if (isEnd && startDate <= new Date().getTime()) {
        setOpening(true);
      } else {
        setOpening(false);
      }
    }, [isEnd, startDate]);

    return (
      <div ref={ref} className={classNames} {...props}>
        <Action className={classNames} is="a" link={link} onClick={handleLink}>
          <div className="thumbnail">
            <div className="inner">
              <Image {...{ lazy: true, radius: theme.radius.s8, ...image }} />
              <div className="dimmed-active" />
              {!opening && (
                <div className="count">
                  <CountDown
                    remainDay={remainDay}
                    countDown={countDown}
                    countDownEnd={isEnd}
                    nearTimeSize={24}
                    direction="left"
                    hideAfterCountDownEnd
                    textColor="#ffffff"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="info">
            <p className="title">{title}</p>
            {(!!startDate || !!endDate) && (
              <p className="date">
                {!!startDate && <span>{toDateFormat(startDate, 'yyyy. M. d')}</span>}
                {!!endDate && opening && <span> - {toDateFormat(endDate, 'yyyy. M. d')}</span>}
                {!opening && <span> 공개예정</span>}
              </p>
            )}
          </div>
        </Action>
      </div>
    );
  },
);

/**
 * Figma 컨텐츠 카드 컴포넌트
 */
export const ContentCard = styled(ContentCardComponent)`
  ${Action} {
    display: block;

    .thumbnail {
      overflow: hidden;
      position: relative;
      padding-top: 75%;
      border-radius: ${({ theme }) => theme.radius.r8};
      /** safari에서 라운드 영역의 이미지 overflow:hidden이 적용되지 않는 이슈로 추가 */
      transform: translate3d(0, 0, 0);

      & .inner {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        align-items: center;
        justify-content: center;
      }

      & .dimmed-active {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: ${({ theme }) => theme.color.states.pressedMedia};
        opacity: 0;
        transition: opacity 0.2s;
        content: '';
      }

      & .count {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24} 4.2rem`};
        /** PDS에서 다크모드 여부 상관없이 동일 값 적용되어 있어 theme사용 X */
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
      }
    }

    .info {
      min-height: 8rem;
      margin-top: ${({ theme }) => theme.spacing.s12};

      & .title {
        color: ${({ theme }) => theme.color.text.textPrimary};
        font: ${({ theme }) => theme.fontType.mediumB};
        word-break: break-all;
      }

      & .date {
        margin-top: ${({ theme }) => theme.spacing.s4};
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.mini};
      }
    }

    /** pressed effect */
    &:active {
      & .dimmed-active {
        opacity: 1;
      }
    }
  }
`;
