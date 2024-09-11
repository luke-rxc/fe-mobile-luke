import { Spinner } from '@pui/spinner';
import styled from 'styled-components';

export const LiveLoading = () => {
  return (
    <LoadingStyled>
      <Spinner />
    </LoadingStyled>
  );
};

const LoadingStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100dvh;
  justify-content: center;
  align-items: center;
`;
