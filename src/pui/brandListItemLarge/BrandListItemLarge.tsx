import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { Button } from '@pui/button';

export interface BrandListItemLargeProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /** 알림신청 여부 */
  followed?: boolean;
  /** 프로필 링크 사용 여부 */
  disabledProfileLink?: boolean;
  /** 팔로우신청or해지시 실행할 콜백(현재 팔로우 상태를 파라미터로 전달함) */
  onChangeFollow?: (e: React.MouseEvent<HTMLButtonElement>, item: BrandListItemLargeProps) => void;
  /** 프로필 클릭 */
  onClickProfileLink?: (e: React.MouseEvent<HTMLDivElement>, item: BrandListItemLargeProps) => void;
}
const BrandListItemLargeComponent = forwardRef<HTMLDivElement, BrandListItemLargeProps>((props, ref) => {
  const {
    title,
    showroomId,
    showroomCode,
    imageURL,
    onAir = false,
    liveId = 0,
    followed = false,
    disabledProfileLink: disabledLink,
    onChangeFollow,
    onClickProfileLink,
    ...rest
  } = props;

  const profileProps: ProfilesProps = {
    liveId,
    size: 128,
    showroomCode,
    image: { src: imageURL },
    status: onAir ? 'live' : 'none',
    disabledLink,
    onClick: (e) => !disabledLink && onClickProfileLink?.(e, props),
  };

  const handleChangeFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    onChangeFollow?.(e, props);
  };

  return (
    <div ref={ref} {...rest}>
      <div className="brand-inner">
        {/* 브랜드 프로필 */}
        <div className="brand-thumb">
          <Profiles {...profileProps} />
        </div>

        {/* 브랜드 정보 */}
        <div className="brand-info">
          <span className="title">{title}</span>
          <Button
            bold
            size="bubble"
            variant="primary"
            className="follow"
            selected={followed}
            aria-pressed={followed}
            haptic={!followed && 'tapMedium'}
            onClick={handleChangeFollow}
          >
            {followed ? '팔로잉' : '팔로우'}
          </Button>
        </div>
      </div>
    </div>
  );
});

/**
 * BrandListItemLarge 컴포넌트
 * @todo 추후 셀전체에 대한 클릭 이벤트 요청시 셀클릭 기능 추가 필요
 */
export const BrandListItemLarge = styled(BrandListItemLargeComponent)`
  overflow: hidden;
  position: relative;

  .brand-inner {
    display: flex;
    padding: ${({ theme }) => `0 ${theme.spacing.s24} 0 ${theme.spacing.s8}`};
  }

  .brand-thumb {
    ${({ theme }) => theme.mixin.centerItem()};
    flex-shrink: 0;
  }

  .brand-info {
    ${({ theme }) => theme.mixin.centerItem()};
    align-items: flex-start;
    flex-direction: column;
    flex-grow: 1;
    margin-left: ${({ theme }) => theme.spacing.s4};

    .title {
      font: ${({ theme }) => theme.fontType.title2B};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .follow {
      margin-top: ${({ theme }) => theme.spacing.s8};
    }
  }
`;
