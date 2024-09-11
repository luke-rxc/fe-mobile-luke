import { useEffect, useState } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { ProtoModalCompDataReceive } from '../components';

const ProtoModalPage = () => {
  const { initialValues, receiveValues } = useWebInterface();
  const [initial, setInitial] = useState<typeof initialValues>({});
  const [receive, setReceive] = useState<typeof receiveValues>({});
  const { depth, openModal } = useModal();

  const handleOpen = async () => {
    await openModal(
      {
        nonModalWrapper: true,
        render: (props) => <ProtoModalCompDataReceive {...props} />,
      },
      { message: `from depth: ${depth}` },
    );
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
    <ContainerStyled>
      <div>
        <span>Depth: {depth}</span>
      </div>
      <div className="section">
        <p>initialValues: {JSON.stringify(initial)}</p>
      </div>
      <div>
        <p>receiveData: {JSON.stringify(receive)}</p>
      </div>
      <div className="button-group">
        <Button variant="primary" block size="small" onClick={handleOpen}>
          Data Transfer 열기
        </Button>
      </div>
    </ContainerStyled>
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

export default ProtoModalPage;
