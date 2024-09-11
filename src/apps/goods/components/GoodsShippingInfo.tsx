import React from 'react';
import styled from 'styled-components';
import { GoodsModel } from '../models';

interface Props {
  shippingInfo: GoodsModel['shipping'];
}

export const GoodsShippingInfo: React.FC<Props> = ({ shippingInfo }) => {
  const { shippingPriceText, shippingDisplayText, jejuAddCostInfoDisplayText, exportingDisplay, exportingDisplayText } =
    shippingInfo ?? {};

  return (
    <Wrapper>
      <p className="price">{shippingPriceText ?? ''}</p>
      {shippingDisplayText && (
        <p className="display shipping">
          <span>{shippingDisplayText}</span>
        </p>
      )}
      <div className="display extra-cost">{jejuAddCostInfoDisplayText && <p>{jejuAddCostInfoDisplayText}</p>}</div>
      {exportingDisplay && <p className="export-date">{exportingDisplayText}</p>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font: ${({ theme }) => theme.fontType.medium};

  & .price {
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.medium};
  }

  & .display {
    color: ${({ theme }) => theme.color.text.textTertiary};
  }

  & .shipping {
    margin-top: 0.2rem;
  }

  & .extra-cost {
    margin-top: 0.2rem;
  }

  .export-date {
    color: ${({ theme }) => theme.color.text.textPrimary};
    margin-top: ${({ theme }) => theme.spacing.s12};
  }
`;
