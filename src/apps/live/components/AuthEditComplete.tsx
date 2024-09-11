import { Button } from '@pui/button';
import styled from 'styled-components';
import { ReturnTypeUseLiveAuthAuctionEditService } from '../services';

interface Props {
  onClickComplete: ReturnTypeUseLiveAuthAuctionEditService['actions']['onClickComplete'];
}

/**
 * 필수정보 수정 완료 component
 */
export const AuthEditComplete = ({ onClickComplete: handleClickComplete }: Props) => {
  return (
    <WrapperStyled>
      <Button variant="primary" block bold size="large" onClick={handleClickComplete}>
        완료
      </Button>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};

  padding: 0 2.4rem;
`;
