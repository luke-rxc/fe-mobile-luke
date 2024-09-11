/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useRef, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useUpdateEffect } from 'react-use';
import { convertHexToRGBA } from '@utils/color';
import { useWebInterface } from '@hooks/useWebInterface';
import { BrandListItemMedium, BrandListItemMediumProps } from '@features/showroom/components';
import { Button } from '@pui/button';
import { List } from '@pui/list';
import { BellFilled, LottieRef } from '@pui/lottie';
import { ToRequired } from '../types';

export type BrandFollowParams = {
  /** 쇼룸 Id */
  id: number;
  /** 쇼룸 코드 */
  code: string;
  /** 쇼룸 이름 */
  name: string;
  /** 변경하고자 하는 팔로우 상태 값 */
  state: boolean;
};

export interface TeaserProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 호스트 쇼룸 정보 */
  host: BrandListItemMediumProps;
  /** 게스트 쇼룸 정보 */
  guests?: BrandListItemMediumProps[];
  /** 라이브 아이디 */
  liveId: number;
  /** 알림 신청 여부 */
  followed: boolean;
  /** 라이브 정보 */
  description?: string;
  /** 호트 쇼룸의 메인 색상 */
  hostMainColorCode?: string;
  /** 호트 쇼룸의 서브 색상 */
  hostSubColorCode?: string;
  /** */
  onClickLiveFollow?: () => void;
  /** */
  onClickBrandFollow?: (params: BrandFollowParams) => void;
}

/**
 * Teaser modal template 컴포넌트
 */
export const Teaser = styled(
  ({
    host,
    guests,
    liveId,
    followed,
    description,
    hostMainColorCode,
    hostSubColorCode,
    onClickLiveFollow,
    onClickBrandFollow,
    ...props
  }: TeaserProps) => {
    const cta = useRef<HTMLDivElement>(null);
    const lottie = useRef<LottieRef>(null);
    const [bottomSafeArea, setBottomSafeArea] = useState<number>(0);

    const { subscribeSchedule } = useWebInterface();
    const [follow, setFollow] = useState(followed ?? false);

    /**
     * 라이브 알림 신청/해제 이벤트 핸들러
     */
    const handleClickLiveFollow = () => {
      onClickLiveFollow?.();
    };

    /**
     * 쇼룸 팔로우/언팔로우 이벤트 핸들러
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleClickBrandFollow = (params: Parameters<ToRequired<BrandListItemMediumProps>['onClickFollow']>[0]) => {
      // onClickBrandFollow?.();
      const { id, code, name, follow: brandFollow } = params;
      onClickBrandFollow?.({ id, code, name, state: !brandFollow });
    };

    /**
     * 초기 세팅
     */
    useLayoutEffect(() => {
      const player = lottie.current?.player;
      // 로띠 설정
      player?.goToAndStop(followed ? 60 : 0, true);
      // CTA 버튼의 높이 값만큼 콘텐츠 영역 하단에 padding 적용
      cta.current && setBottomSafeArea(cta.current.offsetHeight);
    }, []);

    /**
     * 알림신청/해제상태 Sync
     */
    useUpdateEffect(() => {
      setFollow((prev) => followed ?? prev);
    }, [followed]);

    /**
     * 알림신청/해제상태 Sync
     */
    useUpdateEffect(() => {
      if (!subscribeSchedule || !liveId) {
        return;
      }

      if (subscribeSchedule.type === 'live' && subscribeSchedule.id === liveId) {
        subscribeSchedule && setFollow(subscribeSchedule.isFollowed);
      }
    }, [subscribeSchedule]);

    /**
     * 알림 신청 상태값 변경에 따른 로띠 제어
     */
    useUpdateEffect(() => {
      const player = lottie.current?.player;

      if (player) {
        follow ? player.goToAndPlay(0) : player.goToAndStop(0);
      }
    }, [follow]);

    return (
      <div {...props}>
        <div className="teaser-content" style={{ paddingBottom: bottomSafeArea }}>
          <List
            is="div"
            className="brand-list"
            source={guests}
            component={BrandListItemMedium}
            getHandlers={() => ({ onClickFollow: handleClickBrandFollow })}
          >
            <BrandListItemMedium
              {...host}
              onClickFollow={handleClickBrandFollow}
              description={<span className="badge-host" children="host" />}
            />
          </List>

          {description && <div className="description">{description}</div>}
        </div>

        <div ref={cta} className="teaser-cta">
          <Button
            bold
            block
            size="large"
            variant="primary"
            selected={follow}
            suffix={<BellFilled ref={lottie} animationOptions={{ loop: false, autoplay: false }} />}
            onClick={handleClickLiveFollow}
          >
            {follow ? '알림 받는 중' : '알림 신청'}
          </Button>
        </div>
      </div>
    );
  },
)`
  position: relative;
  box-sizing: border-box;

  .teaser-content {
    position: relative;

    .brand-list {
      .badge-host {
        ${({ theme }) => theme.mixin.centerItem(true)};
        height: 1.8rem;
        padding: 0 0.6rem;
        border-radius: 5rem;
        background: ${({ theme, hostMainColorCode }) => hostMainColorCode || theme.color.tint};
        color: ${({ theme, hostSubColorCode }) => hostSubColorCode || theme.color.surface};
        font: ${({ theme }) => theme.fontType.t10B};
      }
    }

    .description {
      padding: 1.2rem 2.4rem 2.4rem;
      font: ${({ theme }) => theme.fontType.t15};
      white-space: pre-line;
    }
  }

  .teaser-cta {
    ${({ theme }) => theme.mixin.fixed({ b: 0, l: 0 })};
    width: 100%;
    padding: 0 2.4rem 2.4rem;
    ${({ theme }) => theme.mixin.safeArea('padding-bottom', 24)};
    background: ${({ theme }) => theme.color.surface};

    ${BellFilled} {
      width: 1.8rem;
      height: 1.8rem;
    }

    & *[fill] {
      fill: currentColor;
    }
    & *[stroke] {
      stroke: currentColor;
    }

    &:after {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      width: 100%;
      height: 3.4rem;
      transform: translateY(-100%);
      opacity: 1;
      content: '';
      background: linear-gradient(
        180deg,
        ${({ theme }) => convertHexToRGBA(theme.color.surface, 0)} 0%,
        ${({ theme }) => convertHexToRGBA(theme.color.surface, 1)} 100%
      );
    }
  }
`;
