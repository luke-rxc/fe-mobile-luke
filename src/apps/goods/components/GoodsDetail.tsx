import React from 'react';
import styled from 'styled-components';
import { GoodsDetailModel } from '../models';
import { GoodsDetailItem } from './GoodsDetailItem';

interface Props {
  lists: GoodsDetailModel[];
  className?: string;
}

export const GoodsDetail: React.FC<Props> = ({ lists, className }) => (
  <Wrapper className={className}>
    {lists.map(({ type, file, containerHeight }) => {
      return <GoodsDetailItem key={file.path} type={type} file={file} containerHeight={containerHeight} />;
    })}
  </Wrapper>
);

const Wrapper = styled.div`
  overflow: hidden;
`;
