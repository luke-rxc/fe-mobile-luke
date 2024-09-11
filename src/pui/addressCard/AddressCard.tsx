import { phoneNumberToString } from '@features/delivery/utils';
import classNames from 'classnames';
import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface AddressCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 받는 사람 */
  name: string;
  /** 연락처 */
  phone: string;
  /** 주소 */
  address: string;
  /** 상세 주소 */
  addressDetail: string;
  /** 활성화 여부 */
  active: boolean;
}

const AddressCardComponent = forwardRef<HTMLDivElement, AddressCardProps>(
  ({ name, phone, address, addressDetail, active, ...rest }, ref) => {
    const className = classNames(rest.className, { active });

    return (
      <div {...rest} ref={ref} className={className}>
        <span className="delivery-address">
          {address} {addressDetail}
        </span>
        <span className="delivery-user">
          <span className="delivery-user-name">{name}</span>
          <span className="delivery-user-phone">{phoneNumberToString(phone)}</span>
        </span>
      </div>
    );
  },
);

/**
 * Figma AddressCard 컴포넌트
 */
export const AddressCard = styled(AddressCardComponent)`
  position: relative;
  max-height: 10.6rem;
  max-width: 24rem;
  height: 10.6rem;
  padding: 1.6rem;
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.text.textTertiary};
  border-radius: ${({ theme }) => theme.radius.r8};
  background: ${({ theme }) => theme.color.background.surface};
  transition: color 250ms;

  .delivery-address {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    height: 5.4rem;
    max-height: 5.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .delivery-user {
    .delivery-user-name,
    .delivery-user-phone {
      display: inline-block;
      font: ${({ theme }) => theme.fontType.mini};
    }
    .delivery-user-name {
      position: relative;
      padding-right: 1.3rem;

      &::after {
        position: absolute;
        top: 50%;
        right: 0.6rem;
        width: 0.1rem;
        height: 1rem;
        transform: translateY(-50%);
        background: ${({ theme }) => theme.color.backgroundLayout.line};
        content: '';
      }
    }
  }

  &::after {
    position: absolute;
    content: '';
    border-radius: ${({ theme }) => theme.radius.r8};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0.1rem solid ${({ theme }) => theme.color.backgroundLayout.line};
    transition: border-color 250ms;
  }

  &.active {
    color: ${({ theme }) => theme.color.text.textPrimary};

    &::after {
      border-color: ${({ theme }) => theme.color.brand.tint};
      opacity: 1;
    }
  }
`;
