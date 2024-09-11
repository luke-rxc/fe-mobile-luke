import { forwardRef, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { getImageLink } from '@utils/link';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Image, ImageProps } from '@pui/image';
import * as lotties from '@pui/lottie/lotties';
import { LottiePlayer, LottieRef } from '@pui/lottie';

export type ProfilesProps = Omit<HTMLAttributes<HTMLDivElement>, 'width' | 'height'> & {
  /** showroom 코드 */
  showroomCode: string;
  /** live id */
  liveId: number | null;
  /** 프로필 이미지 정보, loading은 placeholder로 처리(blurhash X) */
  image: Omit<ImageProps, 'radius' | 'width' | 'height' | 'noFallback' | 'fallbackSize' | 'blurHash'>;
  /** 프로필 노출 사이즈 */
  size: 24 | 28 | 40 | 44 | 48 | 56 | 88 | 128 | 144;
  /** 프로필 상태 */
  status?: ProfileStatusType;
  /** @deprecated 로띠 컬러 */
  colorCode?: string;
  /** 링크 비활성 */
  disabledLink?: boolean;
  noResize?: boolean;
};

const ProfilesComponent = forwardRef<HTMLDivElement, ProfilesProps>(
  (
    {
      className,
      showroomCode,
      liveId = null,
      image,
      size,
      status = ProfileStatusType.NONE,
      colorCode,
      disabledLink = false,
      noResize = false,
      ...props
    },
    ref,
  ) => {
    /** 프로필 링크 */
    const { getLink } = useLink();
    const classNames = classnames(className, `status-${status}`, `size-${size}`);
    const profileLink =
      status === ProfileStatusType.LIVE && liveId
        ? getLink(UniversalLinkTypes.LIVE, { liveId })
        : getLink(UniversalLinkTypes.SHOWROOM, { showroomCode });

    /**
     * size88 이상 이미지 리사이즈 타입 : Medium, size88 미만 이미지 리사이즈 타입 : Small
     */
    // eslint-disable-next-line no-nested-ternary
    const resizeWidth = noResize ? undefined : size > 88 ? 512 : 192;
    const { src, ...imageProps } = image;

    /** 프로필 컴포넌트 */
    const lottieName = `Profile${
      // eslint-disable-next-line no-nested-ternary
      status === ProfileStatusType.LIVE ? 'Live' : status === ProfileStatusType.NEW ? 'New' : ''
    }${size}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LottieItem = (lotties as any)[lottieName];

    /** 로띠 영역 */
    const [inView, setInView] = useState(false);
    const callback = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const observer = useRef<IntersectionObserver | null>(null);
    const subscribe = useCallback(
      (element: HTMLElement, options?: IntersectionObserverInit) => {
        if (!observer.current) {
          observer.current = new IntersectionObserver(callback, options);
          observer.current.observe(element);
        }
      },
      [callback],
    );
    const unsubscribe = useCallback(() => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    }, []);
    const sectionRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<LottieRef>(null);
    const lottiePlayer = useRef<LottiePlayer>(null);

    const handleComplete = useCallback(() => {
      if (lottiePlayer.current && status === ProfileStatusType.LIVE) {
        const player = lottiePlayer.current;
        player.goToAndPlay(2000);
      }
    }, [status]);

    const handleAddEventPlayer = useCallback(() => {
      if (lottiePlayer.current) {
        const player = lottiePlayer.current;
        player.addEventListener('complete', handleComplete);
      }
    }, [handleComplete]);

    const handleRemoveEventPlayer = useCallback(() => {
      if (lottieRef.current && lottiePlayer.current) {
        const player = lottiePlayer.current;
        player.removeEventListener('complete', handleComplete);
      }
      lottiePlayer.current?.destroy();
    }, [handleComplete]);

    const activeLink = size !== 24 && size !== 28 && disabledLink === false;

    useEffect(() => {
      if (inView && lottieRef.current) {
        setInView(false);
        unsubscribe();
        const { player } = lottieRef.current;
        lottiePlayer.current = player;
        handleAddEventPlayer();
        player?.play();
      }
    }, [handleAddEventPlayer, inView, unsubscribe]);

    useEffect(() => {
      if (status !== ProfileStatusType.NONE && sectionRef.current) {
        subscribe(sectionRef.current, { threshold: 0.65 });
      }
    }, [sectionRef, status, subscribe]);

    useEffect(() => {
      return () => {
        handleRemoveEventPlayer();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (lottiePlayer.current && liveId && status !== ProfileStatusType.NONE) {
        const player = lottiePlayer.current;
        player.goToAndPlay(0);
      }
    }, [liveId, status]);

    return (
      <div ref={ref} className={classNames} {...props}>
        <div ref={sectionRef}>
          <Conditional
            className="inner"
            condition={activeLink}
            trueExp={<Action link={profileLink} is="a" haptic={status === ProfileStatusType.LIVE && 'tapMedium'} />}
            falseExp={<div />}
          >
            <span className="profile">
              <Image src={`${getImageLink(image?.src ?? '', resizeWidth)}`} radius="50%" noFallback {...imageProps} />
            </span>
            <span className="status">
              {status !== 'none' && <LottieItem ref={lottieRef} animationOptions={{ loop: false, autoplay: false }} />}
            </span>
          </Conditional>
        </div>
      </div>
    );
  },
);

/**
 * Figma 프로필 컴포넌트
 */
export const Profiles = styled(ProfilesComponent)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 0;

  /** press 효과 */
  ${Action} {
    &:before {
      z-index: 1;
      border-radius: 50%;
    }
    &:active {
      transform: scale(0.96);
      transition: transform 0.2s;
      &:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.black};
        opacity: 0.1;
        content: '';
      }
    }
  }

  .profile {
    position: relative;
    display: block;
    box-sizing: border-box;
  }
  .status {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &.size-144 {
    width: 14.4rem;
    height: 14.4rem;
    .status {
      width: 14.4rem;
      height: 14.4rem;
    }
    .profile {
      width: 11.2rem;
      height: 11.2rem;
    }
  }
  &.size-128 {
    width: 12.8rem;
    height: 12.8rem;
    .status {
      width: 12.8rem;
      height: 12.8rem;
    }
    .profile {
      width: 9.6rem;
      height: 9.6rem;
    }
  }
  &.size-88 {
    width: 8.8rem;
    height: 8.8rem;
    .status {
      width: 8.8rem;
      height: 8.8rem;
    }
    .profile {
      width: 6.4rem;
      height: 6.4rem;
    }
  }
  &.size-56 {
    width: 5.6rem;
    height: 5.6rem;
    .status {
      width: 5.6rem;
      height: 5.6rem;
    }
    .profile {
      width: 4rem;
      height: 4rem;
    }
  }
  &.size-48 {
    width: 4.8rem;
    height: 4.8rem;
    .status {
      width: 4.8rem;
      height: 4.8rem;
    }
    .profile {
      width: 3.2rem;
      height: 3.2rem;
    }
  }
  &.size-44 {
    width: 4.4rem;
    height: 4.4rem;
    .status {
      width: 4.4rem;
      height: 4.4rem;
    }
    .profile {
      width: 3.2rem;
      height: 3.2rem;
    }
  }
  &.size-40 {
    width: 4rem;
    height: 4rem;
    .status {
      width: 4rem;
      height: 4rem;
    }
    .profile {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
  &.size-28 {
    width: 2.8rem;
    height: 2.8rem;
    .status {
      width: 2.8rem;
      height: 2.8rem;
    }
    .profile {
      width: 2rem;
      height: 2rem;
    }
  }
  &.size-24 {
    width: 2.4rem;
    height: 2.4rem;
    .status {
      width: 2.4rem;
      height: 2.4rem;
    }
    .profile {
      width: 1.6rem;
      height: 1.6rem;
    }
  }
`;

export const ProfileStatusType = {
  NONE: 'none',
  LIVE: 'live',
  NEW: 'new',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProfileStatusType = typeof ProfileStatusType[keyof typeof ProfileStatusType];
