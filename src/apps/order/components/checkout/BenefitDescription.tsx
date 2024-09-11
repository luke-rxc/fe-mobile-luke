import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { PaymentType } from '../../models';

export interface BenefitDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  benefitList: PaymentType['benefitList'];
}

export const BenefitDescriptionComponent = ({ benefitList = [], ...rest }: BenefitDescriptionProps) => {
  return (
    <div {...rest}>
      {benefitList.map((item) => {
        return (
          <p className="benefit-description" key={item.content}>
            <>
              {item.title && <span className="title">{item.title}&nbsp;</span>}
              {item.content}
            </>
          </p>
        );
      })}
    </div>
  );
};

export const BenefitDescription = styled(BenefitDescriptionComponent)`
  .benefit-description {
    padding-bottom: 0.4rem;

    & > .title {
      color: ${({ theme }) => theme.color.black};
    }

    &:last-child {
      padding-bottom: 0;
    }
  }
`;
