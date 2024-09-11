import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { TitleSub } from '@pui/titleSub';
import { OrderRecipientInfoModel } from '../../models/OrderModel';

interface Props {
  item: OrderRecipientInfoModel;
}
export const OrderRecipientInfo = ({ item }: Props) => {
  const { name, phone, addressText, deliveryRequestMessage } = item;

  if (!item.isAddressRequired) {
    return (
      <div>
        <TitleSub title="예약 정보" />
        <List>
          <ListItemTable title="예약자" titleWidth={80} text={name} />
          <ListItemTable title="연락처" titleWidth={80} text={phone} />
          {deliveryRequestMessage && <ListItemTable title="요청사항" titleWidth={80} text={deliveryRequestMessage} />}
        </List>
      </div>
    );
  }

  return (
    <div>
      <TitleSub title="배송지" />
      <List>
        <ListItemTable title="받는 사람" titleWidth={80} text={name} />
        <ListItemTable title="연락처" titleWidth={80} text={phone} />
        {addressText && <ListItemTable title="주소" titleWidth={80} text={addressText} />}
        {deliveryRequestMessage && <ListItemTable title="요청사항" titleWidth={80} text={deliveryRequestMessage} />}
      </List>
    </div>
  );
};
