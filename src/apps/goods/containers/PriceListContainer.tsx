import styled from 'styled-components';
import classnames from 'classnames';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useWebInterface } from '@hooks/useWebInterface';
import { OptionPricing } from '@pui/optionPricing';
import { TitleSub } from '@pui/titleSub';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { FilterBar, FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME } from '@features/filter';
import { userAgent } from '@utils/ua';
import { useEffect } from 'react';
import { usePriceListService } from '../services/usePriceListService';
import { GoodsError } from '../components';
import { GoodsMessage, GoodsPageName } from '../constants';

interface Props {
  goodsId: number;
}

export const PriceListContainer = ({ goodsId }: Props) => {
  const { isApp } = userAgent();
  const { setTopBar } = useWebInterface();

  const {
    data,
    isLoading,
    isError,
    sortingOptions,
    tabValue,
    optionValues,
    scrolling,
    refetch,
    handleChangeTab,
    handleChangeSorting,
  } = usePriceListService({
    goodsId,
  });

  const loading = useLoadingSpinner(isLoading);

  // App Header
  useEffect(() => {
    setTopBar({
      title: GoodsPageName.PRICE_LIST,
      backgroundEffectType: 'none',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
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

  const { isSingleOption, tabs } = data;
  const { name } = tabs[tabValue];
  const tabList = isSingleOption ? [] : tabs.map((value) => value.name);

  return (
    <Wrapper>
      <div className={classnames('tab-wrapper', { 'is-app': isApp, 'is-scrolling': scrolling })}>
        <FilterBar
          disabledSticky
          category={{
            value: tabValue,
            defaultValue: 0,
            options: tabList,
            getValue: (_, index) => index,
            onChange: handleChangeTab,
          }}
          sort={{
            options: sortingOptions,
            onChange: handleChangeSorting,
          }}
        />
      </div>
      <div className="price-content">
        {!isSingleOption && <TitleSub title={name} />}
        {optionValues.map(({ id, values, price, isRunOut }) => (
          <OptionPricing key={id} optionInfos={values} price={price} runOut={isRunOut} />
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .tab-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('top', 56)};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background.surface};
    z-index: 2;
    /** IOS 쌓임 맥락 버그로 background 값 적용이 안되어 transform 값으로 쌓임 맥락에 추가 */
    transform: translateZ(0);

    &.is-app {
      ${({ theme }) => theme.mixin.safeArea('top', 0)};
    }

    &.is-scrolling {
      border-bottom: ${({ theme }) => `0.05rem solid ${theme.color.backgroundLayout.line}`};
    }
  }

  ${FilterBar} {
    ${FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME}: ${({ theme }) => theme.color.background.surface};
  }

  .price-content {
    display: flex;
    flex-direction: column;
    padding-bottom: ${({ theme }) => theme.spacing.s24};
    margin-top: 4.8rem;
  }

  .tab-name {
    display: flex;
    align-items: center;
    min-height: 5.6rem;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }
`;
