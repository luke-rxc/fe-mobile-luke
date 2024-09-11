import { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Button } from '@pui/button';
import { toKRW } from '@utils/toKRW';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  option: string;
  selected: boolean;
  disabled: boolean;
  price?: number;
  onClick: () => void;
}

const OptionBubbleComponent = forwardRef<HTMLDivElement, Props>(
  ({ option, selected, disabled, price, onClick: handleClick, className, ...props }, ref) => {
    return (
      <div ref={ref} className={classnames(className, { selected })} {...props}>
        <Button disabled={disabled} onClick={handleClick}>
          {option}
        </Button>
        {!!price && !disabled && <p className="price">{toKRW(price)}</p>}
      </div>
    );
  },
);

export const OptionBubble = styled(OptionBubbleComponent)`
  flex: 0 0 auto;
  min-width: 8.8rem;

  .price {
    width: 100%;
    height: 1.4rem;
    text-align: center;
    font: ${({ theme }) => theme.fontType.micro};
    color: ${({ theme }) => theme.color.text.textHelper};
    margin-top: ${({ theme }) => theme.spacing.s2};
  }

  ${Button} {
    width: 100%;
    height: 4.8rem;
    padding: ${({ theme }) => `0 ${theme.spacing.s16}`};
    border-radius: 24px;
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.text.textTertiary};
    transition: none;

    /** select 시 pressed 효과가 남아 있어 selected 반응이 늦는 것처럼 보이는 이슈로 인해 active css 분리 */
    &:active {
      background-color: ${({ theme }) => theme.color.states.pressedCell};
    }
    &.is-press:active {
      opacity: 1;
    }

    &.is-disabled {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }
  }

  &.selected {
    ${Button} {
      background-color: ${({ theme }) => theme.color.brand.tint};
      font: ${({ theme }) => theme.fontType.smallB};
      color: ${({ theme }) => theme.color.white};
      pointer-events: none;
    }

    .price {
      font: ${({ theme }) => theme.fontType.microB};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }
  }
`;
