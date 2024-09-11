import styled from 'styled-components';
import { OrderOrdererInfoModel } from '../../models';

interface Props {
  item: OrderOrdererInfoModel;
}

export const OrdererInfo = ({ item }: Props) => {
  return (
    <ContainerStyled>
      <h3>주문자 정보</h3>
      <ul>
        <li>{item.name}</li>
        <li>{item.phone}</li>
      </ul>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  ul {
    padding: 0;
  }
  li {
    display: flex;
  }
`;
