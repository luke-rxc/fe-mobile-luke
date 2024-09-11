import { createElement } from 'react';
import type { HTMLAttributes } from 'react';
import { Radio } from '@pui/radio';
import styled from 'styled-components';
import { DeliveryModel } from '../models';

interface Props {
  id: number;
  name: string;
  phone: string;
  addressName: string;
  postCode: string;
  address: string;
  addressDetail: string;
  isDefault?: boolean;
  className?: string;
  selectable?: boolean;
  onSelect?: (delivery: DeliveryModel) => void;
  suffix?: React.ReactNode;
  checked?: boolean;
}

interface StyleProps {
  selectable: Props['selectable'];
}

interface DeliveryContentProps extends Omit<HTMLAttributes<HTMLElement>, 'css'> {
  selectable: Props['selectable'];
}

const DeliveryContent = ({ id, selectable, ...props }: DeliveryContentProps) => {
  return selectable ? createElement('label', { htmlFor: id, ...props }) : createElement('div', { id, ...props });
};

export const DeliveryItem = ({
  id,
  name,
  phone,
  addressName,
  postCode,
  address,
  addressDetail,
  selectable = false,
  isDefault = false,
  checked = false,
  suffix,
  className,
  onSelect,
}: Props) => {
  const styleProps: StyleProps = {
    selectable,
  };

  function handleSelect() {
    onSelect?.({
      id,
      name,
      phone,
      addressName,
      postCode,
      address,
      addressDetail,
      isDefault,
    });
  }

  return (
    <ContainerStyled className={className} {...styleProps}>
      {selectable && (
        <div className="delivery-radio-wrapper">
          <Radio id={String(id)} checked={checked} name="delivery" className="delivery-radio" onChange={handleSelect} />
        </div>
      )}
      <DeliveryContent id={String(id)} selectable={selectable} className="delivery-content">
        {isDefault && (
          <span className="badge-wrapper">
            <span className="badge">기본</span>
          </span>
        )}
        <span className="delivery-address">
          {address} {addressDetail}
        </span>
        <span className="delivery-user">
          {name}
          <span className="divider" />
          {phone}
        </span>
      </DeliveryContent>
      {suffix && <div className="suffix-wrapper">{suffix}</div>}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div<StyleProps>`
  position: relative;
  display: flex;
  justify-content: center;
  padding: ${({ selectable }) => (selectable ? '1.2rem 1.6rem' : '1.6rem 1.6rem 1.6rem 2.4rem')};

  .divider {
    display: inline-flex;
    height: 1rem;
    width: 0.1rem;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
    background: ${({ theme }) => theme.color.backgroundLayout.line};
  }

  & .delivery-radio-wrapper {
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    border-radius: ${({ theme }) => theme.radius.r8};

    & .delivery-radio {
      width: 4rem;
    }
  }

  & .delivery-content {
    display: inline-flex;
    flex-basis: 100%;
    flex-shrink: 1;
    flex-direction: column;
    margin-left: ${({ selectable }) => (selectable ? '0.8rem' : '0')};

    & > span {
      word-break: break-word;
      &:first-child {
        margin-top: ${({ selectable }) => (selectable ? '0.8rem' : '0')};
      }

      margin-top: ${({ theme }) => theme.spacing.s4};
    }

    & .delivery-address {
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    & .delivery-user {
      display: flex;
      align-items: center;
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  & .badge-wrapper {
    display: inline-flex;

    & .badge {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0.3rem 0.6rem;
      font: ${({ theme }) => theme.fontType.microB};
      border-radius: 5rem;
      background: ${({ theme }) => theme.color.tint3};
      color: ${({ theme }) => theme.color.tint};
      line-height: 1.2rem;
      text-align: center;
    }
  }

  & .suffix-wrapper {
    margin-left: 0.8rem;
    align-items: center;
    display: inline-flex;
  }
`;
