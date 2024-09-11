import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import styled from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import { OrdererAuthContainer } from './OrdererAuthContainer';
import { CALL_WEB_EVENT_TYPE } from '../constants';

export type DrawerOrdererAuthContainerProps = ModalWrapperRenderProps;

export const DrawerOrdererAuthContainer = ({ onClose, transitionState }: DrawerOrdererAuthContainerProps) => {
  const { initialValues } = useWebInterface();
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });

  const drawerProps = {
    ...base,
    dragging: true,
    title: {
      label: initialValues.type === CALL_WEB_EVENT_TYPE.SET_TITLE ? initialValues.data?.title : '주문자',
    },
    fullHeight: false,
    backDropProps: { disableBackDropClose: false },
  };

  return (
    <Drawer {...drawerProps}>
      <InnerStyled>
        <OrdererAuthContainer />
      </InnerStyled>
    </Drawer>
  );
};

const InnerStyled = styled.div`
  height: calc(100% - 2.4rem);
  overflow-y: auto;
  padding-bottom: 8rem;
`;
