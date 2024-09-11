import styled from 'styled-components';
import { List } from '@pui/list';
import { Button } from '@pui/button';
import { ListItemTable } from '@pui/listItemTable';
import { TitleSection } from '@pui/titleSection';
import { PlaceSchema } from '@features/map/schemas';
import { GeoMapLocation } from '@features/map/components';
import { TitleSub } from '@pui/titleSub';
import { Divider } from '@pui/divider';
import { CollapseSection } from './CollapseSection';

export interface ShippingInfoProps {
  /** 수령인 */
  name?: string;
  /** 배송메모 */
  memo?: string;
  /** 배송지 */
  address?: string;
  /** 연락처 */
  phoneNumber?: string;
  /**
   * 배송지 주소 필수 여부
   * @default true
   */
  isAddressRequired?: boolean;
  /** 배송지 정보 변경 */
  isChangeShippingAddress?: boolean;
  /** 위치 정보 */
  place?: PlaceSchema;
  /** 위치정보 - 지도 클릭 이벤트  */
  onClickMap?: () => void;
  /** 위치정보 - 주소 복사 릭 이벤트  */
  onClickAddressCopy?: () => void;
  /** 배송지 변경 버튼 클릭 이벤트 */
  onClickChangeShippingAddress?: () => void;
  /** 컴포넌트 클래스네임 */
  className?: string;
  /** Collapse 사용 여부 */
  isCollapseSection?: boolean;
}

export const ShippingInfo = styled(
  ({
    memo,
    address,
    name,
    phoneNumber,
    isAddressRequired = true,
    isChangeShippingAddress,
    place,
    onClickMap,
    onClickAddressCopy,
    onClickChangeShippingAddress,
    className,
    isCollapseSection = true,
  }: ShippingInfoProps) => {
    const title = isAddressRequired ? '배송지' : '예약 정보';
    return isCollapseSection ? (
      <CollapseSection title={title} className={className}>
        {isAddressRequired ? (
          <>
            <List>
              <ListItemTable titleWidth={80} title="받는 사람" text={name} />
              <ListItemTable titleWidth={80} title="연락처" text={phoneNumber} />
              <ListItemTable titleWidth={80} title="주소" text={address} />
              {memo && <ListItemTable titleWidth={80} title="요청사항" text={memo} />}
            </List>
            {isChangeShippingAddress && (
              <div className="actions">
                <Button
                  block
                  size="medium"
                  variant="tertiaryline"
                  children="정보 수정"
                  onClick={onClickChangeShippingAddress}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <List>
              <ListItemTable titleWidth={80} title="예약자" text={name} />
              <ListItemTable titleWidth={80} title="연락처" text={phoneNumber} />
              {memo && <ListItemTable titleWidth={80} title="요청사항" text={memo} />}
            </List>
            {place && (
              <>
                <Divider t="1.2rem" />
                <TitleSub title="위치" />
                <GeoMapLocation place={place} onClickMap={onClickMap} onClickCopy={onClickAddressCopy} />
              </>
            )}
          </>
        )}
      </CollapseSection>
    ) : (
      <div className={className}>
        <TitleSection title={title} />
        {isAddressRequired ? (
          <>
            <List>
              <ListItemTable titleWidth={80} title="받는 사람" text={name} />
              <ListItemTable titleWidth={80} title="연락처" text={phoneNumber} />
              <ListItemTable titleWidth={80} title="주소" text={address} />
              {memo && <ListItemTable titleWidth={80} title="요청사항" text={memo} />}
            </List>
            {isChangeShippingAddress && (
              <div className="actions">
                <Button
                  block
                  size="medium"
                  variant="tertiaryline"
                  children="정보 수정"
                  onClick={onClickChangeShippingAddress}
                />
              </div>
            )}
          </>
        ) : (
          <List>
            <ListItemTable titleWidth={80} title="이름" text={name} />
            <ListItemTable titleWidth={80} title="연락처" text={phoneNumber} />
            {memo && <ListItemTable titleWidth={80} title="요청사항" text={memo} />}
          </List>
        )}
      </div>
    );
  },
)`
  background: ${({ theme }) => theme.color.background.surface};
  .actions {
    margin-top: ${({ theme }) => theme.spacing.s12};
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
  }

  .collapse-inner {
    padding-bottom: ${({ theme }) => theme.spacing.s12};
  }
`;
