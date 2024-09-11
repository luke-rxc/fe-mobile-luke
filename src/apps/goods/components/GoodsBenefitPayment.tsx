import { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { CollapseMoreSection } from '@features/collapse/components';
import { COLLAPSE_CONTENT_LINE_HEIGHT } from '@features/collapse/constants';
import { GoodsModel } from '../models';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  benefitPayment: GoodsModel['benefitPayment'];
  onExpandView: () => void;
}

const GoodsBenefitPaymentComponent = ({ benefitPayment, onExpandView, className, ...props }: Props) => {
  const { payment } = benefitPayment ?? {};

  const [expanded, setExpanded] = useState<boolean>(payment?.length === 1);

  const expanderMaxLine = 2;
  const spacing = 2;

  const collapsedHeight = COLLAPSE_CONTENT_LINE_HEIGHT * expanderMaxLine + spacing;
  const handleExpandView = () => {
    if (expanded) {
      return;
    }
    setExpanded(true);
    onExpandView();
  };

  return (
    <CollapseMoreSection
      className={className}
      expanded={expanded}
      expanderMaxLine={expanderMaxLine}
      collapseOptions={{ collapsedHeight }}
      onExpandView={handleExpandView}
      {...props}
    >
      {payment &&
        payment.map(({ title, content }) => (
          <div key={uuid()} className="payment-content">
            <p className="payment-title">{title}</p>
            <p className="payment-content">{content}</p>
          </div>
        ))}
    </CollapseMoreSection>
  );
};

export const GoodsBenefitPayment = styled(GoodsBenefitPaymentComponent)`
  .payment-content + .payment-content {
    margin-top: 1.2rem;
  }

  .payment-title {
    color: ${({ theme }) => theme.color.text.textPrimary};
    padding-bottom: 0.2rem;
  }

  .payment-content {
    color: ${({ theme }) => theme.color.text.textTertiary};
  }
`;
