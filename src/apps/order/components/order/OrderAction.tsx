import styled from 'styled-components';
import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import { Button, ButtonProps } from '@pui/button';
import { UniversalLinkTypes } from '@constants/link';
import { OrderModel } from '../../models';
import { useExpiredDate } from '../../hooks';
import { ActionType, Navigation } from '../../constants';

type ButtonVariant = ValueOf<Pick<ButtonProps, 'variant'>>;

export interface OrderActionProps {
  action: OrderModel['action'];
  onNavigate: (link: UniversalLinkTypes) => void;
}

export const OrderAction = ({ action, onNavigate }: OrderActionProps) => {
  const navigateToHome = useCallback(() => {
    onNavigate(UniversalLinkTypes.HOME);
  }, [onNavigate]);

  const navigateToOrders = useCallback(() => {
    onNavigate(UniversalLinkTypes.ORDER_DETAIL);
  }, [onNavigate]);

  if (action.type === ActionType.AIRLINE_TICKET) {
    return <AirlineTicketActionButtonStyled expiryDate={action.expiryDate} onClick={navigateToOrders} />;
  }

  if (action.type === ActionType.NOT_ADDRESS) {
    const props: ButtonVariant[] = ['secondary', 'primary'];
    const variants = props.slice(action.list.length * -1);

    return (
      <ButtonGroupStyled className="button-group">
        {action.list.map((item, index) => {
          const variant = variants[index];

          switch (item) {
            case Navigation.TICKET_DETAIL:
              return (
                <Button key={item} variant={variant} size="large" onClick={navigateToOrders} bold block>
                  예약 상세
                </Button>
              );
            case Navigation.HOME:
              return (
                <Button key={item} variant={variant} size="large" onClick={navigateToHome} bold block>
                  홈으로 이동
                </Button>
              );
            default:
              return null;
          }
        })}
      </ButtonGroupStyled>
    );
  }

  return (
    <ButtonGroupStyled className="button-group">
      <Button variant="secondary" size="large" onClick={navigateToOrders} bold block>
        주문 상세
      </Button>
      <Button variant="primary" size="large" onClick={navigateToHome} bold block>
        홈으로 이동
      </Button>
    </ButtonGroupStyled>
  );
};

type ButtonGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'css'>;

const ButtonGroup = styled(
  React.forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {
    return <div ref={ref} {...props} />;
  }),
)`
  display: flex;
  & > ${Button} {
    margin: 0 0.4rem;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  position: fixed;
  padding: 2.4rem 2.4rem;
  width: 100%;
  z-index: 1;
  bottom: env(safe-area-inset-bottom);
`;

interface AirlineTicketActionButtonProps extends HTMLAttributes<HTMLDivElement> {
  expiryDate: number;
  onClick: () => void;
}

const AirlineTicketActionButton = ({ expiryDate, onClick, ...rest }: AirlineTicketActionButtonProps) => {
  const buttonGroupRef = useRef<HTMLDivElement | null>(null);
  const expiryDateMS = expiryDate || -1;
  const { dateText } = useExpiredDate(expiryDateMS);

  useEffect(() => {
    setTimeout(() => {
      if (buttonGroupRef.current) {
        buttonGroupRef.current.classList.add('active');
      }
    }, 200);
  }, []);

  return (
    <div {...rest} ref={buttonGroupRef}>
      <div className="mask-field" />
      <div className="button-group">
        <div className="info">
          입력 기한 <span className="date">{dateText}</span>
        </div>
        <Button variant="primary" size="large" onClick={onClick} bold block>
          탑승자 정보 입력
        </Button>
      </div>
    </div>
  );
};

const AirlineTicketActionButtonStyled = styled(AirlineTicketActionButton)`
  position: fixed;
  width: 100%;
  z-index: 1;
  transform: translateY(calc(100% + 2.4rem));
  bottom: 0;

  & .mask-field {
    padding: ${({ theme }) => theme.spacing.s16} 0;
    background: ${({ theme }) =>
      `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.whiteVariant1} 100%)`};
  }

  & .button-group {
    padding: 0 ${({ theme }) => theme.spacing.s24};
    padding-bottom: calc(2.4rem + env(safe-area-inset-bottom));
    background: ${({ theme }) => theme.color.whiteVariant1};
    height: 100%;
  }

  & .info {
    text-align: center;
    padding: 0.9rem 0;
    font: ${({ theme }) => theme.fontType.miniB};
    color: ${({ theme }) => theme.color.text.textPrimary};

    & .date {
      color: ${({ theme }) => theme.color.semantic.noti};
    }
  }

  &.active {
    transform: translateY(0%);
    transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  }
`;
