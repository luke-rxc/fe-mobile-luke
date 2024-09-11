import styled from 'styled-components';

export const LiveEndHeader = () => {
  return (
    <WrapperStyled>
      <div className="title">라이브가 종료되었습니다</div>
      <div className="description">라이브 상품, 혜택과 함께 구매해보세요</div>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  padding: 3.2rem 0 4rem 0;
  text-align: center;

  .title {
    font: ${({ theme }) => theme.fontType.titleB};
  }

  .description {
    font: ${({ theme }) => theme.fontType.small};
    margin-top: 0.8rem;
  }
`;
