import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { GoodsError, SeatPicker } from '../components';
import { useSeatPickerService } from '../services';
import { GoodsMessage } from '../constants';
import { OptionComponentModel } from '../models';
import { ParentOptionsProps } from '../types';

interface Props {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 구성 components */
  components?: OptionComponentModel[];
  /** 상위 옵션 정보 */
  parentOptions?: ParentOptionsProps[];
}

export const SeatPickerContainer = ({ goodsId, components, parentOptions }: Props) => {
  const {
    seatInfoQuery,
    seatSingleInfoQuery,
    isInitialError,
    handleCompleteSeatPicker,
    isSeatLockLoading,
    handleChangeArea,
    handleSelectSeat,
    handleScrollSeatMap,
    seatInfo,
    selectedSeats,
    imageOverlayRef,
    showSeatTypeFloating,
  } = useSeatPickerService({
    goodsId,
    components,
    parentOptions,
  });
  const {
    isLoading: isAllAreaLoading,
    isFetching: isAllAreaFetching,
    isFetched: isAllAreaFetched,
    isError: isAllAreaError,
  } = seatInfoQuery;
  const { isError: isSingleAreaError } = seatSingleInfoQuery;

  const loading = useLoadingSpinner(isAllAreaFetching || isAllAreaLoading);
  if (!isAllAreaFetched || loading) {
    return null;
  }
  if (!seatInfo || isInitialError || isAllAreaError || isSingleAreaError) {
    return (
      <GoodsError
        title={GoodsMessage.ERROR_NETWORK}
        description={ErrorMessage.Traffic}
        actionLabel={ErrorActionButtonLabel.RELOAD}
        onAction={() => seatInfoQuery.refetch()}
      />
    );
  }

  return (
    <SeatPicker
      data={seatInfo}
      selectedSeats={selectedSeats}
      handleCompleteSeatPicker={handleCompleteSeatPicker}
      handleChangeArea={handleChangeArea}
      handleSelectSeat={handleSelectSeat}
      handleScrollSeatMap={handleScrollSeatMap}
      isSeatLockLoading={isSeatLockLoading}
      imageOverlayRef={imageOverlayRef}
      showSeatTypeFloating={showSeatTypeFloating}
    />
  );
};
