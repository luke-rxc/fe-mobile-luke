/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, MouseEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { toDateFormat } from '@utils/date';
import { useWebInterface } from '@hooks/useWebInterface';
import { Select, Option } from '@pui/select';
import { Option as OptionIcon } from '@pui/icon';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import {
  ClaimTypes,
  DELIVERY_TYPES,
  ClaimManageInfo,
  ProcessTypes,
  ClaimTypeInfo,
  ReturnInfoText,
  ExchangeInfoText,
} from '../constants';
import { useLogService } from '../services/useLogService';
import { OrderAction } from './OrderAction';
import { ClaimInfoParams, useClaimNavigate } from '../hooks';
import { OrderClaimnBundleSchema, OrderDeliverySchema } from '../schemas';
import { GetClaimBundleRequest, DeleteReturnExchangeRequest } from '../apis';
import { toExternalLink } from '../../../order/utils/toExternalLink';

type TicketResendParams = {
  orderId: number;
  exportId: number;
};

type ClaimInfoTypes = {
  /** 취교반 액션 타입(취교반 요청) */
  type: ClaimTypeInfo;
  // /** 취교반 URL에 필요한 정보 */
  claimInfo: ClaimInfoParams;
};

export interface OrderActionsProps {
  /** 주문상태 */
  orderStatus?: string;
  /** 티켓 문자 재발송 가능 여부 */
  ticketResendable?: boolean;
  /** 티켓 문자 재발송 필수 파라미터 */
  ticketResendParams?: TicketResendParams;
  /** 티켓 문자 재발송 클릭 이벤트 */
  onTicketResend?: (params: TicketResendParams) => Promise<boolean>;
  /** 문의하기 URL */
  questionUrl: string;
  /** 취교반 액션 리스트 */
  claimTypeList?: Array<ClaimInfoTypes>;
  /** 주문 id */
  orderId: number;
  /** 배송타입 */
  deliveryType?: keyof typeof DELIVERY_TYPES;
  /** 배송조회 URL */
  deliveryUrl?: string;
  /** 회수 조회 정보 */
  returnDelivery?: OrderDeliverySchema;
  /** 상품 옵션 아이디 */
  goodsOptionId?: number;
  /** 컴포넌트 클래스네임 */
  className?: string;
  /** 취소 가능한 날짜 */
  cancelableDate?: number;
  /** 티켓 취소 수수료 부과 여부 */
  isCancelFee?: boolean;
  /** 묶음 취소 가능 상품 존재 유무 이벤트 */
  onCancelPartialBundle?: (params: GetClaimBundleRequest) => Promise<OrderClaimnBundleSchema>;
  /** 묶음 반품 가능 상품 존재 유무 이벤트 */
  onReturnBundle?: (params: GetClaimBundleRequest) => Promise<OrderClaimnBundleSchema>;
  /** 묶음 교환 가능 상품 존재 유무 이벤트 */
  onExchangeBundle?: (params: GetClaimBundleRequest) => Promise<OrderClaimnBundleSchema>;
  /** 반품 및 교환 철회 이벤트 */
  onWithDrawReturnChange?: (params: DeleteReturnExchangeRequest) => Promise<string>;
}

