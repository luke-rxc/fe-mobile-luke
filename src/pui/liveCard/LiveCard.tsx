/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { format, isToday, getMinutes } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useUpdateEffect } from 'react-use';
import { UniversalLinkTypes, AppLinkTypes } from '@constants/link';
import { isHexColor, convertHexToRGBA } from '@utils/color';
import { getAppLink } from '@utils/link';
import { useLink } from '@hooks/useLink';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { BellFilled, LottieRef } from '@pui/lottie';
import { Image } from '@pui/image';
import { SVG } from '@pui/svg';
import { Profiles } from '@pui/profiles';

const toScheduleDateFormat = (date: number, onAir?: boolean) => {
  const baseFormat = 'M. d a h시 m분';
  const onAirFormat = '지금 a h시 m분';
  const todayFormat = '오늘 a h시 m분';

  // eslint-disable-next-line no-nested-ternary
  const selectedFormat = onAir ? onAirFormat : isToday(date) ? todayFormat : baseFormat;
  const fixedFormat = getMinutes(date) ? selectedFormat : selectedFormat.replace('m분', '').trimEnd();

  const formatted = format(date, fixedFormat, { locale: ko });

  return formatted;
};

const getGradient = (colorCode: string, defaultColorCode: string) => {
  const color = isHexColor(colorCode) ? colorCode : defaultColorCode;

  return `linear-gradient(${convertHexToRGBA(color, 0)} 0%, ${color} 100%)`;
};

const getLiveCardLink = (
  data: Pick<
    LiveCardProps,
    'onAir' | 'liveId' | 'contentCode' | 'contentType' | 'scheduleId' | 'landingType' | 'web' | 'scheme'
  >,
) => {
  const { isApp } = useDeviceDetect();
  const { getLink } = useLink();
  const { web, scheme, onAir, liveId, contentCode, contentType, scheduleId, landingType } = data;

  if (isApp && scheme) {
    return scheme;
  }
  if (!isApp && web) {
    return web;
  }

  if (onAir && liveId) {
    return getLink(UniversalLinkTypes.LIVE, { liveId });
  }

  if (landingType === 'STORY' && contentCode && contentType) {
    return getLink(UniversalLinkTypes.CONTENT, { contentCode, contentType: contentType.toLowerCase() });
  }

  if ((landingType === 'MODAL' || landingType === 'SCHEDULE_TEASER') && scheduleId && isApp) {
    return getAppLink(AppLinkTypes.SCHEDULE_TEASER, { contentsScheduleId: scheduleId });
  }

  return '#none';
};

export interface LiveCardProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 방송여부 */
  onAir?: boolean;
  /** 라이브 ID */
  liveId?: number;
  /** 콘텐츠 코드 */
  contentCode?: string;
  /** 콘텐츠 타입 */
  contentType?: string;
  /** 스케줄 ID */
  scheduleId?: string | number;
  /** 라이브 제목 */
  title: string;
  /** 라이브 예정일 */
  scheduleDate: number;
  /** 브랜드 SVG 로고 */
  logoURL?: string;
  /** 크로마키 이미지 */
  chromakeyURL: string;
  /** 배경 이미지 */
  backgroundURL: string;
  /**
   * 로고뒤 그라디언트배경 색상
   * @default #000000
   */
  bgColorCode?: string;
  /** 알림신청 여부 */
  followed?: boolean;
  /** 쇼룸 Id */
  showroomId?: number;
  /** 쇼룸 코드 */
  showroomCode?: string;
  /** 프로필 이미지 URL */
  profileURL?: string;
  /**
   * 랜딩 타입(deprecated MODAL)
   */
  landingType?: 'SCHEDULE_TEASER' | 'MODAL' | 'STORY';
  /** web 랜딩 URL */
  web?: string;
  /** app 랜딩 URL */
  scheme?: string;
  /** 알림신청or해지시 실행할 콜백(현재 알림신청 상태를 파라미터로 전달함) */
  onChangeFollow?: (follow: boolean, item: LiveCardProps) => void;
  /** 링크 클릭 */
  onClickLink?: (event: React.MouseEvent<HTMLAnchorElement>, item: LiveCardProps) => void;
}

