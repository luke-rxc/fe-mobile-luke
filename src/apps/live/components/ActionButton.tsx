import { Bubble, BubbleFilled, Price, PriceFilled, Schedule, ScheduleFilled, Notice } from '@pui/icon';
import { Button } from '@pui/button';
import styled, { keyframes, useTheme } from 'styled-components';
import { ActionButtonType, ActionButtonTypeIconName } from '../constants';

interface Props {
  buttonType: ActionButtonType;
  activeButtonType: ActionButtonType | undefined;
  className?: string;
  showDot?: boolean;
  onClickAction: (buttonType: ActionButtonType) => (() => void) | undefined;
}

const IconInfo = {
  bubble: Bubble,
  bubbleFilled: BubbleFilled,
  price: Price,
  priceFilled: PriceFilled,
  schedule: Schedule,
  scheduleFilled: ScheduleFilled,
  faq: Notice,
  faqFilled: Notice,
};

export const ActionButton = ({
  buttonType,
  className,
  activeButtonType,
  showDot,
  onClickAction: handleClickAction,
}: Props) => {
  const theme = useTheme();

  const buttonName = `${ActionButtonTypeIconName[buttonType]}${
    buttonType === activeButtonType ? 'Filled' : ''
  }` as keyof typeof IconInfo;
  const IconComponent = IconInfo[buttonName];

  return (
    <ButtonWrapperStyled className={className}>
      <ButtonStyled
        size="small"
        className={showDot ? 'dot' : ''}
        status={buttonType === activeButtonType ? 'active' : ''}
        onClick={handleClickAction(buttonType)}
      >
        <IconComponent name={buttonName} colorCode={theme.light.color.white} />
      </ButtonStyled>
    </ButtonWrapperStyled>
  );
};

const buttonShow = keyframes`
  0% { width: 0 }
  100% { width: 6.4rem }
`;

const buttonShowInner = keyframes`
  0% { transform: scale(0) }
  60% { transform: scale(1.3) }
  100% { transform: scale(1) }
  `;

const buttonHide = keyframes`
  0% { width: 6.4rem }
  100% { width: 0  }
`;

const buttonHideInner = keyframes`
  0% { transform: scale(1) }
  100% { transform: scale(0) }
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.4rem;
  height: 4.8rem;
  overflow: hidden;

  &.showing {
    animation: 0.5s ease-in-out 0s normal forwards ${buttonShow};

    > button {
      animation: 0.5s ease-in-out 0s normal forwards ${buttonShowInner};
    }
  }

  &.hiding {
    width: 0;
    margin: 0;
    animation: 0.3s ease-in-out 0s normal backwards ${buttonHide};

    > button {
      animation: 0.3s ease-in-out 0s normal backwards ${buttonHideInner};
    }
  }

  &.hide {
    width: 0;
    margin: 0;
  }
`;

const ButtonStyled = styled(Button)<{ status: string }>`
  padding-right: 0.4rem !important;
  padding-left: 0.4rem !important;
  background-color: ${({ status, theme }) => (status === 'active' ? theme.light.color.white : 'none')};
  border-radius: 0.8rem;

  &.dot {
    .button-content {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: ${({ theme }) => theme.color.red};
        top: -0.3rem;
        right: -0.3rem;
      }
    }
  }

  ${({ status, theme }) =>
    `& svg *[fill]{ fill: ${status === 'active' ? theme.light.color.black : theme.light.color.white} !important`}
`;
