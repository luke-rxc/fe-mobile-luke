import styled from 'styled-components';
import { useEffect } from 'react';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { useAddress } from '../hooks';

export const DeliveryAddressContainer = () => {
  const { address, ref, show } = useAddress<HTMLDivElement>();
  const { close } = useWebInterface();
  const { closeModal } = useModal();

  useEffect(() => {
    show();
  }, [show]);

  useEffect(() => {
    if (address) {
      const params = { address };
      close(params, {
        doWeb: () => {
          closeModal('', params);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, close]);

  return (
    <ContainerStyled>
      <div className="address-search-field-container">
        <div ref={ref} className="address-search-field" />
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  .address-search-field {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
