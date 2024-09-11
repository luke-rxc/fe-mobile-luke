import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { BrandListItemLarge, BrandListItemLargeProps } from '@features/showroom/components';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { RichText, RichTextProps } from './common';
import { getColor } from '../utils';
import { Showroom } from '../types';

export interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 쇼룸 프로필 정보 */
  profileInfo: BrandListItemLargeProps;
  /** 쇼룸 설명 */
  description?: string;
  /** 쇼룸 타입 */
  type?: Showroom;
  /** 쇼룸 팔로우 클릭 이벤트 콜백 */
  onClickFollow?: BrandListItemLargeProps['onClickFollow'];
  /** 쇼룸 프로필 클릭 이벤트 콜백 */
  onClickProfileLink?: BrandListItemLargeProps['onClickProfileLink'];
  /** 쇼룸 설명글의 링크요소 클릭 이벤트 콜백 */
  onClickDescriptionLink?: RichTextProps['onClickLink'];
}

/**
 * Profile 컴포넌트
 */
export const Profile = styled(
  forwardRef<HTMLDivElement, ProfileProps>(
    ({ profileInfo, description, type, onClickFollow, onClickProfileLink, onClickDescriptionLink, ...props }, ref) => {
      return (
        <div ref={ref} {...props}>
          <BrandListItemLarge {...{ ...profileInfo, onClickFollow, onClickProfileLink }} />

          {description && <RichText text={description} onClickLink={onClickDescriptionLink} />}
        </div>
      );
    },
  ),
)`
  ${BrandListItemLarge} {
    .brand-info {
      .title {
        color: ${getColor('contentColor')};
      }

      ${Button} {
        &.is-selected {
          background: ${({ theme }) => theme.color.dimmed};
          color: ${({ theme }) => theme.color.tint};
        }
        &:not(.is-selected) {
          background: ${getColor('tintColor')};
          color: ${getColor('textColor')};
        }
      }
    }
  }

  ${RichText} {
    padding: 1.2rem 2.4rem 2.4rem;
    font: ${({ theme }) => theme.fontType.t15};

    ${Action} {
      color: ${getColor('tintColor')};
      text-decoration: underline;
    }
  }
`;
