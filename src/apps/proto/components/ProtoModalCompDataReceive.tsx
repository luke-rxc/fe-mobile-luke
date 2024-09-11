import { useEffect, useState } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { useDrawerInModal } from '@hooks/useDrawerInModal';

type Props = ModalWrapperRenderProps;

export const ProtoModalCompDataReceive: React.FC<Props> = ({ onClose, transitionState }) => {
  const { initialValues, receiveValues } = useWebInterface();
  const [initial, setInitial] = useState<typeof initialValues>({});
  const [receive, setReceive] = useState<typeof receiveValues>({});
  const { depth, openModal, closeModal } = useModal();
  const { drawerProps } = useDrawerInModal({
    onClose,
    transitionState,
  });

  const handleOpen = async () => {
    await openModal(
      {
        nonModalWrapper: true,
        render: (props) => <ProtoModalCompDataReceive {...props} />,
      },
      { message: `from depth: ${depth}` },
    );
  };

  const handleClose = () => {
    closeModal('', { message: `from depth: ${depth}` });
  };

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      setInitial(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      setReceive(receiveValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return (
    <Drawer
      {...drawerProps}
      title={{
        label: `Modal ${depth}`,
      }}
      dragging
      draggingProps={{
        closeConfirm: {
          title: '닫을거예요?',
          message: '닫으면 Receive Data 를 날릴겁니다.',
          disableForceClose: true,
          cb: handleClose,
        },
      }}
    >
      <ContainerStyled>
        <div>
          <span>ProtoModalCompDataReceive Depth: {depth}</span>
        </div>
        <div className="section">
          <p>initialValues: {JSON.stringify(initial)}</p>
        </div>
        <div>
          <p>receiveData: {JSON.stringify(receive)}</p>
        </div>
        <div className="button-group">
          <Button variant="primary" block size="small" onClick={handleOpen}>
            열기
          </Button>
          {depth > 0 && (
            <Button variant="primary" block size="small" onClick={handleClose}>
              닫기
            </Button>
          )}
        </div>
      </ContainerStyled>
    </Drawer>
  );
};

const ContainerStyled = styled.div`
  .section {
    margin-top: 1.2rem;
  }

  .button-group {
    display: flex;
    margin-top: 1.2rem;

    ${Button} {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
`;
