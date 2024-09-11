import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { Button } from '@pui/button';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { GoodsError, OptionBubbleRow } from '../components';
import { useDateTimePickerService } from '../services/useDateTimePickerService';
import { OptionComponentModel } from '../models';
import { ParentOptionsProps } from '../types';
import { GoodsMessage } from '../constants';

interface Props {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 구성 components */
  components?: OptionComponentModel[];
  /** 상위 옵션 정보 */
  parentOptions?: ParentOptionsProps[];
}

export const DateTimePickerContainer = ({ goodsId, components, parentOptions }: Props) => {
  const { isIOS, isApp } = useDeviceDetect();
  const {
    data,
    isLoading,
    isError,
    isFetched,
    selected,
    refetch,
    getTitlesInfo,
    getTimesInfo,
    handleSelect,
    handleClickComplete,
  } = useDateTimePickerService({
    goodsId,
    components,
    parentOptions,
  });

  const loading = useLoadingSpinner(isLoading);

  if (!isFetched || loading) {
    return null;
  }

  if (!data || isError) {
    return (
      <GoodsError
        title={GoodsMessage.ERROR_NETWORK}
        description={ErrorMessage.Traffic}
        actionLabel={ErrorActionButtonLabel.RELOAD}
        onAction={() => refetch()}
      />
    );
  }

  const { days } = data;

  if (isEmpty(days)) {
    return <GoodsError defaultMessage={GoodsMessage.ERROR_NOTHING_CONTENT} showOnlyMessage />;
  }

  const { row, item } = selected;

  const titleList = getTitlesInfo(days);

  return (
    <Wrapper className={isIOS && isApp ? 'is-ios-app' : ''}>
      {days.map((value, index) => {
        const { times } = value;
        const timeList = getTimesInfo(times);

        return (
          <OptionBubbleRow
            key={titleList[index]}
            title={titleList[index]}
            bubbles={timeList}
            selected={selected}
            onClick={handleSelect}
          />
        );
      })}
      <div className="button-wrapper">
        <Button variant="primary" size="large" bold disabled={!row && !item} onClick={handleClickComplete}>
          완료
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // 하단 완료 버튼 영역(80) + 고정 여백(24)
  padding-bottom: 10.4rem;

  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    left: 0;
    width: 100%;
    padding: 0 2.4rem;

    ${Button} {
      width: 100%;
    }
  }
`;
