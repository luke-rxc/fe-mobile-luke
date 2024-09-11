import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import styled, { keyframes } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { ModalWrapperRenderProps } from '@pui/modal';
import { SignUser } from '../types';
import { LoginConfirmModalContainer } from './LoginConfirmModalContainer';
import { LoginModalContainer } from './LoginModalContainer';

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale( 0.75 )}
  90% { opacity: 1;}
  100% { opacity: 1; transform: scale( 1 )}
`;

const fadeOut = keyframes`
  0% { opacity: 1; transform: scale( 1 )}
  90% { opacity: 0;}
  100% { opacity: 0; transform: scale( 0.75 )}
`;

interface LoginModalStepProps extends ModalWrapperRenderProps {
  fadeTime?: number;
}

export const LoginModalStepContainer: React.FC<LoginModalStepProps> = ({
  fadeTime = 0.25,
  transitionState,
  onClose,
}) => {
  const [active, setActive] = useState(true);
  const { isIOSWebChrome } = useDeviceDetect();
  const [step, setStep] = useState(1);
  const [signUser, setSignUser] = useState<SignUser | null>(null);
  const userRef = useRef<SignUser | null>(null);
  const elRef = useRef<HTMLDivElement>(null);
  const { drawerProps } = useDrawerInModal({
    onClose,
    transitionState,
  });

  const wrapperClassName = classnames({
    'in-active': !active,
    'ios-web-chrome': isIOSWebChrome,
  });

  const handleNext = (user: SignUser) => {
    userRef.current = user;
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleTransitionEnd = useCallback(() => {
    if (elRef.current) {
      const els = elRef.current.querySelectorAll('.stacked');
      const user = els.length === 2 ? userRef.current : null;
      setSignUser(user);
    }
  }, []);

  useEffect(() => {
    if (transitionState && transitionState === 'exiting') {
      setActive(false);
    }
  }, [transitionState]);

  return (
    <Drawer {...drawerProps} dragging backDropProps={{ disableBackDropClose: false }}>
      <ContainerStyled ref={elRef} step={step} fadeTime={fadeTime} className={wrapperClassName}>
        <StepEffectStyled step={1} className={step >= 1 ? 'stacked' : ''}>
          <LoginModalContainer onNext={handleNext} />
        </StepEffectStyled>
        <StepEffectStyled step={2} className={step >= 2 ? 'stacked' : ''} onTransitionEnd={handleTransitionEnd}>
          {signUser && <LoginConfirmModalContainer user={signUser} onPrev={handlePrev} />}
        </StepEffectStyled>
      </ContainerStyled>
    </Drawer>
  );
};

interface StepEffectProps extends HTMLAttributes<HTMLDivElement> {
  step: number;
  onTransitionEnd?: () => void;
}

const StepEffect = ({ children, onTransitionEnd, ...rest }: StepEffectProps) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleTransitionEnd() {
      onTransitionEnd?.();
    }

    const el = elRef.current;

    if (el) {
      el.addEventListener('transitionend', handleTransitionEnd);
    }

    return () => {
      el?.removeEventListener('transitionend', handleTransitionEnd);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...rest} ref={elRef}>
      {children}
    </div>
  );
};

const StepEffectStyled = styled(StepEffect)`
  background: ${({ theme }) => theme.color.surface};
  z-index: ${({ step }) => step};
`;

const ContainerStyled = styled.div<{ step: number; fadeTime: number }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  transition: ${({ step }) => (step >= 2 ? 'height 200ms linear' : '')};

  /** Transition */
  animation: ${fadeIn} ease-out forwards;
  animation-duration: ${({ fadeTime }) => `${fadeTime}s`};

  &.in-active {
    animation: ${fadeOut} ease-out forwards;
    animation-duration: ${({ fadeTime }) => `${fadeTime}s`};
  }

  &.ios-web-chrome {
    animation: none;
    animation-duration: 0s;
    &.in-active {
      animation: none;
      animation-duration: 0s;
    }
  }

  ${StepEffectStyled} {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translate3d(100%, 0, 0);
    transition: transform 250ms ease-in;
    overflow-y: auto;

    &.stacked {
      transform: translate3d(0, 0, 0);
    }
  }
`;
