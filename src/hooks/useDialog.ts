import React from 'react';
import { Dialog, DialogBaseProps } from '@pui/dialog';
import { useModal } from '@hooks/useModal';

export interface DialogHookProps extends DialogBaseProps {
  zIndex?: number;
  disableBackDropClose?: boolean;
  /** 해당 Dialog의 고유식별자를 넣기위한 Prop */
  dataType?: string;
}

export const useDialog = () => {
  const { openModal } = useModal();
  const openDialog = ({
    logoIcon,
    logoImage,
    title,
    desc,
    type,
    buttonDirection,
    confirm,
    cancel,
    disableBackDropClose = false,
    zIndex,
    fadeTime,
    dataType: datatype,
    onMount,
  }: DialogHookProps) => {
    openModal({
      fadeTime: 0.2,
      timeout: 0.25,
      nonInnerBg: true,
      disableBackDropClose,
      zIndex,
      render: ({ onClose, transitionState }) =>
        React.createElement(Dialog, {
          onClose,
          transitionState,
          fadeTime: fadeTime ?? 0.25,
          logoIcon,
          logoImage,
          title,
          desc,
          type,
          buttonDirection,
          confirm,
          cancel,
          onMount,
          datatype,
        }),
    });
  };

  return {
    openDialog,
  };
};