const LiveCardComponent = forwardRef<HTMLSpanElement, LiveCardProps>((props, ref) => {
  const {
    title,
    scheduleDate,
    logoURL,
    chromakeyURL,
    backgroundURL,
    bgColorCode,
    onAir,
    liveId,
    scheduleId,
    contentCode,
    contentType,
    followed = false,
    className,
    showroomId,
    showroomCode,
    profileURL,
    landingType,
    web,
    scheme,
    onChangeFollow,
    onClickLink,
    ...rest
  } = props;

  const lottie = useRef<LottieRef>(null);
  const element = useRef<HTMLSpanElement>(null);
  const isAnimatable = useRef<boolean>(false);
  const [inView, setInView] = useState<boolean>(false);

  const link = getLiveCardLink({ onAir, liveId, contentCode, contentType, scheduleId, landingType, web, scheme });

  const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClickLink?.(e, props);
  };

  /**
   * 알림 신청/해지
   */
  const handleChangeFollow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    isAnimatable.current = true;
    onChangeFollow?.(followed, props);
  };

  /**
   * Intersection Observer 콜백함수
   */
  const onIntersect = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (entry.isIntersecting) {
      // 화면에 노출시 inView State 업데이트
      setInView(true);
      observer.disconnect();
    }
  };

  /**
   * Intersection Observer 구독/해제
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (element.current) {
      observer = new IntersectionObserver(onIntersect, { threshold: 0.8 });
      observer.observe(element.current);
    }

    return () => observer && observer.disconnect();
  }, []);

  /**
   * 초기 로띠 설정
   */
  useEffect(() => {
    if (lottie.current?.player) {
      lottie.current?.player.goToAndStop(followed ? 60 : 0, true);
    }
  }, [!!lottie.current]);

  /**
   * 알림상태 변경에 따른 로띠 제어
   */
  useUpdateEffect(() => {
    const player = lottie.current?.player;

    if (player) {
      // eslint-disable-next-line no-nested-ternary
      followed ? (isAnimatable.current ? player.play() : player.goToAndStop(60, true)) : player.goToAndStop(0);
      isAnimatable.current = false;
    }
  }, [followed]);

  /**
   * 상위에서 받은 ref setting
   */
  useImperativeHandle(ref, () => element.current as HTMLSpanElement);

  return (
    <span ref={element} className={classnames(className, { 'is-view': inView })} {...rest}>
      <Action is="a" className="live-button-link" link={link} onClick={handleClickLink}>
        <span className="live-thumb">
          <span className="background" children={<Image noFadeIn src={backgroundURL} />} />
          <span className="chromakey" children={<Image noFadeIn src={chromakeyURL} />} />
          <span className="gradient" />
          {logoURL && <span className="logo" children={<SVG src={logoURL} />} />}
        </span>
        <span className="live-info">
          <span className="title">{title}</span>
          <span className="date">{toScheduleDateFormat(scheduleDate, onAir)}</span>
        </span>
      </Action>

      {onAir && liveId && showroomCode && (
        <Profiles
          className="live-button-profile"
          status="live"
          size={56}
          liveId={liveId}
          showroomCode={showroomCode}
          image={{ src: profileURL || '', lazy: true }}
        />
      )}

      {!onAir && (
        <Action
          className={classnames('live-button-follow', { 'is-followed': followed })}
          onClick={handleChangeFollow}
          aria-pressed={followed}
          aria-label="알림신청"
        >
          <BellFilled ref={lottie} animationOptions={{ loop: false, autoplay: false }} />
        </Action>
      )}
    </span>
  );
});

/**
 * Figma LiveCard 컴포넌트
 */
export const LiveCard = styled(LiveCardComponent)`
  display: inline-block;
  position: relative;

  /** inView */
  &.is-view {
    .live-thumb .background {
      transform: translate3d(-50%, -50%, 0);
    }
    .live-thumb .chromakey {
      transform: translate3d(-50%, -50%, 0);
    }
    .live-thumb .logo {
      transform: translate3d(-50%, 0, 0);
    }
  }

  /** link button */
  .live-button-link {
    display: block;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    width: calc((100vw - 8rem) / 2);
    max-width: 16.7rem;

    /** pressed effect */
    &${Action}:active .live-thumb:after {
      opacity: 1;
    }
  }

  /** live thumbnail */
  .live-thumb {
    display: block;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding-top: 133.59375%;
    transform: translate3d(0, 0, 0);
    border-radius: ${({ theme }) => theme.radius.r8};
    font-size: 0;

    /** pressed dimmed */
    &:after {
      position: absolute;
      z-index: 3;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.states.pressedMedia};
      transition: opacity 0.2s;
      opacity: 0;
      content: '';
    }

    .chromakey,
    .background {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 119%;
      height: 120%;
      transition: transform 700ms ease;
      will-change: transform;
      line-height: 0;

      ${Image} {
        background: transparent;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .background {
      transform: translate3d(-50%, calc(-50% + 1.6rem), 0);
    }

    .chromakey {
      transform: translate3d(-50%, calc(-50% + 0.8rem), 0);
    }

    .logo {
      position: absolute;
      bottom: 1.6rem;
      left: 50%;
      width: 9.6rem;
      height: 3.2rem;
      transform: translate3d(-50%, 0.4rem, 0);
      transition: transform 700ms ease;
      will-change: transform;

      ${SVG} {
        width: 100%;
        height: 100%;
      }

      & * {
        fill: #fff !important;
        filter: none !important;
      }
    }

    .gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 7.2rem;
      opacity: 0.4;
      background: ${({ bgColorCode = '#000' }) => getGradient(bgColorCode, '#000')};
    }
  }

  /** live information */
  .live-info {
    display: block;
    overflow: hidden;
    height: 8.9rem;
    padding-top: 1.2rem;

    .title {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      word-wrap: break-word;
      word-break: keep-all;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      font: ${({ theme }) => theme.fontType.smallB};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .date {
      display: block;
      margin-top: 0.4rem;
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  .live-button-profile {
    position: absolute;
    z-index: 4;
    top: 0;
    right: 0;
  }

  /** follow button */
  .live-button-follow {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0 })};
    z-index: 4;
    width: 5.6rem;
    height: 5.6rem;
    justify-content: center;
    align-items: center;
    line-height: 0;
    color: #fff;

    &:before {
      display: inline-block;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: #000;
      transition: opacity 0.2s, background 0.2s;
      opacity: 0.5;
      content: '';
    }

    ${BellFilled} {
      ${({ theme }) => theme.mixin.center()};
      width: 2.4rem;
      height: 2.4rem;
      color: inherit;

      & *[fill] {
        fill: currentColor;
      }

      & *[stroke] {
        stroke: currentColor;
      }
    }

    /** pressed effect */
    &:active {
      transform: scale(0.96);
      transition: transform 0.2s;

      &:before {
        opacity: 0.47;
      }
    }

    /** followed state */
    &.is-followed {
      color: #000;

      &:before {
        background: #fff;
      }
    }
  }
`;
