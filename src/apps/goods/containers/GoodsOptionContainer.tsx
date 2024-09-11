import React, { useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { formatToAmount } from '@utils/string';
import { Button } from '@pui/button';
import { Select, Option } from '@pui/select';
import { Slot } from '@pui/slot';
import { Divider } from '@pui/divider';
import { Stepper } from '@pui/stepper';
import { GoodsSmall } from '@pui/goodsSmall/GoodsSmall';
import { Conditional } from '@pui/conditional';
import { OptionComponentModel, OptionItemModel, OptionUiModel } from '../models';
import { useOptionControlService, HandleActionSaveParam } from '../services';
import { AnchorSelect, GoodsOptionBlock, GoodsOptionInfoArea } from '../components';
import { LayoutLockParams } from '../apis';
import { useDrawerModal } from '../hooks';
import { DrawerPickerContainer } from './DrawerPickerContainer';

interface Props {
  isOpen: boolean;
  isCartAddable: boolean;
  optionData: OptionUiModel | null;
  onActionSave: (params: HandleActionSaveParam) => void;
  onDeleteExpired: (params: LayoutLockParams) => void;
  onLogTabOption: (index: number) => void;
  onLogTabDeleteOptionBlock: () => void;
  onLogTabReselectConfirm: (confirm: boolean) => void;
  onLogImpressionTimeoutConfirm: () => void;
}

export const GoodsOptionContainer: React.FC<Props> = ({
  isOpen,
  isCartAddable,
  optionData,
  onActionSave,
  onDeleteExpired,
  onLogTabOption: handleLogTabOption,
  onLogTabDeleteOptionBlock,
  onLogTabReselectConfirm,
  onLogImpressionTimeoutConfirm,
}) => {
  if (optionData === null) {
    return null;
  }

  // Ref: content wrapper element
  const contentRef = useRef<HTMLDivElement | null>(null);
  // Ref: scroll (scroll를 사용하는 element)
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Ref: scroll inner (scroll 내부 content element)
  const scrollInnerRef = useRef<HTMLUListElement | null>(null);
  // Ref : Select-box (Option, 다중 옵션인 경우 주입)
  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
  // Ref: modal id (현재 오픈된 modal Id)
  const modalIdRef = useRef<string>('');

  const {
    image,
    status,
    selectedResult,
    optionInfos,
    selectedInfo,
    isOptionSingleType,
    scrolling,
    isAdd,
    deleteOptionIdx,
    expired,
    handleEnabledScroll,
    handleDisabledScroll,
    handleTouchMove,
    handleSelectMore,
    handleSelect,
    handleStockChangeBefore,
    handleStockChange,
    setMaxStock,
    handleDeleteOption,
    handleOrder,
    handleCart,
    handleExpiredTime,
  } = useOptionControlService({
    isOpen,
    optionData,
    contentRef,
    scrollRef,
    scrollInnerRef,
    selectRefs,
    modalIdRef,
    onActionSave,
    onDeleteExpired,
    onLogTabOption: handleLogTabOption,
    onLogTabDeleteOptionBlock,
    onLogTabReselectConfirm,
    onLogImpressionTimeoutConfirm,
  });
  const { handleDrawerOpen } = useDrawerModal();

  const { goodsId, goodsName, brandInfo, isAllPriceSame, components, multiChoicePolicy, guideMessages } = optionData;
  const { name: brandName } = brandInfo ?? {};

  // import/no-cyle 에러로 인해 container에 선언
  const handleOpenDrawerModal = async (componentList: OptionComponentModel[], index: number) => {
    const isSelectAble = await handleSelectMore(index);

    if (!isSelectAble) {
      return;
    }

    handleDrawerOpen(DrawerPickerContainer, {
      goodsId,
      index,
      components: componentList,
      selectedInfo,
      expired,
    });
  };

  /** 선택된 옵션, 최종 금액 */
  const selectedPrice = selectedResult.reduce((prev, current) => prev + current.price * current.stock, 0);

  return (
    <Wrapper>
      <div className="header-wrapper">
        <GoodsSmall image={image} goodsName={goodsName} brandName={brandName} />
        {scrolling && <Divider />}
      </div>

      <div ref={contentRef} className="content-wrapper">
        <div
          ref={scrollRef}
          className="scroll-wrapper"
          onTouchStart={handleEnabledScroll}
          onTouchMove={(evt) => handleTouchMove(evt)}
          onTouchEnd={handleDisabledScroll}
          onTouchCancel={handleDisabledScroll}
        >
          <ul ref={scrollInnerRef}>
            {/* 싱글옵션의 경우 수량 선택 노출 */}
            <Conditional
              condition={isOptionSingleType && !isEmpty(selectedResult)}
              trueExp={
                <li className="option-stock">
                  <span className="title">수량</span>
                  <Stepper
                    value={selectedResult[0]?.stock}
                    max={setMaxStock(selectedResult[0]?.stock, selectedResult[0]?.purchasableStock)}
                    onChange={(evt) => handleStockChange(evt.value, selectedResult[0])}
                    onBefore={(evt) => handleStockChangeBefore(evt, selectedResult[0])}
                  />
                </li>
              }
            />
            {/* 멀티옵션의 경우 옵션 선택 노출 */}
            <Conditional
              condition={!isOptionSingleType}
              trueExp={
                <>
                  <li className="option-wrapper">
                    {components.map((component, index) => {
                      const { type, title } = component;
                      return (
                        <React.Fragment key={title}>
                          <Conditional
                            condition={type === 'DEFAULT'}
                            trueExp={
                              <Select
                                className="select"
                                placeholder={`${title} 선택`}
                                onChange={(evt) => handleSelect(evt, index)}
                                onClick={() => handleSelectMore(index)}
                                disabled={index > status.currentDepth}
                                size="large"
                                ref={(ref) => {
                                  selectRefs.current[index] = ref;
                                }}
                              >
                                {optionInfos[index]?.map((item: OptionItemModel, itemIdx: number) => {
                                  const { value, isRunOut, options } = item;
                                  const { price } = options?.[0] ?? {};

                                  const priceSuffix = !isAllPriceSame && !!price && ` · ${formatToAmount(price)}원`;
                                  const isRunOutSuffix = isRunOut && ' (품절)';
                                  const suffix = isRunOut ? isRunOutSuffix : priceSuffix;

                                  return (
                                    <Option value={itemIdx} key={value} disabled={isRunOut}>
                                      {value}
                                      {suffix ?? ''}
                                    </Option>
                                  );
                                })}
                              </Select>
                            }
                            falseExp={
                              <AnchorSelect
                                className="select"
                                placeholder={selectedInfo[index] ? selectedInfo[index].title : `${title} 선택`}
                                disabled={index > status.currentDepth}
                                size="large"
                                onClick={() => handleOpenDrawerModal(components, index)}
                              />
                            }
                          />
                        </React.Fragment>
                      );
                    })}
                  </li>

                  <Conditional
                    condition={!isEmpty(selectedResult)}
                    trueExp={
                      <GoodsOptionBlock
                        selectedResult={selectedResult}
                        multiChoicePolicy={multiChoicePolicy}
                        deleteOptionIdx={deleteOptionIdx}
                        isAdd={isAdd}
                        setMaxStock={setMaxStock}
                        onStockChange={handleStockChange}
                        onStockChangeBefore={handleStockChangeBefore}
                        onDeleteOption={handleDeleteOption}
                      />
                    }
                  />
                </>
              }
            />
          </ul>
        </div>

        <div className="bottom-wrapper">
          <div className="masking-area" />
          {(guideMessages || expired) && (
            <GoodsOptionInfoArea guideMessages={guideMessages} expired={expired} onExpired={handleExpiredTime} />
          )}
          <div className="button-wrapper">
            <Conditional
              condition={isCartAddable}
              trueExp={
                <Button variant="secondary" size="large" bold disabled={isEmpty(selectedResult)} onClick={handleCart}>
                  쇼핑백에 담기
                </Button>
              }
            />
            <Button
              variant="primary"
              size="large"
              bold
              className={classnames({
                single: !isCartAddable,
              })}
              disabled={isEmpty(selectedResult)}
              onClick={handleOrder}
              description={selectedPrice > 0 && <Slot initialValue={0} value={selectedPrice} suffix="원" />}
            >
              구매
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -2rem;
  height: calc(100% + 2rem);
  overflow: hidden;

  ${Divider} {
    ${({ theme }) => theme.absolute({ b: 0 })};
    width: 100%;
    padding: 0;
  }

  .header-wrapper {
    position: relative;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .single-option-wrapper {
    flex: 1 1 auto;
    padding: 1.2rem 2.4rem 0;

    .option-stock {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 7.2rem;
    }
  }

  .option-wrapper {
    .select {
      margin-bottom: 1.2rem;
    }
  }

  .scroll-wrapper {
    position: relative;
    flex: 1 1 auto;
    padding: 1.2rem 2.4rem 2.4rem;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .option-stock {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 7.2rem;
    }
  }

  .bottom-wrapper {
    position: relative;

    .masking-area {
      ${({ theme }) => theme.absolute({ t: -32, l: 0 })};
      width: 100%;
      height: 3.2rem;
      background: ${({ theme }) =>
        `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.whiteVariant1} 100%)`};
    }
  }

  .button-wrapper {
    display: flex;
    position: relative;
    padding: 0 2.4rem;
    ${({ theme }) => theme.mixin.safeArea('padding-bottom', 24)};

    ${Button} {
      width: 50%;
      margin-right: 0.8rem;
      &:last-child {
        margin: 0;
      }
      &.single {
        width: 100%;
        margin: 0;
      }
    }
  }
`;
