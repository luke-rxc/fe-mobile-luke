import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

export const ErrorMessage = ({ children }: Props) => {
  return <WrapperStyled>{children}</WrapperStyled>;
};

const WrapperStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
