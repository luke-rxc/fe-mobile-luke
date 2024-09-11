import React from 'react';
import styled from 'styled-components';

export const GoodsFooter: React.FC = () => {
  return (
    <Wrapper>
      (주)알엑스씨는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 상품, 상품 정보, 거래, 배송에 관한 의무와 책임은
      판매자에게 있습니다.
    </Wrapper>
  );
};

const Wrapper = styled.p`
  color: ${({ theme }) => theme.color.text.textTertiary};
  font: ${({ theme }) => theme.fontType.micro};
  text-align: center;
`;
