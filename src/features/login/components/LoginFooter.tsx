import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { AppleFilled, KakaoFilled } from '@pui/icon';
import classnames from 'classnames';
import styled from 'styled-components';

export interface LoginFooterProps {
  className?: string;
  onSocial: (type: string) => void;
}

export const LoginFooter = ({ className, onSocial: handleSocial }: LoginFooterProps) => {
  const { isIOS } = useDeviceDetect();
  const targets = isIOS ? ['kakao', 'apple'] : ['kakao'];
  const isMulti = targets.length > 1;

  return (
    <ContainerStyled className={className}>
      <div id="naverIdLogin" />
      {isMulti ? (
        <div className="social-group">
          {targets.map((target) => {
            return <SocialIconButton key={target} type={target} onClick={() => handleSocial(target)} />;
          })}
        </div>
      ) : (
        <div className="single-button-box">
          {targets.map((target) => {
            return <SocialButton key={target} type={target} onClick={() => handleSocial(target)} />;
          })}
        </div>
      )}
    </ContainerStyled>
  );
};

const SocialIconButton = ({ type, onClick }: { type: string; onClick: () => void }) => {
  const cls = classnames('social-icon-button', type);
  return (
    <Action is="button" onClick={onClick} className={cls}>
      {type === 'kakao' && <KakaoFilled size="3.2rem" colorCode="#000" />}
      {type === 'apple' && <AppleFilled size="3.2rem" color="white" />}
    </Action>
  );
};

const SocialButton = ({ type, onClick }: { type: string; onClick: () => void }) => {
  const cls = classnames('social-button', type);
  const text = () => {
    if (type === 'kakao') {
      return '카카오로 로그인';
    }

    if (type === 'apple') {
      return '애플로 로그인';
    }

    return '';
  };

  return (
    <Button
      size="large"
      prefix={<KakaoFilled size="3.2rem" colorCode="#000" />}
      block
      bold
      className={cls}
      onClick={onClick}
    >
      {text()}
    </Button>
  );
};

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .single-button-box {
    /* padding: 0 2.4rem; */
    width: 100%;

    .kakao {
      background: #fee500;
      color: #000;
    }
  }

  #naverIdLogin {
    display: none;
  }

  & .kakao {
    padding: 1.2rem;
    background: #fee500;
  }

  & .apple {
    padding: 1.2rem;
    background: ${({ theme }) => theme.color.black};
  }

  & .social-group {
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    overflow-x: scroll;

    & .social-icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-right: 1.2rem;
      border-radius: 3.2rem;
    }

    & .social-icon-button:last-child {
      margin-right: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
