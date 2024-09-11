import { Spinner } from '@pui/spinner';
import styled from 'styled-components';
import { useLoadingStore } from '@stores/useLoadingStore';

export const LoadingModule = () => {
  const loadInfo = useLoadingStore((state) => state.loadInfo);
  return loadInfo.isLoading ? (
    <Wrapper>
      <Spinner {...loadInfo?.props} />
    </Wrapper>
  ) : (
    <></>
  );
};

const Wrapper = styled.div`
  z-index: 1400;
  ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
  ${({ theme }) => theme.mixin.centerItem()};
  width: 100vw;
  height: 100vh;
`;
