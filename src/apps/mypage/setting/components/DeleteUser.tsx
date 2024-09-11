import styled from 'styled-components';
import { ChevronRight } from '@pui/icon';

export interface DeleteUserProps {
  onClick: () => void;
}

export const DeleteUser = ({ onClick: handleClick }: DeleteUserProps) => {
  return (
    <WrapperStyled onClick={handleClick}>
      회원탈퇴
      <ChevronRight />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.button`
  ${({ theme }) => theme.mixin.fixed({ l: '50%' })};
  transform: translateX(-50%);
  bottom: 2.4rem;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
  display: flex;
  align-items: center;
  font: ${({ theme }) => theme.fontType.t15};
  color: ${({ theme }) => theme.color.gray50};
`;
