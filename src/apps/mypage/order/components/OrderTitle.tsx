import styled from 'styled-components';
import { ChevronRight } from '@pui/icon';
import { TitleSection } from '@pui/titleSection';
import { ButtonText } from '@pui/buttonText';
import { useClaimNavigate } from '../hooks';
import { ClaimTypes, ProcessTypes } from '../constants';

export interface OrderTitleProps {
  /** 주문 번호 */
  orderId: number;
  /** 타이틀 */
  title: string;
  /** 셀 클릭시 이동할 URL */
  href?: string;
  /** 교환 주문 여부 */
  isExchangeOrder?: boolean;
  /** 전체취소 가능 여부(해당값이 true일때 orderItemCount가 0이 아니면 "전체취소" 버튼 노출) */
  isAllCancellable?: boolean;
  /** 주문 상품 수(해당값이 0이 아닐때 isAllCancellable가 true "전체취소" 버튼 노출) */
  orderItemCount?: number;
  /** 컴포넌트 클래스네임 */
  className?: string;
}

export const OrderTitle = styled(
  ({ orderId, title, href, isExchangeOrder, isAllCancellable, orderItemCount, className }: OrderTitleProps) => {
    const { handleNavigate } = useClaimNavigate();
    /** 서브타이틀 */
    const subTitle = `${orderId}${isExchangeOrder ? '(교환상품)' : ''}`;

    /**
     * 주문상세에서 전체취소가능시 렌더될 타이틀
     */
    if (isAllCancellable && orderItemCount) {
      const label = orderItemCount && (orderItemCount > 1 ? '전체취소' : '주문취소');
      /** 취소 클릭 시 화면 이동을 위한 함수 */
      const handleClickCancleAllOrder = () => {
        handleNavigate({
          orderId,
          claimType: ClaimTypes.CANCEL_FULL_REQUEST,
          processType: ProcessTypes.REASON,
          appLinkParams: { landingType: 'modal', rootNavigation: true },
        });
      };

      return (
        <TitleSection
          className={className}
          title={title}
          subtitle={subTitle}
          suffix={<ButtonText onClick={handleClickCancleAllOrder} children={label} />}
        />
      );
    }

    /**
     * 주문내역 or 주문상세에서 전체취소 불가시 렌더될 타이틀
     */
    return (
      <TitleSection
        className={className}
        link={href}
        title={title}
        subtitle={subTitle}
        suffix={href && <ChevronRight />}
      />
    );
  },
)``;
