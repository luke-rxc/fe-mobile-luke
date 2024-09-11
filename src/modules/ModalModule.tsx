import React, { useEffect } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { Conditional } from '@pui/conditional';
import { DrawerDefault } from '@pui/drawer/v2';
import { ModalActiveListProps, useModalStore } from '@stores/useModalStore';
import { ModalPortal } from '@pui/modal/ModalPortal';
import { ModalWrapper, getTransitionTimeout } from '@pui/modal/ModalWrapper';
import { ModalDataProvider } from '@pui/modal';

export interface ModalMountWrapperProps {
  children: React.ReactNode;
  onMount: () => void;
  onClose: () => void;
}

const ModalMountWrapper = ({ children, onMount, onClose }: ModalMountWrapperProps) => {
  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    function close() {
      onClose();
    }
    window.addEventListener('popstate', close);
    return () => {
      window.removeEventListener('popstate', close);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export const ModalModule = () => {
  const activeModals = useModalStore((state) => state.activeModals);
  const close = useModalStore((state) => state.close);
  const mounted = useModalStore((state) => state.mounted);
  return (
    <ModalPortal>
      <TransitionGroup component={null}>
        {activeModals.map((modal: ModalActiveListProps, index, arr) => {
          const { props, id } = modal;
          const { render, nonModalWrapper = false, fadeTime: modalPropsFadeTime, timeout, ...modalProps } = props;
          const fadeTime = nonModalWrapper ? DrawerDefault.transitionDuration / 1000 : modalPropsFadeTime;
          const timeOut = getTransitionTimeout(timeout, fadeTime);
          const onClose = () => close(id);
          const sendModalProps = {
            ...modalProps,
            fadeTime,
          };
          return render ? (
            <Transition appear key={id} mountOnEnter timeout={timeOut} unmountOnExit>
              {(transitionState) => {
                return (
                  <ModalDataProvider modalId={id} prevId={arr[index - 1]?.id}>
                    <ModalMountWrapper
                      onMount={() => {
                        mounted(id);
                      }}
                      onClose={onClose}
                    >
                      <Conditional
                        condition={nonModalWrapper}
                        trueExp={<>{render({ onClose, transitionState })}</>}
                        falseExp={
                          <ModalWrapper
                            {...sendModalProps}
                            key={id}
                            onClose={onClose}
                            transitionState={transitionState}
                          >
                            {render({ onClose, transitionState })}
                          </ModalWrapper>
                        }
                      />
                    </ModalMountWrapper>
                  </ModalDataProvider>
                );
              }}
            </Transition>
          ) : null;
        })}
      </TransitionGroup>
    </ModalPortal>
  );
};
