import styled from 'styled-components';
import { LoginFooter } from '@features/login/components';
import { toDateFormat } from '@utils/date';
import { LoginForm } from './LoginForm';
import { LoginBannerModel } from '../models';
import { BannerList } from './BannerList';
import { useInputBlur } from '../hooks';

export interface LoginContentProps {
  banners: LoginBannerModel[];
  onSubmit: () => void;
  onSocial: (type: string) => void;
}

export const LoginContent = ({ banners, onSubmit: handleSubmit, onSocial: handleSocial }: LoginContentProps) => {
  const elRef = useInputBlur<HTMLDivElement>();
  const currentYear = toDateFormat(Date.now(), 'yyyy');

  return (
    <ContainerStyled ref={elRef}>
      <BannerList banners={banners} />
      <div className="login-form-wrapper">
        <LoginForm onSubmit={handleSubmit} />
      </div>
      <div className="footer-wrapper">
        <LoginFooter onSocial={handleSocial} />
      </div>
      <p className="copy">&copy; {currentYear} RXC</p>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  & .login-form-wrapper {
    margin-top: 1.6rem;
    padding: 0 2.4rem;
  }

  & .footer-wrapper {
    margin-top: 4rem;
    padding: 0 2.4rem;
  }

  & .copy {
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
    margin-top: 2.4rem;
    margin-bottom: 2.4rem;
    text-align: center;
  }
`;
