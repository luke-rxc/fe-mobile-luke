import styled from 'styled-components';
import { CheckoutShippingModel } from '../../models';

interface Props {
  item: CheckoutShippingModel;
  onSelect?: (shipping: CheckoutShippingModel) => void;
  onDelete?: (id: number) => void;
}

export const CheckoutShippingListItem = ({ item, onSelect, onDelete, ...other }: Props) => {
  function handleSelect() {
    onSelect?.(item);
  }

  function handleDelete() {
    onDelete?.(item.id);
  }

  return (
    <ContainerStyled {...other}>
      <ShippingInfoListStyled>
        {item.addressName && <li>{item.addressName}</li>}
        <li>{item.name}</li>
        <li>{item.phone}</li>
        <li>
          ({item.postCode}){item.address}
        </li>
        <li>{item.addressDetail}</li>
      </ShippingInfoListStyled>
      <ShippingDeleteButtonStyled onClick={handleDelete}>삭제</ShippingDeleteButtonStyled>
      <ShippingSelectButtonStyled onClick={handleSelect}>선택</ShippingSelectButtonStyled>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid #000;
`;

const ShippingInfoListStyled = styled.ul`
  padding: 1rem;

  li {
    display: flex;
  }
`;

const ShippingSelectButtonStyled = styled.button`
  position: absolute;
  right: 1rem;
  min-width: 55px;
  max-width: 150px;
  min-height: 45px;
  color: #fff;
  background-color: #1c64f2;
  border: none;
  border-radius: 4px;
`;

const ShippingDeleteButtonStyled = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 0.5rem;
  margin-right: 1rem;
  padding: 0;
  background: none;
  border: none;
`;
