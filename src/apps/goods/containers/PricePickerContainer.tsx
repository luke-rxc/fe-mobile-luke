import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { Button } from '@pui/button';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { ExpiredCountDown, GoodsError, OptionBubbleRow } from '../components';
import { usePricePickerService } from '../services/usePricePickerService';
import { OptionComponentModel } from '../models';
import { ExpiredInfoType, ParentOptionsProps } from '../types';
import { GoodsMessage } from '../constants';

interface Props {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 구성 components */
  components?: OptionComponentModel[];
  /** 상위 옵션 정보 */
  parentOptions?: ParentOptionsProps[];
  /** 만료시간 정보 */
  expired?: ExpiredInfoType | null;
}

export const PricePickerContainer = ({ goodsId, components, parentOptions, expired }: Props) => {
  const { isIOS, isApp } = useDeviceDetect();
  const {
    data,
    isLoading,
    isFetched,
    isError,
    selected,
    expiredInfo,
    isDisabled,
    refetch,
    getLayoutOptionsInfo,
    handleSelect,
    handleComplete,
    handleForceClose,
  } = usePricePickerService({
    goodsId,
    components,
    parentOptions,
    expired,
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

  const { layouts } = data;

  return (
    <Wrapper className={isIOS && isApp ? 'is-ios-app' : ''}>
      <div className="option-bubble-wrapper">
        {layouts.map((layout, index) => {
          const { name, items } = layout;
          const layoutOptions = getLayoutOptionsInfo(items);

          return (
            <OptionBubbleRow
              key={name}
              index={index}
              title={name}
              bubbles={layoutOptions}
              selected={selected[index]}
              onClick={handleSelect}
            />
          );
        })}
      </div>
      <div className="bottom-wrapper">
        <div className="masking-area" />
        <ExpiredCountDown expired={expiredInfo} onExpired={handleForceClose} />
        <div className="button-wrapper">
          <Button variant="primary" size="large" disabled={isDisabled} bold onClick={handleComplete}>
            완료
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // 하단 완료 버튼 영역(148) + 고정 여백(24)
  padding-bottom: 17.2rem;

  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  .optoin-bubble-warpper {
    display: flex;
    flex-direction: column;
  }

  .bottom-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

    .masking-area {
      padding: ${({ theme }) => theme.spacing.s16} 0;
      background: ${({ theme }) =>
        `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.whiteVariant1} 100%)`};
    }

    .button-wrapper {
      width: 100%;
      background: ${({ theme }) => theme.color.background.surface};
      ${({ theme }) => theme.mixin.safeArea('padding-bottom', 24)};
      padding-left: 2.4rem;
      padding-right: 2.4rem;

      ${Button} {
        width: 100%;
      }
    }
  }
`;
