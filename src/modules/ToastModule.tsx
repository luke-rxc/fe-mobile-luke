import { createRef } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { useToastStore } from '@stores/useToastStore';
import { ToastPortal } from '@pui/toast/ToastPortal';
import { Toast, ToastProps } from '@pui/toast/Toast';

export interface ToastActiveListProps {
  props: ToastProps;
  id: string;
}

export const ToastModule = () => {
  const activeToasts = useToastStore((state) => state.activeToasts);

  return (
    <ToastPortal>
      <TransitionGroup component={null}>
        {activeToasts.map((toast: ToastActiveListProps) => {
          const nodeRef = createRef<HTMLDivElement>();
          const { props, id } = toast;
          const { fadeTime, ...toastProps } = props;
          const fadeBaseTime = fadeTime ?? 250;
          return (
            <Transition appear key={id} mountOnEnter timeout={fadeBaseTime} unmountOnExit nodeRef={nodeRef}>
              {(transitionState) => {
                return <Toast {...toastProps} fadeTime={fadeBaseTime} toastId={id} transitionState={transitionState} />;
              }}
            </Transition>
          );
        })}
      </TransitionGroup>
    </ToastPortal>
  );
};
