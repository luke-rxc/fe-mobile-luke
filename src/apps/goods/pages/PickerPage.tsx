import { useParams } from 'react-router-dom';
import { GoodsError } from '../components';
import { GoodsMessage, OptionUiType } from '../constants';
import { DatePickerContainer } from '../containers/DatePickerContainer';
import { DateTimePickerContainer } from '../containers/DateTimePickerContainer';
import { PricePickerContainer } from '../containers/PricePickerContainer';
import { SeatPickerContainer } from '../containers';

const PickerPage = () => {
  const { type, goodsId } = useParams<{ type: string; goodsId: string }>();

  if (!goodsId) {
    return <GoodsError defaultMessage={GoodsMessage.ERROR_PAGE} />;
  }

  switch (type) {
    case OptionUiType.DATE_PICKER:
      return <DatePickerContainer goodsId={+goodsId} />;
    case OptionUiType.DATE_TIME_PICKER:
      return <DateTimePickerContainer goodsId={+goodsId} />;
    case OptionUiType.SEAT_PICKER:
      return <SeatPickerContainer goodsId={+goodsId} />;
    case OptionUiType.PRICE_PICKER:
      return <PricePickerContainer goodsId={+goodsId} />;
    default:
      return <GoodsError defaultMessage={GoodsMessage.ERROR_PAGE} />;
  }
};

export default PickerPage;
