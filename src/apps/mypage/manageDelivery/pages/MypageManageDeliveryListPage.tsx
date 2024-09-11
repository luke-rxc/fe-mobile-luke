import { DeliveryListContainer } from '@features/delivery/containers';
import { useQueryString } from '@hooks/useQueryString';

interface QueryParams {
  type?: string;
}

const MypageManageDeliveryListPage = () => {
  const { type } = useQueryString<QueryParams>();
  const editable = (type ?? '') === '';
  return <DeliveryListContainer selectable={!editable} />;
};

export default MypageManageDeliveryListPage;
