import styled from 'styled-components';
import { List } from '@pui/list';
import { TitleSub } from '@pui/titleSub';
import { Divider } from '@pui/divider';
import { ListItemSelect } from '@pui/listItemSelect';
import { ListItemTable } from '@pui/listItemTable';
import { useEffect, useState } from 'react';
import { Collapse } from '@pui/collapse';
import classnames from 'classnames';
import { phoneNumberToString } from '@features/delivery/utils';
import { ReturnMethodItemSchema, ClaimDeliveryInfoSchema } from '../schemas';
import { ClaimMethodTypes } from '../constants';

export interface RecallMethodProps {
  className?: string;
  methods?: Array<ReturnMethodItemSchema>;
  senderInfo?: ClaimDeliveryInfoSchema;
  returnMethod: string | null;
  handleChangeReturnMethod: (params: ReturnMethodItemSchema) => void;
}

export const RecallMethodItem = ({
  className,
  methods,
  senderInfo,
  returnMethod,
  handleChangeReturnMethod,
}: RecallMethodProps) => {
  /**
   * Collapse 영역 collapse/expand 상태값
   */
  const [expandedDetailArea, setExpandedDetailArea] = useState(false);

  useEffect(() => {
    setExpandedDetailArea(returnMethod === ClaimMethodTypes.SHOP);
  }, [returnMethod]);

  const RecallMethodRadioItem = ({ code, name, isDisabled }: ReturnMethodItemSchema) => {
    return (
      <ListItemSelect
        is="div"
        title={name}
        description={code === ClaimMethodTypes.USER && '보내실 주소는 알림톡으로 알려드립니다'}
        type="radio"
        selectable
        disabled={isDisabled}
        checked={code === returnMethod}
        onChange={() => handleChangeReturnMethod({ code, name, isDisabled })}
      />
    );
  };

  return (
    <div className={className}>
      <div className="return-method-inner">
        <List getKey={(data) => data.code} source={methods} component={RecallMethodRadioItem} />
      </div>
      {returnMethod === ClaimMethodTypes.SHOP && (
        <CollapseStyled
          expanded={expandedDetailArea}
          collapseOptions={{ duration: 300 }}
          className={classnames({ 'is-collapse': !expandedDetailArea })}
        >
          <Divider t="1.2rem" />
          <TitleSub title="회수지" />
          {senderInfo && (
            <List>
              <ListItemTable titleWidth={80} title="받는 사람" text={senderInfo.name} />
              <ListItemTable titleWidth={80} title="연락처" text={phoneNumberToString(senderInfo.phone)} />
              <ListItemTable titleWidth={80} title="주소" text={`${senderInfo.address} ${senderInfo.addressDetail}`} />
            </List>
          )}
        </CollapseStyled>
      )}
    </div>
  );
};

export const RecallMethod = styled(RecallMethodItem)`
  background: ${({ theme }) => theme.color.background.surface};
  .return-method-inner {
    display: flex;
    flex-direction: column;

    .radio-label {
      overflow: hidden;
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
      text-overflow: ellipsis;
    }
  }
  .method-spinner {
    ${({ theme }) => theme.mixin.centerItem()};
    height: 100%;
  }

  &.is-collapse {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
`;

const CollapseStyled = styled(Collapse)`
  padding-bottom: 9.6rem;
`;
