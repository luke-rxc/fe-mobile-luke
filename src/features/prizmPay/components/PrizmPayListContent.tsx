import styled from 'styled-components';
import { TitleSection } from '@pui/titleSection';
import { HTMLAttributes } from 'react';
import { Select, Option } from '@pui/select';
import { Option as OptionIcon, Trashbin } from '@pui/icon';
import { Button } from '@pui/button';
import { PrizmPayListItem } from './PrizmPayListItem';
import { PrizmPayModel } from '../models';
import { AvailableActionType, AVAILABLE_ACTIONS_TYPE, DEFAULT_AVAILABLE_ACTIONS } from '../constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  payList: PrizmPayModel[];
  playId: number;
  isAuctionEntry: boolean;
  onAdd?: () => void;
  onActions: (e: React.ChangeEvent<HTMLSelectElement>, payId: number) => void;
}

interface ActionProps {
  payId: number;
  disabled: boolean;
  availableActions: AvailableActionType[];
}

export const PrizmPayListContent = ({
  payList,
  playId,
  isAuctionEntry,
  onAdd: handleAdd,
  onActions: handleActions,
  ...rest
}: Props) => {
  const getBadgeLabel = (card: PrizmPayModel) => {
    if (card.isDeprecated) {
      return '사용불가';
    }

    if (card.isExpired) {
      return '기간만료';
    }

    if (card.isDefault) {
      return '주카드';
    }

    return '';
  };

  const getAvailableAction = (action: AvailableActionType, pay: PrizmPayModel) => {
    if (pay.isDefault) {
      if (action === AVAILABLE_ACTIONS_TYPE.DEFAULT) {
        return false;
      }

      if (isAuctionEntry && action === AVAILABLE_ACTIONS_TYPE.DELETE) {
        return false;
      }
    }

    return true;
  };

  const ActionComp = ({ payId, disabled, availableActions }: ActionProps) => {
    if (!disabled) {
      return (
        <label className="pay-action-button pay-option">
          <Select className="pay-select" onChange={(e) => handleActions(e, payId)} value="" placeholder="선택">
            {availableActions.map((action) => {
              if (action === 'default') {
                return (
                  <Option key={action} value="default">
                    주 결제 카드 설정
                  </Option>
                );
              }

              if (action === 'update') {
                return (
                  <Option key={action} value="update">
                    카드별명 설정
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
    }

    return (
      <Button
        className="pay-action-button"
        onClick={() => handleActions({ target: { value: 'delete' } } as React.ChangeEvent<HTMLSelectElement>, payId)}
      >
        <Trashbin color="gray50" />
      </Button>
    );
  };

  return (
    <ContainerStyled {...rest} isAuctionEntry={isAuctionEntry}>
      <TitleSection
        title={`카드 ${payList.length <= 1 ? '' : payList.length}`}
        suffix={
          <Button className="add-button" size="medium" variant="tertiaryline" onClick={handleAdd}>
            추가
          </Button>
        }
      />
      <ul className="card-list">
        {payList.map((pay) => {
          const badgeLabel = getBadgeLabel(pay);
          const disabled = pay.isDeprecated || pay.isExpired;
          const availableActions = DEFAULT_AVAILABLE_ACTIONS.filter((action) => getAvailableAction(action, pay));

          return (
            <li key={pay.id} className="card-item-wrapper">
              <PrizmPayListItem
                className="card-item"
                name={pay.cardAlias || pay.cardName || ''}
                no={pay.cardNumber}
                color={pay.color}
                logoUrl={pay.logoPath}
                suffix={<ActionComp payId={pay.id} disabled={disabled} availableActions={availableActions} />}
                isDefault={pay.isDefault}
                isExpired={pay.isExpired}
                isPlay={playId === pay.id}
                badgeLabel={badgeLabel}
                disabled={disabled}
              />
            </li>
          );
        })}
      </ul>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div<{ isAuctionEntry: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isAuctionEntry }) => (isAuctionEntry ? 'padding-bottom: 6.4rem;' : '')};

  & .add-button {
    width: 5.8rem;
  }

  & .card-list {
    width: 100%;

    & .card-item-wrapper {
      display: flex;
      justify-content: center;

      & .card-item {
        width: 100%;
      }
    }
  }

  & .pay-action-button {
    width: 4rem;
    height: 4rem;
    padding: 0.8rem;
  }

  & .pay-option {
    display: block;
    border: none;
    background: none;
    position: relative;
    overflow: hidden;
    opacity: 1;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.5;
    }

    .pay-select {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      select {
        padding: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
`;
