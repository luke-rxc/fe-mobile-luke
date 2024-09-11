import styled from 'styled-components';
import { SignUser } from '@features/login/types';
import { LoginUserProfile } from '@features/login/components';
import { CertificationForm } from './CertificationForm';
import { useInputBlur } from '../hooks';

interface Props {
  user: SignUser;
  autoSubmit: boolean;
  isShowAgreement: boolean;
  onSubmit: () => void;
}

interface StyleProps {
  method: string;
}

export const ConfirmContent = ({ user, autoSubmit, isShowAgreement, onSubmit }: Props) => {
  const { method, type } = user;
  const styleProps = {
    method,
  };
  const profileTitle = user.name ?? user.email;
  const elRef = useInputBlur<HTMLDivElement>();

  return (
    <ContainerStyled {...styleProps} ref={elRef}>
      <BoxStyled>
        <LoginUserProfileStyled imageUrl={user?.profileImageUrl} title={profileTitle} method={method} />
        <CertificationForm
          method={method}
          type={type}
          autoSubmit={autoSubmit}
          isShowAgreement={isShowAgreement}
          onSubmit={onSubmit}
        />
      </BoxStyled>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div<StyleProps>`
  display: flex;
  justify-content: center;
  padding-top: 1.6rem;

  & .section {
    position: ${({ method }) => (method === 'email' ? 'relative' : 'absolute')};
    bottom: 0;
    width: 100%;
    margin-top: 2.4rem;
    ${({ method }) => method !== 'email' && 'padding: 0 2.4rem 3.2rem 2.4rem'}
  }
`;

const BoxStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .profile {
    display: block;
  }

  .tit {
    font-size: ${({ theme }) => theme.fontSize.s24};
  }

  .description {
    margin-top: 0.8rem;
    text-align: center;
  }
`;

const LoginUserProfileStyled = styled(LoginUserProfile)`
  padding: 0 2.4rem;
`;
