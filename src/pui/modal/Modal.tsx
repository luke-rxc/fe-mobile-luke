import React from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { ModalPortal } from './ModalPortal';
import { ModalWrapper, ModalWrapperProps, getTransitionTimeout } from './ModalWrapper';

export interface ModalProps extends Omit<ModalWrapperProps, 'transitionState'> {
  /** React Children */
  children: React.ReactNode;
  /** Modal Open 여부 */
  open: boolean;
}

/**
 * Modal : Component로 직접 사용
 */
export const Modal: React.FC<ModalProps> = ({ children, open, ...rest }) => {
  const { fadeTime, timeout, ...modalProps } = rest;
  const timeOut = getTransitionTimeout(timeout, fadeTime);
  const sendModalProps = {
    ...modalProps,
    fadeTime,
  };

  return (
    <ModalPortal>
      <TransitionGroup component={null}>
        {open && (
          <Transition appear mountOnEnter timeout={timeOut} unmountOnExit>
            {(transitionState) => {
              return (
                <ModalWrapper {...sendModalProps} transitionState={transitionState}>
                  {children}
                </ModalWrapper>
              );
            }}
          </Transition>
        )}
      </TransitionGroup>
    </ModalPortal>
  );
};
