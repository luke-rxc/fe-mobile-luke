import React from 'react';
import styled from 'styled-components';
import { GoodsModel } from '../models';

interface Props {
  ticketInfo: GoodsModel['ticket'];
}

export const GoodsTicketInfo: React.FC<Props> = ({ ticketInfo }) => {
  const { usablePeriodText } = ticketInfo ?? {};

  return <Wrapper>{usablePeriodText}</Wrapper>;
};

const Wrapper = styled.div`
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.text.textPrimary};
`;
