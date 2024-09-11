/* eslint-disable react-hooks/exhaustive-deps */
import { Select, Option } from '@pui/select';
import { Option as OptionIcon } from '@pui/icon';
import { Button } from '@pui/button';
import { TitleSection } from '@pui/titleSection';
import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DeliveryModel } from '../models';
import { DeliveryItem } from './DeliveryItem';
import { AvailableActionType, AVAILABLE_ACTIONS_TYPE, DEFAULT_AVAILABLE_ACTIONS } from '../constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  items: DeliveryModel[];
  orderId?: number;
  selectable?: boolean;
  disabledAction?: boolean;
  isAuctionEntry: boolean;
  onCreate: () => void;
  onConfirm?: (shipping: DeliveryModel) => void;
  onActions: (e: React.ChangeEvent<HTMLSelectElement>, shippingId: number) => void;
}

interface ActionProps {
  shippingId: number;
  availableActions: AvailableActionType[];
}

interface StyleProps {
  selectable: Props['selectable'];
  isAuctionEntry: Props['isAuctionEntry'];
}

export const DeliveryList = ({
  items,
  orderId,
  onCreate: handleCreate,
  onConfirm,
  selectable = false,
  disabledAction = false,
  isAuctionEntry,
  onActions: handleActions,
  ...rest
}: Props) => {
  const selectedDeliveryRef = useRef<DeliveryModel | null>(items.find((item) => item.isDefault) ?? null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const styleProps: StyleProps = { selectable, isAuctionEntry };

  const getAvailableAction = (action: AvailableActionType, delivery: DeliveryModel) => {
    if (delivery.isDefault) {
      if (action === AVAILABLE_ACTIONS_TYPE.DEFAULT) {
        return false;
      }

      if (isAuctionEntry && action === AVAILABLE_ACTIONS_TYPE.DELETE) {
        return false;
      }
    }

    return true;
  };

  const ActionComp = ({ shippingId, availableActions }: ActionProps) => {
    return (
      <label className="delivery-action-button delivery-option">
        <Select className="delivery-select" onChange={(e) => handleActions(e, shippingId)} value="" placeholder="선택">
          {availableActions.map((action) => {
            if (action === 'default') {
              return (
                <Option key={action} value="default">
                  기본 배송지 설정
                </Option>
              );
            }

            if (action === 'update') {
              return (
                <Option key={action} value="update">
                  수정
                </Option>
              );
            }

            if (action === 'delete') {
              return (
                <Option key={action} value="delete">
                  삭제
                </Option>
              );
            }

            return null;
          })}
        </Select>
        <OptionIcon color="gray50" />
      </label>
    );
  };

  /** 배송지 변경 */
  const handleConfirm = useCallback(() => {
    selectable && !!selectedDeliveryRef.current && onConfirm?.(selectedDeliveryRef.current);
  }, [onConfirm, selectedDeliveryRef.current]);

  const handleSelect = useCallback((delivery: DeliveryModel) => {
    selectedDeliveryRef.current = delivery;
    setSelectedId(delivery.id);
  }, []);

  useEffect(() => {
    if (selectable) {
      selectedDeliveryRef.current =
        items.find((item) => item.id === selectedDeliveryRef.current?.id) ??
        items.find((item) => item.isDefault) ??
        null;
      setSelectedId(selectedDeliveryRef.current?.id ?? null);
    }
  }, [items]);

  return (
    <ContainerStyled {...rest} {...styleProps}>
      <TitleSection
        className="delivery-title"
        title={`배송지 ${items.length <= 1 ? '' : items.length}`}
        suffix={
          !disabledAction && (
            <Button className="add-button" size="medium" variant="tertiaryline" onClick={handleCreate}>
              추가
            </Button>
          )
        }
      />
      <ul className="delivery-list">
        {items.map((item) => {
          const { id, name, phone, addressName, postCode, address, addressDetail, isDefault } = item;
          const availableActions = DEFAULT_AVAILABLE_ACTIONS.filter((action) => getAvailableAction(action, item));

          return (
            <li key={item.id} className="delivery-item-wrapper">
              <DeliveryItem
                className="delivery-item"
                id={id}
                name={name}
                phone={phone}
                addressName={addressName}
                postCode={postCode}
                address={address}
                addressDetail={addressDetail}
                isDefault={isDefault}
                onSelect={handleSelect}
                selectable={selectable}
                suffix={!disabledAction && <ActionComp shippingId={id} availableActions={availableActions} />}
                checked={selectable && selectedId === id}
              />
            </li>
          );
        })}
      </ul>
      {selectable && (
        <div className="button-wrapper">
          <Button bold block variant="primary" size="large" onClick={handleConfirm}>
            확인
          </Button>
        </div>
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  padding-bottom: 2.4rem;

  .add-button {
    width: 5.8rem;
  }

  & .delivery-list {
    width: 100%;
    margin-bottom: ${({ selectable }) => (selectable ? '7.2rem' : '0')};
    ${({ isAuctionEntry }) => (isAuctionEntry ? 'padding-bottom: 6.4rem;' : '')};

    & .delivery-item-wrapper {
      display: flex;
      justify-content: center;

      & .delivery-item {
        width: 100%;
      }
    }
  }

  & .delivery-action-button {
    width: 4rem;
    height: 4rem;
    padding: 0.8rem;
  }

  & .delivery-option {
    border: none;
    background: none;
    position: relative;
    overflow: hidden;
    opacity: 1;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.5;
    }

    .delivery-select {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      select {
        padding: 0;
        height: 100%;
        width: 100%;
      }
      .suffix-box {
        display: none;
      }
    }
  }

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    padding: 0 2.4rem;
    width: 100%;
    z-index: 1;
  }
`;
