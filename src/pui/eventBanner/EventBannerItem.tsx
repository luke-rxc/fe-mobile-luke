import React, { forwardRef, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useLongPress } from 'react-use';
import { Action } from '@pui/action';
import { EventBannerMedia, EventBannerMediaProps } from './EventBannerMedia';

export interface EventBannerItemCommonProps {
  /** 배너 고유 아이디 */
  id: number;
  /** 타이틀 */
  title: string;
  /** 서브 타이틀 */
  subTitle: string;
  /** bg 컬러 */
  bgColor: string;
  /** 텍스트 컬러 */
  textColor: string;
  /** Layer1 Media */
  primaryMedia: Omit<EventBannerMediaProps, 'play'>;
  /** Layer2 Media */
  secondaryMedia?: Omit<EventBannerMediaProps, 'play'>;
  /** 링크 */
  link?: string;
}

export interface EventBannerItemClickProps extends EventBannerItemCommonProps {
  /** 배너의 위치 Index */
  idx: number;
}

export type EventBannerItemProps = EventBannerItemCommonProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'onClick'> & {
    /** 활성화 되었을때 여부 (Swiper), @default false */
    active?: boolean;
    /** 리스트 탭시 리스트 정보를 받을 수 있는 Callback */
    onClick?: (itemInfo: EventBannerItemClickProps) => void;
    /** 가상 클래스 active를 사용하는 경우 */
    pseudoActive?: boolean;
    /** 배너의 위치 Index */
    idx?: number;
  };

const EventBannerItemComponent = forwardRef<HTMLDivElement, EventBannerItemProps>(
  (
    {
      className,
      id,
      title,
      subTitle,
      bgColor,
      textColor,
      primaryMedia,
      secondaryMedia,
      link,
      active = false,
      onClick: handleClick,
      pseudoActive = true,
      idx = 0,
      ...props
    },
    ref,
  ) => {
    const thumbPrimaryRef = useRef<HTMLDivElement>(null);
    const thumbSecondaryRef = useRef<HTMLDivElement>(null);

    const [primaryMediaPlay, setPrimaryMediaPlay] = useState(false);
    const [secondaryMediaPlay, setSecondaryMediaPlay] = useState(false);

    const [isPressed, setIsPressed] = useState(false);

    const handleLongPress = () => {
      setIsPressed(true);
    };

    const { onTouchEnd, ...longPressEvent } = useLongPress(handleLongPress, {
      isPreventDefault: false,
      delay: 100,
    });

    const handleTouchMove = (evt: React.TouchEvent<HTMLAnchorElement>) => {
      evt.cancelable && evt.preventDefault();
      setIsPressed(false);
    };

    const handlePressEnd = () => {
      setIsPressed(false);
      onTouchEnd?.();
    };

    const handleListClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
      handleClick?.({
        id,
        title,
        subTitle,
        bgColor,
        textColor,
        primaryMedia,
        secondaryMedia,
        link,
        idx,
      });

      // link 없는 부분은 preventDefault 처리 진행
      !link && evt.preventDefault();
      setIsPressed(false);
    };

    const handlePrimaryTransition = () => {
      setPrimaryMediaPlay(true);
    };
    const handleSecondaryTransition = () => {
      setSecondaryMediaPlay(true);
    };

    const addTransitionEvent = () => {
      if (thumbPrimaryRef.current) {
        thumbPrimaryRef.current.addEventListener('transitionend', handlePrimaryTransition, {
          once: true,
        });
      }
      if (thumbSecondaryRef.current) {
        thumbSecondaryRef.current.addEventListener('transitionend', handleSecondaryTransition, {
          once: true,
        });
      }
    };

    const removeTransitionEvent = () => {
      if (thumbPrimaryRef.current) {
        thumbPrimaryRef.current.removeEventListener('transitionend', handlePrimaryTransition);
      }
      if (thumbSecondaryRef.current) {
        thumbSecondaryRef.current.removeEventListener('transitionend', handleSecondaryTransition);
      }
    };

    useEffect(() => {
      if (active) {
        addTransitionEvent();
        return;
      }
      removeTransitionEvent();
      setPrimaryMediaPlay(false);
      setSecondaryMediaPlay(false);
      setIsPressed(false);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    useEffect(() => {
      return () => {
        removeTransitionEvent();
        setPrimaryMediaPlay(false);
        setSecondaryMediaPlay(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <div
        ref={ref}
        className={classnames(className, {
          active,
        })}
        {...props}
      >
        <div>
          <Action
            className={classnames('', {
              'is-press': pseudoActive,
              'is-active': !pseudoActive && isPressed,
            })}
            is="a"
            link={link}
            {...longPressEvent}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressEnd}
            onTouchMove={handleTouchMove}
            onClick={handleListClick}
          >
            <div className="wrapper">
              <div className="container bg-container" />
              <div
                className={classnames('thumb primary', {
                  multiple: !!secondaryMedia,
                })}
                ref={thumbPrimaryRef}
              >
                <EventBannerMedia {...primaryMedia} play={primaryMediaPlay} />
              </div>
              {secondaryMedia && (
                <div className="thumb secondary" ref={thumbSecondaryRef}>
                  <EventBannerMedia {...secondaryMedia} play={secondaryMediaPlay} />
                </div>
              )}
            </div>
            <div className="container text-container">
              <div className="text-area">
                <p className="title">{title}</p>
                <p className="title-sub">{subTitle}</p>
              </div>
            </div>
          </Action>
        </div>
      </div>
    );
  },
);

export const EventBannerItem = styled(EventBannerItemComponent)`
  ${Action} {
    display: inline-block;
    width: 100%;
    height: 11.2rem;
    will-change: transform;
    transition: transform 200ms ease-in-out;
    transform: scale(1), translateZ(0);

    &.is-press:active,
    &.is-active {
      transform: scale(0.96);
    }
  }

  .wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }

  .bg-container {
    ${({ bgColor }) => {
      return `background: ${bgColor};`;
    }}
  }

  .text-container {
    ${({ textColor }) => {
      return `color: ${textColor};`;
    }}
  }

  .container {
    ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0, r: 0 })};
    height: 8.8rem;
    border-radius: ${({ theme }) => theme.radius.r8};
  }

  .text-area {
    padding: ${({ theme }) => `0 ${theme.spacing.s8} 0 ${theme.spacing.s24}`};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate3d(0.8rem, 0, 0);
    opacity: 0;
    will-change: transform, opacity;
    transition: transform 500ms ease-out, opacity 500ms ease-out;

    .title {
      font: ${({ theme }) => theme.fontType.title2B};
      ${({ theme }) => theme.mixin.ellipsis()};
    }

    .title-sub {
      margin-top: 0.4rem;
      font: ${({ theme }) => theme.fontType.mini};
      ${({ theme }) => theme.mixin.ellipsis()};
    }
  }

  .thumb {
    width: 11.2rem;
    height: 100%;
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0 })};
    will-change: transform, opacity;
    transition: transform 500ms ease-out, opacity 500ms ease-out;
    opacity: 0;

    &.primary {
      transform: translate3d(0, 0.8rem, 0);
      &.multiple {
        transform: translate3d(0, 1.6rem, 0);
      }
    }

    &.secondary {
      transform: translate3d(0, 0.8rem, 0);
    }
  }

  &.active {
    .text-area {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    .thumb {
      transform: translate3d(0, 0, 0) !important;
      opacity: 1;
    }
  }
`;
