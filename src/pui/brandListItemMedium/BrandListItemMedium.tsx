import React, { forwardRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { UniversalLinkTypes } from '@constants/link/universalLink';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { Conditional } from '@pui/conditional';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { GoodsCardMini, GoodsCardMiniProps } from '@pui/goodsCardMini';

export interface BrandListItemMediumProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 쇼룸명 */
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
  /** 라이브 방송중 여부 */
  onAir?: boolean;
  /** 라이브 아이디 */
  liveId?: number;
  /** 브랜드 설명 */
  description?: React.ReactNode;
  /** 알림신청 여부 */
  followed?: boolean;
  /** 로띠 색상 */
  mainColorCode?: string;
  /** 팔로우 팔로잉 비활성화 */
  disabledFollow?: boolean;
  /** 브랜드 관련 상품 리스트 */
  goods?: Omit<GoodsCardMiniProps, 'hideInfo'>[];
  /** 팔로우신청or해지시 실행할 콜백(현재 팔로우 상태를 파라미터로 전달함) */
  onChangeFollow?: (follow: boolean, item: BrandListItemMediumProps) => void;
  /** 쇼룸 링크 클릭 */
  onClickShowroomLink?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** 라이브 링크 클릭 */
  onClickLiveLink?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** 상품 리스트 클릭 */
  onClickGoodsList?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    goods: Omit<GoodsCardMiniProps, 'hideInfo'>,
    index: number,
  ) => void;
}

const BrandListItemMediumComponent = forwardRef<HTMLDivElement, BrandListItemMediumProps>((props, ref) => {
  const {
    title,
    showroomId,
    showroomCode,
    imageURL,
    onAir = false,
    liveId = 0,
    description,
    followed = false,
    mainColorCode,
    disabledFollow,
    goods,
    className,
    onChangeFollow,
    onClickShowroomLink: handleClickShowroomLink,
    onClickLiveLink: handleClickLiveLink,
    onClickGoodsList: handleClickGoodsList,
    ...rest
  } = props;
  const { getLink } = useLink();
  const hasGoods = goods && !isEmpty(goods);
  const showroomLink = getLink(UniversalLinkTypes.SHOWROOM, { showroomCode });

  const profileProps: ProfilesProps = {
    liveId,
    size: 88,
    showroomCode,
    image: { src: imageURL },
    status: onAir ? 'live' : 'none',
    disabledLink: !onAir,
    colorCode: mainColorCode,
    ...(onAir && { onClick: handleClickLiveLink }),
  };

  const handleChangeFollow = () => {
    onChangeFollow?.(followed, props);
  };

  return (
    <div ref={ref} className={classnames(className, { 'is-goods': hasGoods })} {...rest}>
      <div className="brand-card">
        <Conditional
          className="brand-inner"
          condition={onAir}
          trueExp={<span />}
          falseExp={<Action is="a" link={showroomLink} onClick={handleClickShowroomLink} />}
        >
          {/* 브랜드 프로필 */}
          <span className="brand-thumb">
            <Profiles {...profileProps} />
          </span>

          {/* 브랜드 정보 */}
          <Conditional
            className="brand-info"
            condition={onAir}
            trueExp={<Action is="a" link={showroomLink} onClick={handleClickShowroomLink} />}
            falseExp={<span />}
          >
            <span className="inner">
              <span className="title">{title}</span>
              {description && <span className="desc">{description}</span>}
            </span>
          </Conditional>
        </Conditional>

        {/* 브랜드 팔로우 버튼 */}
        {!disabledFollow && (
          <span className="brand-follow">
            <Button
              bold
              size="bubble"
              variant="primary"
              selected={followed}
              aria-pressed={followed}
              haptic={!followed && 'tapMedium'}
              onClick={handleChangeFollow}
            >
              {followed ? '팔로잉' : '팔로우'}
            </Button>
          </span>
        )}
      </div>

      {/* 상품 영역 */}
      {hasGoods && (
        <div className="brand-goods">
          {(goods || []).map(({ goodsId, ...item }, index) => (
            <GoodsCardMini
              key={goodsId}
              hideInfo
              goodsId={goodsId}
              onClick={(event) => handleClickGoodsList?.(event, { goodsId, ...item }, index)}
              {...item}
            />
          ))}
        </div>
      )}
    </div>
  );
});

/**
 * figma 브랜드 리스트 아이템(medium) 컴포넌트
 */
export const BrandListItemMedium = styled(BrandListItemMediumComponent)`
  overflow: hidden;
  position: relative;
  width: 100%;

  &.is-goods .brand-info {
    box-sizing: content-box;
    padding-bottom: 11.4rem;
  }

  .brand-card {
    display: block;
    position: relative;
  }

  .brand-inner {
    display: block;
    position: relative;
    width: 100%;
    background: ${({ theme }) => theme.color.background.surface};
    transition: background 0.2s;

    &${Action}:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }

  .brand-thumb {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 12 })};
  }

  .brand-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 8.8rem;
    padding: ${({ disabledFollow }) => `0 ${disabledFollow ? '2.4rem' : '9.9rem'} 0 10.4rem`};
    background: transparent;

    text-align: left;
    transition: background 0.2s;

    &${Action}:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }

    .inner,
    .title,
    .desc {
      display: block;
      width: 100%;
      ${({ theme }) => theme.mixin.ellipsis()};
    }

    .title {
      font: ${({ theme }) => theme.fontType.mediumB};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .desc {
      margin-top: ${({ theme }) => theme.spacing.s4};
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  .brand-follow {
    ${({ theme }) => theme.mixin.absolute({ t: 28, r: theme.spacing.s24 })};

    ${Button} {
      width: 7.1rem;
    }
  }

  // 상품 영역
  .brand-goods {
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0 })};
    width: 100%;
    padding: ${({ theme }) => `0 0 ${theme.spacing.s24} ${theme.spacing.s24}`};
    white-space: nowrap;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }

    ${GoodsCardMini} {
      margin-right: ${({ theme }) => theme.spacing.s8};
      &:last-child {
        margin-right: ${({ theme }) => theme.spacing.s24};
      }
    }
  }
`;
