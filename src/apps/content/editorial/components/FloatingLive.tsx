import { forwardRef, useRef, useCallback, useEffect, useState, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { useInterval } from 'react-use';
import classNames from 'classnames';
import { format, differenceInCalendarDays, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';
import type Swiper from 'swiper';
import { UniversalLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Equalizer, LottieRef } from '@pui/lottie';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { useDDay } from '@services/useDDay';
import { toHHMMSS } from '@utils/toTimeformat';
import { FloatingDirectionStatus, FloatingStatus } from '../constants';
import type { LiveModel } from '../models';

export type FloatingLiveProps = HTMLAttributes<HTMLDivElement> & {
  /** 편성된 라브 정보 */
  live: LiveModel;
  /** 쇼룸 팔로우 여부 */
  followed: boolean;
  /** 플로팅 방향 */
  direction: FloatingDirectionStatus;
  /** 콘텐츠 플로팅 노출 상태 */
  snackbarDisplayStatus: FloatingStatus;
  /** 라이브중 상태 변경시 cb. 쇼룸 프로필 라이브 링크 변경 처리 */
  onChangeLiveStatus: (liveId: number) => void;
  /** 라이브 링크 클릭 cb */
  onLiveLink?: () => void;
};

export const FloatingLiveComponent = forwardRef<HTMLDivElement, FloatingLiveProps>(
  ({ className, live, followed, direction, snackbarDisplayStatus, onChangeLiveStatus, onLiveLink }, ref) => {
    const { liveStartDate, id } = live;
    const { isIOS } = useDeviceDetect();
    const { getLink } = useLink();
    const { isEnd, remainDay } = useDDay({ time: liveStartDate || 0 });
    const liveLink = getLink(UniversalLinkTypes.LIVE, { liveId: id });
    const [isSlideMask, setIsSlideMask] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState(false);
    const lottieRef = useRef<LottieRef>(null);
    const liveWrapperEl = useRef<HTMLDivElement | null>(null);
    const btnWrapperRef = useRef<HTMLDivElement>(null);
    const swp = useRef<Swiper | null>(null);
    const slideActiveIndex = useRef<number>(0);
    const slideDelay = 3000;
    // 초기 진입시 라이브중 상태 체크
    const initInitLive = useMemo(() => {
      const distance = liveStartDate - Date.now();
      return distance < 0;
    }, [liveStartDate]);
    const intervalTime = useRef<number | null>(initInitLive ? null : 1000);

    /**
     * 카운트다운 value 조회
     * 24시간 이상 D-day
     * 24시간 미만 카운트다운
     */
    const handleGetDDayValue = useCallback((reachTime, compareTime) => {
      const distance = reachTime - compareTime;
      const diffRemainDay = differenceInCalendarDays(reachTime, compareTime);
      const diffRemainHours = differenceInHours(reachTime, compareTime);
      const remainValue = diffRemainHours < 24 ? 0 : diffRemainDay;

      return remainValue > 0 ? `D-${remainValue}` : toHHMMSS(distance);
    }, []);
    const [timer, setTimer] = useState(handleGetDDayValue(liveStartDate, Date.now()));

    useInterval(() => {
      const now = Date.now();
      const distance = liveStartDate - now;
      if (distance < 0) {
        // 종료 된 상태
        intervalTime.current = null;
      } else {
        setTimer(handleGetDDayValue(liveStartDate, now));
      }
    }, intervalTime.current);

    // 라이브 시간정보 텍스트 - 1. 당일이 아닌 경우 : 'M월 D일(요일) 오전/오후 H시'  2. 당일인 경우 '오늘 오전/오후 H시'
    const liveTimeText = useMemo(() => {
      const day = `${format(liveStartDate, 'M월 d일(EEE)', { locale: ko })}`;
      const targetDate = new Date(liveStartDate).getDate();
      const todayDate = new Date().getDate();
      const minutes = new Date(liveStartDate).getMinutes();
      const time = `${remainDay <= 0 && targetDate === todayDate ? '오늘' : day} ${format(
        liveStartDate,
        minutes ? 'a h시 m분' : 'a h시',
        {
          locale: ko,
        },
      )}`;
      return time;
    }, [liveStartDate, remainDay]);

    /**
     * 슬라이드 애니메이션 시작시
     */
    const handleSlideMoveStart = useCallback((swiper: Swiper) => {
      slideActiveIndex.current = swiper.realIndex;
      setIsSlideMask(true);
    }, []);

    /**
     * 슬라이드 애니메이션 종료시
     */
    const handleSlideMoveEnd = useCallback(() => {
      setIsSlideMask(false);
    }, []);

    /**
     * 슬라이드 자동 재생 처
     */
    const handleAutoPlaySlide = useCallback((isStart: boolean) => {
      if (!swp.current) return;

      if (isStart) {
        swp.current.autoplay.start();
      } else {
        swp.current.autoplay.stop();
      }
    }, []);

    const slideOptions = useRef<SwiperContainerProps>({
      loop: true,
      speed: 600,
      autoplay: followed
        ? false
        : {
            delay: slideDelay,
          },
      allowTouchMove: false,
      observer: true,
      onSwiper: (swiper: Swiper) => {
        swp.current = swiper;
      },
      onSlideNextTransitionStart: handleSlideMoveStart,
      onSlideChangeTransitionEnd: handleSlideMoveEnd,
    });

    /**
     * 라이브 중 상태 전환 모션 종료시
     */
    const handleAnimationEndForStatusChanging = useCallback(() => {
      if (liveWrapperEl.current) {
        // 라이브 정보 영역은 미노출
        liveWrapperEl.current.style.display = 'none';
      }
    }, []);

    /**
     * 이퀄라이즈 로띠 마지막 프레임 도달시 특정 프레임 내 반복 처리
     */
    const handleEndLottiePlayer = useCallback(() => {
      if (lottieRef.current && lottieRef.current.player) {
        const { player } = lottieRef.current;
        player.goToAndPlay(500);
      }
    }, []);

    /** 이퀄라이저 로띠 재생 */
    const handleAddEventPlayer = useCallback(() => {
      if (lottieRef.current && lottieRef.current.player) {
        const { player } = lottieRef.current;
        player.addEventListener('complete', handleEndLottiePlayer);
        player.play();
      }
    }, [handleEndLottiePlayer]);

    useEffect(() => {
      if (direction === FloatingDirectionStatus.DOWN) {
        handleAutoPlaySlide(false);
      } else if (!followed) {
        // 라이브 플로팅 노출시, 팔로우 상태가 아니면 문구 슬라이딩 처리
        handleAutoPlaySlide(true);
      }
    }, [direction, followed, handleAutoPlaySlide]);

    useEffect(() => {
      if (initInitLive) {
        onChangeLiveStatus?.(id);
        handleAddEventPlayer();
        return;
      }

      if (isEnd) {
        // 라이브 전 -> 라이브 중 상태로 변경시 라이브이동버튼 영역 활성화
        if (btnWrapperRef.current) {
          btnWrapperRef.current.addEventListener('animationend', handleAnimationEndForStatusChanging);
        }
        handleAutoPlaySlide(false);
        setIsChanged(true);
        onChangeLiveStatus?.(id);
        handleAddEventPlayer();
      }
    }, [
      handleAddEventPlayer,
      handleAnimationEndForStatusChanging,
      handleAutoPlaySlide,
      id,
      initInitLive,
      isEnd,
      onChangeLiveStatus,
    ]);

    /**
     * 팔로우로 상태 변경시
     */
    useEffect(() => {
      if (followed) {
        handleAutoPlaySlide(false);
        if (slideActiveIndex.current !== 1) return;
        setTimeout(() => {
          // 팔로우 문구 노출 되지 않도록 처리
          swp.current?.slideNext();
        }, 1000);
      }
    }, [followed, handleAutoPlaySlide]);

    useEffect(() => {
      if (snackbarDisplayStatus === FloatingStatus.HIDE) {
        handleAutoPlaySlide(false);
      }
    }, [handleAutoPlaySlide, snackbarDisplayStatus]);

    useEffect(() => {
      const btnWrapperEl = btnWrapperRef.current;
      const lottiePlayer = lottieRef.current?.player;

      return () => {
        if (btnWrapperEl) {
          btnWrapperEl.removeEventListener('animationend', handleAnimationEndForStatusChanging);
        }
        if (lottiePlayer) {
          lottiePlayer.removeEventListener('complete', handleEndLottiePlayer);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className={classNames(className, {
          'is-ios': isIOS,
          'is-ready': !initInitLive,
          'is-changed': isChanged,
        })}
        ref={ref}
      >
        {!initInitLive && (
          <div className="live-wrapper" ref={liveWrapperEl}>
            <div className="live-box">
              <div className="count">{timer}</div>
              <div className="text-wrapper">
                <div
                  className={classNames('slider', {
                    'is-mask': isSlideMask,
                  })}
                >
                  <SwiperContainer {...slideOptions.current}>
                    <SwiperSlide>
                      <span className="text">
                        <span className="bold">LIVE</span>
                        <span>{liveTimeText}</span>
                      </span>
                    </SwiperSlide>
                    <SwiperSlide>
                      <span className="text">
                        <span>팔로우하고 라이브 알림을 받아보세요</span>
                      </span>
                    </SwiperSlide>
                  </SwiperContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="btn-wrapper" ref={btnWrapperRef}>
          <Action className="live-box" is="a" link={liveLink} onClick={onLiveLink}>
            <Equalizer
              ref={lottieRef}
              width="1.8rem"
              height="1.8rem"
              animationOptions={{ loop: false, autoplay: false }}
            />
            <span className="text">LIVE 보러가기</span>
          </Action>
        </div>
        <span className="divider" />
      </div>
    );
  },
);
export const FloatingLive = styled(FloatingLiveComponent)`
  @keyframes disappearAnimation {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes appearAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  position: relative;
  height: 6.4rem;
  color: ${({ theme }) => theme.color.white};

  // 구분선
  & .divider {
    display: block;
    position: absolute;
    bottom: 0;
    left: 1.6rem;
    right: 1.6rem;
    height: 0.1rem;
    background-color: ${({ theme }) => (!theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')};

    opacity: 0;
  }

  ${Equalizer} *[fill] {
    fill: ${({ theme }) => theme.color.white};
  }

  ${Equalizer} *[stroke] {
    stroke: ${({ theme }) => theme.color.white};
  }

  & .live-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .live-wrapper {
    & .live-box {
      flex-direction: column;
      padding: 1.2rem 1.6rem;

      & .count {
        font: ${({ theme }) => theme.content.contentStyle.fontType.title2B};
        color: ${({ theme }) => theme.color.white};
      }
    }
    & .text-wrapper {
      margin-top: 0.2rem;
      width: 22rem;
      height: 100%;
    }
    & .slider {
      height: 100%;
      &.is-mask {
        mask-image: linear-gradient(
          270deg,
          transparent 0px,
          rgba(0, 0, 0, 1) 2.4rem,
          rgba(0, 0, 0, 1) calc(100% - 2.4rem),
          transparent 100%
        );
      }
      ${SwiperContainer} {
        height: 100%;
        & .swiper,
        .swiper-wrapper,
        .swiper-slide {
          height: 100%;
        }
      }

      & .text {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
  }

  & .btn-wrapper {
    & .live-box {
      & .text {
        font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
        margin-left: ${({ theme }) => theme.spacing.s8};
      }

      &:active::before {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => (!theme.isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)')};
        content: '';
      }
    }
  }

  & .text {
    font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
    color: ${({ theme }) => theme.color.white};
    & .bold {
      margin-right: 0.8rem;
      font: ${({ theme }) => theme.content.contentStyle.fontType.miniB};
    }
  }

  &.is-ready {
    & .live-wrapper {
      display: block;
    }
    & .btn-wrapper {
      display: none;
    }
  }

  &.is-changed {
    & .live-wrapper {
      animation: disappearAnimation 0.3s forwards;
    }
    & .btn-wrapper {
      display: block;
      opacity: 0;
      animation: appearAnimation 0.3s 0.3s forwards;
    }
  }

  &.is-ios {
    color: ${({ theme }) => theme.color.whiteLight};
    // 구분선
    & .divider {
      background-color: rgba(255, 255, 255, 0.1);
    }

    & .live-wrapper > .live-box > .count {
      color: ${({ theme }) => theme.color.whiteLight};
    }
    & .text {
      color: ${({ theme }) => theme.color.whiteLight};
    }

    ${Equalizer} *[fill] {
      fill: ${({ theme }) => theme.color.whiteLight};
    }

    ${Equalizer} *[stroke] {
      stroke: ${({ theme }) => theme.color.whiteLight};
    }

    & .btn-wrapper {
      & .live-box {
        font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};

        & .text {
          margin-left: ${({ theme }) => theme.spacing.s8};
        }

        &:active::before {
          background: rgba(0, 0, 0, 0.03);
        }
      }
    }
  }
`;
