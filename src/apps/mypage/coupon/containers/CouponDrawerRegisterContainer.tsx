import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { COUPON_STRING } from '../constants';
import { CouponRegisterContainer } from './CouponRegisterContainer';
/**
 * My Page > 쿠폰 등록 컨테이너
 */
export const CouponDrawerRegisterContainer = ({ onClose, transitionState }: ModalWrapperRenderProps) => {
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });
  const drawerProps = {
    ...base,
    dragging: true,
    draggingProps: {
      closeConfirm: {
        title: COUPON_STRING.REGISTER_MODAL.CLOSE_CONFIRM.TITLE,
        message: COUPON_STRING.REGISTER_MODAL.CLOSE_CONFIRM.MESSAGE,
        disableForceClose: true,
        cb: () => {
          base.onClose();
        },
      },
    },
    title: {
      label: COUPON_STRING.REGISTER_MODAL.TITLE,
    },
  };

  return (
    <Drawer {...drawerProps}>
      <CouponRegisterContainer />
    </Drawer>
  );
};
