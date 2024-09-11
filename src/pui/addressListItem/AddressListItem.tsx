import { forwardRef } from 'react';
import styled from 'styled-components';
import { phoneNumberToString } from '@features/delivery/utils';
import { ListItemSelect } from '@pui/listItemSelect';

export interface AddressListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'onSelect'> {
  /** 배송지 id */
  id: number;
  /** 받는 사람 */
  name: string;
  /** 연락처 */
  phone: string;
  /** 우편번호 */
  postCode: string;
  /** 주소 */
  address: string;
  /** 상세 주소 */
  addressDetail: string;
  /** 배송지 이름 */
  addressName?: string;
  /** 기본 주소지 여부 */
  defaultAddress?: boolean;
  /** 선택 기능 제공 여부 */
  selectable?: boolean;
  /** 배송지 선택 여부 기본값 */
  defaultChecked?: boolean;
  /** 배송지 선택 여부 */
  checked?: boolean;
  /** 배송지 항목 우측 커스터마이징 */
  suffix?: React.ReactNode;
  /** 배송지 선택 이벤트 핸들러 */
  onSelect?: (
    delivery: {
      id: number;
      name: string;
      phone: string;
      addressName: string;
      postCode: string;
      address: string;
      addressDetail: string;
      defaultAddress?: boolean;
    },
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

const AddressListItemComponent = forwardRef<HTMLDivElement, AddressListItemProps>(
  (
    {
      id,
      name,
      phone,
      addressName = '',
      postCode,
      address,
      addressDetail,
      selectable = false,
      defaultAddress,
      defaultChecked,
      checked,
      suffix,
      className,
      onSelect,
      ...rest
    },
    ref,
  ) => {
    const phoneNumberString = phoneNumberToString(phone);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelect?.(
        {
          id,
          name,
          phone,
          addressName,
          postCode,
          address,
          addressDetail,
          defaultAddress,
        },
        e,
      );
    };

    return (
      <div {...rest} ref={ref} className={className}>
        <ListItemSelect
          is="div"
          type="radio"
          className="delivery-content"
          checked={checked}
          selectable={selectable}
          defaultChecked={defaultChecked}
          suffix={suffix && <div className="suffix-wrapper">{suffix}</div>}
          onChange={handleSelect}
        >
          {defaultAddress && (
            <span className="delivery-badges">
              <span className="badge">기본</span>
            </span>
          )}
          <span className="delivery-address">
            {address} {addressDetail}
          </span>
          <span className="delivery-user">
            {name}
            <span className="divider" />
            {phoneNumberString}
          </span>
        </ListItemSelect>
      </div>
    );
  },
);

/**
 * Figma AddressListItem 컴포넌트
 */
export const AddressListItem = styled(AddressListItemComponent)`
  position: relative;

  .delivery-content {
    & .delivery-badges,
    & .delivery-address,
    & .delivery-user {
      word-break: break-word;
      margin-top: ${({ theme }) => theme.spacing.s4};

      &:first-child {
        margin-top: ${({ selectable }) => (selectable ? '0.8rem' : '0')};
      }
    }

    .delivery-badges {
      display: block;

      .badge {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0.3rem 0.6rem;
        font: ${({ theme }) => theme.fontType.microB};
        border-radius: 5rem;
        background: ${({ theme }) => theme.color.brand.tint3};
        color: ${({ theme }) => theme.color.brand.tint};
        line-height: 1.2rem;
        text-align: center;
      }
    }

    .delivery-address {
      display: block;
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .delivery-user {
      display: flex;
      align-items: center;
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};

      .divider {
        display: inline-block;
        height: 1.2rem;
        width: 0.1rem;
        margin: 0 ${({ theme }) => theme.spacing.s8};
        background: ${({ theme }) => theme.color.backgroundLayout.line};
      }
    }
  }
`;
