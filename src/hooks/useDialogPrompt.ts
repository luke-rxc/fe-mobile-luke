import React from 'react';
import { DialogPrompt, DialogPromptBaseProps } from '@pui/dialog';
import { useModal } from '@hooks/useModal';

export interface DialogPromptHookProps extends DialogPromptBaseProps {
  zIndex?: number;
  disableBackDropClose?: boolean;
}

export const useDialogPrompt = () => {
  const { openModal } = useModal();
  const openDialogPrompt = ({
    title,
    desc,
    type,
    confirm,
    cancel,
    textField,
    disableBackDropClose = false,
    zIndex,
    fadeTime,
    onMount,
  }: DialogPromptHookProps) => {
    openModal({
      fadeTime: 0.2,
      timeout: 0.25,
      nonInnerBg: true,
      disableBackDropClose,
      zIndex,
      render: ({ onClose, transitionState }) =>
        React.createElement(DialogPrompt, {
          onClose,
          transitionState,
          fadeTime: fadeTime ?? 0.25,
          title,
          desc,
          type,
          confirm,
          cancel,
          textField,
          onMount,
        }),
    });
  };

  return {
    openDialogPrompt,
  };
};
