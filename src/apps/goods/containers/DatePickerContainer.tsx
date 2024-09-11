import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { DatePicker } from '@features/datePicker/components';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { GoodsError } from '../components';
import { useDatePickerService } from '../services';
import { OptionComponentModel } from '../models';
import { ParentOptionsProps } from '../types';
import { GoodsMessage } from '../constants';
import { GoodsCalendarSchema } from '../schemas';

interface Props {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 구성 components */
  components?: OptionComponentModel[];
  /** 상위 옵션 정보 */
  parentOptions?: ParentOptionsProps[];
}

export const DatePickerContainer = ({ goodsId, components, parentOptions }: Props) => {
  const {
    isInit,
    calendarData,
    isLoading,
    isError,
    isFetched,
    selectedOptionStock,
    singleTouch,
    displayStayInfo,
    refetchCalendar,
    handleClickComplete,
  } = useDatePickerService({
    goodsId,
    components,
    parentOptions,
  });

  const loading = useLoadingSpinner(isLoading);

  if (!isInit || loading) {
    return null;
  }

  if (!isFetched || !calendarData || isError) {
    return (
      <GoodsError
        title={GoodsMessage.ERROR_NETWORK}
        description={ErrorMessage.Traffic}
        actionLabel={ErrorActionButtonLabel.RELOAD}
        onAction={() => refetchCalendar()}
      />
    );
  }

  return (
    <DatePicker<GoodsCalendarSchema>
      data={calendarData}
      selectedOptionsStock={selectedOptionStock}
      singleTouch={singleTouch}
      displayStayInfo={displayStayInfo}
      displayPrice={calendarData.displayPrice}
      onClickComplete={handleClickComplete}
    />
  );
};
