import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { UniversalLinkTypes } from '@constants/link/universalLink';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { Conditional } from '@pui/conditional';
import { Profiles, ProfilesProps } from '@pui/profiles';

export interface BrandCardProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 브랜드명 */
  title: string;
  /**
   * 쇼룸 ID
   * 해당 props가 컴포넌트 내부에서는 사용되지 않지만
   * 목록형태에서 key로 사용하고자하는 니즈가 있어 v1과 동일하게 유지
   */
  showroomId: number;
  /** 쇼룸 CODE */
  showroomCode: string;
  /** 브랜드 이미지 URL */
  imageURL: string;
  /**
   * @default medium
   */
  size?: 'small' | 'medium';
  /** 라이브 방송중 여부 */
  onAir?: boolean;
  /** 라이브 아이디 */
  liveId?: number;
  /** 브랜드 설명 */
  description?: string;
  /** 알림신청 여부 */
  followed?: boolean;
  /** 로띠 색상 */
  mainColorCode?: string;
  /** 팔로우 팔로잉 비활성화 */
  disabledFollow?: boolean;
  /** 팔로우신청or해지시 실행할 콜백(현재 팔로우 상태를 파라미터로 전달함) */
  onChangeFollow?: (follow: boolean, item: BrandCardProps) => void;
  /** 쇼룸 링크 클릭 */
  onClickShowroomLink?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** 라이브 링크 클릭 */
  onClickLiveLink?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const BrandCardComponent = forwardRef<HTMLSpanElement, BrandCardProps>((props, ref) => {
  const {
    title,
    showroomId,
    showroomCode,
    imageURL,
    size = 'medium',
    onAir = false,
    liveId = 0,
    followed = false,
    description,
    mainColorCode,
    disabledFollow,
    className,
    onChangeFollow,
    onClickShowroomLink: handleClickShowroomLink,
    onClickLiveLink: handleClickLiveLink,
    ...rest
  } = props;

  const { getLink } = useLink();
  const showFollow = size === 'medium' && !disabledFollow;
  const liveLink = getLink(UniversalLinkTypes.LIVE, { liveId });
  const showroomLink = getLink(UniversalLinkTypes.SHOWROOM, { showroomCode });

  const profileProps: ProfilesProps = {
    liveId,
    showroomCode,
    image: { src: imageURL },
    size: size === 'medium' ? 128 : 88,
    status: onAir ? 'live' : 'none',
    disabledLink: true,
    colorCode: mainColorCode,
  };

  const handleChangeFollow = () => {
    onChangeFollow?.(followed, props);
  };

  return (
    <span ref={ref} className={classnames(className, `is-${size}`)} {...rest}>
      <Conditional
        className="brand-inner"
        condition={onAir}
        trueExp={<span />}
        falseExp={<Action is="a" link={showroomLink} onClick={handleClickShowroomLink} />}
      >
        <Conditional
          className="brand-thumb"
          condition={onAir}
          trueExp={<Action is="a" link={liveLink} onClick={handleClickLiveLink} />}
          falseExp={<span />}
        >
          <Profiles {...profileProps} />
        </Conditional>

        <Conditional
          className="brand-info"
          condition={onAir}
          trueExp={<Action is="a" link={showroomLink} onClick={handleClickShowroomLink} />}
          falseExp={<span />}
        >
          <span className="title">{title}</span>
          {description && <span className="desc">{description}</span>}
        </Conditional>
      </Conditional>

      {showFollow && (
        <span className="brand-follow">
          <Button
            bold
            size="bubble"
            variant="primary"
            selected={followed}
            aria-pressed={followed}
            onClick={handleChangeFollow}
            haptic={!followed && 'tapMedium'}
          >
            {followed ? '팔로잉' : '팔로우'}
          </Button>
        </span>
      )}
    </span>
  );
});

/**
 * Figma BrandCard 컴포넌트
 */
export const BrandCard = styled(BrandCardComponent)`
  display: inline-block;
  position: relative;

  .brand-inner {
    display: block;
    position: relative;

    .brand-thumb {
      transform: scale(1);
      transition: transform 0.2s;
    }

    ${Profiles} .profile {
      :before {
        ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
        z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: ${({ theme }) => theme.color.states.pressedMedia};
        opacity: 0;
        transition: opacity 0.2s;
        content: '';
      }
    }

    &:active {
      .brand-thumb {
        ${({ onAir }) => onAir && 'transform: scale(0.96);'};
      }

      ${Profiles} .profile {
        &:before {
          opacity: 1;
        }
      }
    }
  }

  .brand-thumb {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
  }

  .brand-info {
    display: block;
    text-align: center;

    .title,
    .desc {
      display: block;
      width: 100%;
      ${({ theme }) => theme.mixin.ellipsis()};
    }
    .title {
      color: ${({ theme }) => theme.color.text.textPrimary};
    }
    .desc {
      margin-top: ${({ theme }) => theme.spacing.s2};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  .brand-follow {
    ${({ theme }) => theme.mixin.absolute({ l: '50%' })};
    width: 100%;
    height: 0;
    transform: translate3d(-50%, 0, 0);
    text-align: center;

    ${Button} {
      box-sizing: content-box;
      transform: translateY(-100%) scale(1);

      &:active {
        transform: translateY(-100%) scale(0.96);
      }
    }
  }

  &.is-small {
    .brand-info {
      width: 8.8rem;
      height: 12.8rem;
      padding-top: 8.8rem;
    }
    .title {
      font: ${({ theme }) => theme.fontType.miniB};
    }
    .desc {
      display: none;
    }
  }

  &.is-medium {
    .brand-info {
      width: 12.8rem;
      height: 22.4rem;
      padding-top: 12.8rem;
      .title {
        font: ${({ theme }) => theme.fontType.smallB};
      }
      .desc {
        font: ${({ theme }) => theme.fontType.mini};
      }
    }

    .brand-follow {
      bottom: ${({ description }) => (description ? '2.3rem' : '3.9rem')};
    }
  }
`;