export const OrderActions = styled(
  ({
    orderStatus = '',
    ticketResendable = false,
    onTicketResend,
    ticketResendParams,
    questionUrl,
    claimTypeList,
    orderId,
    deliveryType,
    deliveryUrl,
    returnDelivery,
    cancelableDate,
    isCancelFee,
    goodsOptionId,
    className,
    onCancelPartialBundle,
    onReturnBundle,
    onExchangeBundle,
    onWithDrawReturnChange,
  }: OrderActionsProps) => {
    const { showToastMessage, confirm } = useWebInterface();
    const {
      logMyOrderTabQna,
      logMyOrderTabCheckDelivery,
      logMyOrderTabResendMessage,
      logMyOrderCompleteReturnOptionCancel,
      logMyOrderCompleteExchangeOptionCancel,
    } = useLogService();
    const { handleNavigate } = useClaimNavigate();
    const { isApp } = useDeviceDetect();
    /** anchor base props */
    const buttonProps = {
      block: true,
      size: 'medium',
      variant: 'tertiaryline',
    } as const;

    /** 티켓 문자 재발송 가능 여부 */
    const [resendable, setResendable] = useState(true);

    /** 취소가능날짜 */
    const cancelableDateAsString = cancelableDate && toDateFormat(cancelableDate, `~ yyyy. M. d`);

    /** 재발송 버튼 클릭 이벤트 */
    const handleClickResend = async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      // 이벤트 로깅
      logMyOrderTabResendMessage();

      if (!ticketResendParams) {
        return;
      }

      setResendable(!!(await onTicketResend?.(ticketResendParams)));
    };

    /** QnA 버튼 클릭 이벤트 */
    const handleClickQna = () => {
      // 이벤트 로깅
      logMyOrderTabQna();
    };

    /** 일반택배 배송 조회 버튼 클릭 이벤트 */
    const handleClickParcelDelivery = () => {
      // 이벤트 로깅
      logMyOrderTabCheckDelivery({ order_status: orderStatus });
    };

    /** 직접배송(화물배송) 배송 조회 버튼 클릭 이벤트 */
    const handleClickDirectDelivery = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      // 이벤트 로깅
      logMyOrderTabCheckDelivery({ order_status: orderStatus });
      // 직접배송(화물배송)의 경우 토스트 메시지를 표시
      showToastMessage({ message: '해당 상품은 직접배송 상품으로\n개별 안내드립니다' });
    };

    /** 반품/교환 철회 호출 */
    const handleWithdrawReturnChange = async ({
      cancelOrReturnId,
      itemOptionId,
      type,
    }: DeleteReturnExchangeRequest & { type: 'RETURN_WITHDRAW' | 'EXCHANGE_WITHDRAW' }) => {
      if (
        onWithDrawReturnChange &&
        (await confirm({
          title:
            type === 'RETURN_WITHDRAW'
              ? ReturnInfoText.CONFIRM.WITHDRAW.TITLE
              : ExchangeInfoText.CONFIRM.WITHDRAW.TITLE,
        }))
      ) {
        /** 반품/교환 철회 완료 로그 */
        const executeCompleteLog = () => {
          return type === 'RETURN_WITHDRAW'
            ? logMyOrderCompleteReturnOptionCancel({ order_id: `${orderId}` })
            : logMyOrderCompleteExchangeOptionCancel({ order_id: `${orderId}` });
        };
        const response = await onWithDrawReturnChange({ cancelOrReturnId, itemOptionId });
        if (response) {
          executeCompleteLog();
          showToastMessage({
            message:
              type === 'RETURN_WITHDRAW'
                ? ReturnInfoText.CONFIRM.WITHDRAW.SUCCESS_TOAST_MESSAGE
                : ExchangeInfoText.CONFIRM.WITHDRAW.SUCCESS_TOAST_MESSAGE,
          });
        }
      }
    };

    /** 취교반 요청 관련 클릭 이벤트 */
    const handleClickClaimCondition = ({ type: claimType, claimInfo }: ClaimInfoTypes) => {
      /**
       * 1. 티켓 취소, 배송 부분취소, 반품, 교환 구분 - claimType
       * 2. 묶음 유무 체크 필요 화면에 따라, 해당 서비스 호출 - 부분취소/반품/교환 - handleClickBundleCondition
       * 4. 2번 조건에 따라, 라우트 경로 생성
       * 5. 화면 이동 함수 호출
       * 6. 반품/교환 상세의 경우, 해당 화면으로 바로 이동
       * 7. 반품/교환 철회의 경우, 주문상세에서 서비스만 호출
       */
      //
      if (!claimType || !claimInfo) return;
      switch (claimType) {
        case ClaimTypes.REFUND_REQUEST:
          handleClickBundleCondition({
            claimType,
            orderId,
            itemId: claimInfo.itemId,
            itemOptionId: claimInfo.itemOptionId,
          });
          break;
        case ClaimTypes.RETURN_REQUEST:
          handleClickBundleCondition({
            claimType,
            orderId,
            itemId: claimInfo.itemId,
            itemOptionId: claimInfo.itemOptionId,
            exportId: claimInfo.exportId,
          });
          break;
        case ClaimTypes.EXCHANGE_REQUEST:
          handleClickBundleCondition({
            claimType,
            orderId,
            itemId: claimInfo.itemId,
            itemOptionId: claimInfo.itemOptionId,
            exportId: claimInfo.exportId,
            goodsOptionId,
          });
          break;
        case ClaimTypes.TICKET_REFUND_REQUEST:
          handleNavigate({
            claimType,
            orderId,
            queryObj: { exportId: claimInfo.exportId },
            processType: ProcessTypes.REASON,
            appLinkParams: { landingType: 'modal', rootNavigation: true },
          });
          break;
        case ClaimTypes.CANCEL_FULL_REQUEST:
          break;
        case ClaimTypes.RETURN_VIEW:
        case ClaimTypes.EXCHANGE_VIEW:
          // 반품/교환 상세의 경우, cancelOrReturnId만 활용 및 기존 로직 유지 위해 orderId 자리 삽입
          handleNavigate({
            claimType,
            orderId: claimInfo.cancelOrReturnId || 0,
            appLinkParams: { landingType: 'push', rootNavigation: true },
          });
          break;
        case ClaimTypes.RETURN_WITHDRAW:
        case ClaimTypes.EXCHANGE_WITHDRAW:
          handleWithdrawReturnChange({
            cancelOrReturnId: claimInfo.cancelOrReturnId,
            itemOptionId: claimInfo.itemOptionId,
            type: claimType,
          });
          break;
        default:
          break;
      }
    };

    /** 묶음 가능 여부에 따른 화면 이동 및 데이터 전달 구분 */
    const handleNavigateBundle = async ({
      hasBundle,
      claimType,
      ...data
    }: {
      hasBundle: boolean;
      claimType: ValueOf<typeof ClaimTypes>;
      goodsOptionId?: number;
    } & GetClaimBundleRequest) => {
      if (!claimType) return;
      const { orderId: orderIdData, ...queryParams } = data;
      const exportId = claimType !== ClaimTypes.REFUND_REQUEST ? queryParams.exportId : undefined;
      const goodsOptionIdData = claimType === ClaimTypes.EXCHANGE_REQUEST ? queryParams.goodsOptionId : undefined;
      handleNavigate({
        orderId: orderIdData,
        queryObj: hasBundle ? { ...queryParams } : { hasBundle, ...queryParams },
        claimType,
        processType: hasBundle ? ProcessTypes.BUNDLE : ProcessTypes.REASON,
        appLinkParams: { landingType: 'modal', rootNavigation: true },
        initialData: hasBundle
          ? {}
          : {
              itemInfoList: [
                {
                  itemId: queryParams.itemId,
                  itemOptionId: queryParams.itemOptionId,
                  exportId,
                  goodsOptionId: goodsOptionIdData,
                },
              ],
            },
      });
    };

    /** 묶음 가능 여부 서비스 호출 */
    const handleClickBundleCondition = async ({
      claimType,
      ...params
    }: { claimType: ValueOf<typeof ClaimTypes>; goodsOptionId?: number } & GetClaimBundleRequest) => {
      if (claimType === ClaimTypes.REFUND_REQUEST) {
        const responseData = onCancelPartialBundle && (await onCancelPartialBundle(params));
        responseData && (await handleNavigateBundle({ hasBundle: responseData?.hasBundle, claimType, ...params }));
      }
      if (claimType === ClaimTypes.RETURN_REQUEST) {
        const responseData = onReturnBundle && (await onReturnBundle(params));
        responseData && (await handleNavigateBundle({ hasBundle: responseData?.hasBundle, claimType, ...params }));
      }
      if (claimType === ClaimTypes.EXCHANGE_REQUEST) {
        const responseData = onExchangeBundle && (await onExchangeBundle(params));
        responseData && (await handleNavigateBundle({ hasBundle: responseData?.hasBundle, claimType, ...params }));
      }
    };

    const SHOW_SELECT_MIN_COUNT = 4;
    /** 액션 버튼 노출 수량 체크 */
    const getShowActionButtonCount = () => {
      // 1:1문의 항상 노출
      let showButtonListCount = 1;
      if (ticketResendable && ticketResendParams) showButtonListCount += 1;
      if (returnDelivery) showButtonListCount += 1;
      if (claimTypeList && claimTypeList.length > 0) showButtonListCount += claimTypeList.length;
      if ((deliveryType === 'PARCEL' && deliveryUrl) || deliveryType === 'DIRECT') showButtonListCount += 1;
      return showButtonListCount;
    };

    const handleActions = (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      if (value === 'deliveryType-parcel') {
        handleClickParcelDelivery();
        if (isApp) {
          window.location.href = deliveryUrl || '/';
          return;
        }
        window.open(deliveryUrl, '_blank');
      } else if (value === 'deliveryType-direct') {
        // 이벤트 로깅
        logMyOrderTabCheckDelivery({ order_status: orderStatus });
        // 직접배송(화물배송)의 경우 토스트 메시지를 표시
        showToastMessage({ message: '해당 상품은 직접배송 상품으로\n개별 안내드립니다' });
      } else {
        handleClickQna();
        window.location.href = questionUrl || '/';
      }
    };

    /** 액션 Select 컴포넌트 */
    const ActionSelect = () => {
      return (
        <label className="action-button action-option">
          <Select className="action-select" onChange={handleActions} value="" placeholder="선택">
            <>
              {deliveryType === 'PARCEL' && deliveryUrl && (
                <Option key="deliveryType-parcel" value="deliveryType-parcel">
                  배송 조회
                </Option>
              )}
              {deliveryType === 'DIRECT' && (
                <Option key="deliveryType-direct" value="deliveryType-direct">
                  배송 조회
                </Option>
              )}
              <Option key="qna" value="qna">
                1:1 문의
              </Option>
            </>
          </Select>
          <OptionIcon color="gray50" />
        </label>
      );
    };

    return (
      <div className={className}>
        {/* 티켓 문자 재발송 */}
        {ticketResendable && ticketResendParams && (
          <OrderAction {...buttonProps} disabled={!resendable} onClick={handleClickResend}>
            재전송
          </OrderAction>
        )}

        {/* 회수 조회 버튼 */}
        {returnDelivery && (
          <OrderAction {...buttonProps} is="a" link={toExternalLink(returnDelivery.trackingUrl)} target="_blank">
            회수 조회
          </OrderAction>
        )}
        {/* 취교반 요청/내역 버튼 */}
        {claimTypeList &&
          claimTypeList.map(({ type, claimInfo }: ClaimInfoTypes) => (
            <OrderAction
              {...buttonProps}
              key={type}
              description={cancelableDateAsString}
              onClick={() => handleClickClaimCondition({ type, claimInfo })}
              disabledAnimation={isCancelFee}
            >
              {ClaimManageInfo[type].actionTitle}
            </OrderAction>
          ))}

        {getShowActionButtonCount() >= SHOW_SELECT_MIN_COUNT ? (
          <ActionSelect />
        ) : (
          <>
            {/* 택배사 배송 조회 버튼 */}
            {deliveryType === 'PARCEL' && deliveryUrl && (
              <OrderAction
                {...buttonProps}
                is="a"
                link={deliveryUrl}
                target="_blank"
                onClick={handleClickParcelDelivery}
              >
                배송 조회
              </OrderAction>
            )}

            {/* 직접(화물) 배송 조회 버튼 */}
            {deliveryType === 'DIRECT' && (
              <OrderAction {...buttonProps} onClick={handleClickDirectDelivery}>
                배송 조회
              </OrderAction>
            )}

            {/* 문의하기 (항상 노출) */}
            <OrderAction {...buttonProps} is="a" link={questionUrl} onClick={handleClickQna}>
              1:1 문의
            </OrderAction>
          </>
        )}
      </div>
    );
  },
)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s8};

  .action-button {
    min-width: 4rem;
    min-height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .action-option {
    border: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
    border-radius: ${({ theme }) => theme.radius.r8};
    background: none;
    position: relative;
    opacity: 1;
    transition: opacity 0.2s;

    &:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }

    .action-select {
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
`;
