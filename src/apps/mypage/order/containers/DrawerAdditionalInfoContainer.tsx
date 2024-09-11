import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { AdditionalInfoContainer } from './AdditionalInfoContainer';
import { AdditionalInfoUISectionType, AdditionalInfoText, InputFormMode } from '../constants';

export interface DrawerAdditionalInfoContainerProps extends ModalWrapperRenderProps {
  type: ValueOf<typeof AdditionalInfoUISectionType>;
  mode: ValueOf<typeof InputFormMode>;
}

export const DrawerAdditionalInfoContainer = ({
  onClose,
  transitionState,
  type,
  mode,
}: DrawerAdditionalInfoContainerProps) => {
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });
  const draggingProps =
    mode !== InputFormMode.COMPLETE
      ? {
          draggingProps: {
            closeConfirm: {
              title:
                mode === InputFormMode.REGISTER
                  ? AdditionalInfoText.MODAL.CLOSE_CONFIRM.REGISTER_TITLE
                  : AdditionalInfoText.MODAL.CLOSE_CONFIRM.EDIT_TITLE,
              message: AdditionalInfoText.MODAL.CLOSE_CONFIRM.MESSAGE,
              disableForceClosse: true,
              cb: () => {
                base.onClose();
              },
            },
          },
        }
      : undefined;
  const drawerProps = {
    ...base,
    ...draggingProps,
    dragging: true,
    title: {
      label: AdditionalInfoText.MODAL.TITLE,
    },
  };

  return (
    <Drawer {...drawerProps}>
      <AdditionalInfoContainer type={type} />
    </Drawer>
  );
};
