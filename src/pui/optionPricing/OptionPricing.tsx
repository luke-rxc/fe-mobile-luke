import { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { toKRW } from '@utils/toKRW';

export interface OptionPricingProps extends React.HTMLAttributes<HTMLDivElement> {
  optionInfos: string[];
  price: number;
  runOut: boolean;
}

const OptionPricingComponent = forwardRef<HTMLDivElement, OptionPricingProps>(
  ({ optionInfos, price, runOut, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={classnames(className, { 'is-runout': runOut })} {...rest}>
        <div className="option-infos">
          {optionInfos.map((option) => (
            <p key={option} className="option">
              {option}
            </p>
          ))}
        </div>
        <div className="trailing-area">
          <p className="price">{toKRW(price)}</p>
          {runOut && <p className="runout-label">품절</p>}
        </div>
      </div>
    );
  },
);

export const OptionPricing = styled(OptionPricingComponent)`
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 5.6rem;
  padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24}`};
  color: ${({ theme }) => theme.color.text.textPrimary};

  &.is-runout {
    color: ${({ theme }) => theme.color.text.textDisabled};
  }

  .option-infos {
    flex: auto;

    .option {
      font: ${({ theme }) => theme.fontType.small};
      line-height: 1.7rem;
    }

    .option + .option {
      margin-top: ${({ theme }) => theme.spacing.s4};
    }
  }

  .trailing-area {
    flex-shrink: 0;
    width: 11.2rem;
    text-align: right;

    .price {
      font: ${({ theme }) => theme.fontType.mediumB};
      line-height: 1.8rem;
    }

    .runout-label {
      font: ${({ theme }) => theme.fontType.mini};
      line-height: 1.4rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      margin-top: ${({ theme }) => theme.spacing.s4};
    }
  }
`;
