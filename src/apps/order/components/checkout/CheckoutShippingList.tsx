import styled from 'styled-components';
import { CheckoutShippingModel } from '../../models';
import { CheckoutShippingListItem } from './CheckoutShippingListItem';

interface Props {
  items: CheckoutShippingModel[];
  onCreate?: () => void;
  onSelect?: (shipping: CheckoutShippingModel) => void;
  onDelete?: (id: number) => void;
}

export const CheckoutShippingList = ({
  items,
  onCreate: handleCreate,
  onSelect: handleSelect,
  onDelete: handleDelete,
}: Props) => {
  return (
    <ContainerStyled>
      {items.map((item) => (
        <CheckoutShippingListItemStyled key={item.id} item={item} onSelect={handleSelect} onDelete={handleDelete} />
      ))}
      {handleCreate && <AddShippingButtonStyled onClick={handleCreate}>새 배송지 추가</AddShippingButtonStyled>}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  height: auto;
  padding: 1rem;
`;

const CheckoutShippingListItemStyled = styled(CheckoutShippingListItem)`
  margin-bottom: 0.8rem;

  &:last-child {
    margin-bottom: 1rem;
  }
`;

const AddShippingButtonStyled = styled.button`
  display: block;
  width: 100%;
  min-height: 55px;
  padding: 1em 0.5em;
  text-align: center;
  background: none;
  border: 1px solid #ddd;
`;
