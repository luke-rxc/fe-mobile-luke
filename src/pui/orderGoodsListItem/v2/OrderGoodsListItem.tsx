/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { forwardRef, Fragment } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { UniversalLinkTypes } from '@constants/link';
import { useDDay } from '@services/useDDay';
import { getUniversalLink } from '@utils/link';
import { toHHMMSS } from '@utils/toTimeformat';
import { Image, ImageProps } from '@pui/image';
import { Conditional } from '@pui/conditional';
import { ListItemSelect } from '@pui/listItemSelect';

export interface OrderGoodsListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'onChange'> {
  /** 상품 이미지 */
  goodsImage?: Omit<ImageProps, 'width' | 'height' | 'radius'>;
  /** 브랜드명 */
  brandName?: string | null;
  /** 상품명 */
  goodsName: string;
  /** 할인율 */
  discountRate?: number;
  /** 정가 */
  consumerPrice?: number;
  /** 배송상태 */
  orderStatus?: string;
  /** 배송상태 색상 */
  orderStatusColor?: string;
  /** 판매가 */
  price?: number;
  /** 사용자 액션 영역 커스터마이징 */
  action?: React.ReactNode;
  /** 좌측 영역 커스터마이징 */
  prefix?: React.ReactNode;
  /** 링크 */
  link?: string;
  /** 상품 code */
  goodsCode?: string;
  /** 구매 가능 여부 */
  buyable?: boolean;
  /** 상품 상태 (품절, 판매불가 등) */
  goodsStatusText?: string;
  /** 상품 옵션 */
  options?: string[];
  /** 상품 수량 */
  quantity?: number | null;
  /** press 효과 유무 */
  press?: boolean;
  /** 티켓 유효기간 */
  ticketValidity?: TicketValidityProps;
  /** 라디오 | 체크박스 UI 선택 */
  selectType?: 'checkbox' | 'radio';
  /** 라디오 버튼 사용 유무 */
  selectable?: boolean;
  /** 라디오 버튼 사용시 체크 유무 */
  checked?: boolean;
  /** 라디오 버튼 사용시 기본 체크 상태 */
  defaultChecked?: boolean;
  /** 라디오 버튼 체크 상태 변경 이벤트 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, item: OrderGoodsListItemProps) => void;
}

const OrderGoodsListItemComponent = forwardRef<HTMLDivElement, OrderGoodsListItemProps>((props, ref) => {
  const {
    goodsImage,
    brandName,
    goodsName,
    discountRate = 0,
    consumerPrice = 0,
    price = 0,
    orderStatus,
    orderStatusColor,
    action,
    prefix,
    goodsStatusText,
    link,
    press,
    goodsCode,
    buyable = true,
    options = [],
    quantity,
    ticketValidity,
    selectType = 'checkbox',
    selectable = false,
    checked,
    defaultChecked,
    onChange,
    ...rest
  } = props;
  const className = classnames(rest.className, { 'not-buyable': !buyable });
  const history = useHistory();
  const { isApp } = useDeviceDetect();

  const { web: webUrl, app: appUrl } = (goodsCode && getUniversalLink(UniversalLinkTypes.GOODS, { goodsCode })) || {
    web: '',
    app: '',
  };

  const href = link ?? (isApp ? appUrl : webUrl);

  const pressDimmedRef = React.useRef<HTMLDivElement>(null);

  const isPressedEffect = React.useMemo<boolean>(() => {
    return press || (!selectable && !!href);
  }, [link, press, webUrl, appUrl, selectable]);

  //
  const handleEventPropagation = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    event?.stopPropagation();
  };

  //
  const handleCellTouchEnd = React.useCallback(() => {
    if (pressDimmedRef?.current && isPressedEffect) {
      pressDimmedRef?.current.removeAttribute('style');
    }
  }, [pressDimmedRef?.current, isPressedEffect]);

  //
  const handleCellTouchStart = React.useCallback(() => {
    if (pressDimmedRef?.current && isPressedEffect) {
      pressDimmedRef?.current.setAttribute('style', 'opacity: 1;');
    }
  }, [pressDimmedRef?.current, isPressedEffect]);

  //
  const handelCellClick = React.useCallback(() => {
    if (!selectable && href) {
      // eslint-disable-next-line no-return-assign
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isApp ? (window.location.href = href) : history.push(href);
    }
  }, [href]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e, props);
  };

  return (
    <div {...rest} ref={ref} className={className}>
      <Conditional
        className="goods-box"
        condition={selectable}
        trueExp={
          <ListItemSelect
            is="div"
            type={selectType}
            selectable
            disabled={!buyable}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
          />
        }
        falseExp={
          <div
            tabIndex={0}
            onClick={handelCellClick}
            onTouchStart={handleCellTouchStart}
            onTouchEnd={handleCellTouchEnd}
          />
        }
      >
        <div className="goods-pressed-dimmed" ref={pressDimmedRef} />
        {prefix && <div className="goods-prefix-box">{prefix}</div>}
        <div className={`goods-info-box ${brandName == null ? 'no-brand' : ''}`}>
          <div className="goods-info">
            {!buyable && goodsStatusText && <span className="goods-status-text">{goodsStatusText}</span>}
            {brandName && <span className="brand-name">{brandName}</span>}
            <span className="goods-name">{goodsName}</span>
            {(options || quantity) && <GoodsOptions className="goods-options" options={options} quantity={quantity} />}
            {ticketValidity && <TicketValidity {...ticketValidity} className="goods-ticket-validity" />}
            {buyable && (
              <div className="goods-order-box">
                {orderStatus && <span className="goods-order-delivery">{orderStatus}</span>}
                <GoodsPrice
                  className="goods-order-price"
                  discountRate={orderStatus ? 0 : discountRate}
                  consumerPrice={consumerPrice}
                  price={price}
                />
              </div>
            )}
            {action && (
              <div
                className="goods-action-box"
                tabIndex={0}
                onClick={handleEventPropagation}
                onTouchStart={handleEventPropagation}
                onTouchEnd={handleEventPropagation}
              >
                {action}
              </div>
            )}
          </div>
          <div className="goods-img-box">
            <div className="goods-img-wrapper">
              <Image {...goodsImage} className="goods-image" width="8.8rem" height="8.8rem" radius="0.8rem" />
            </div>
          </div>
        </div>
      </Conditional>
    </div>
  );
});

/**
 * figma GoodsOrderListItem 컴포넌트
 */
export const OrderGoodsListItem = styled(OrderGoodsListItemComponent)`
  position: relative;
  background: ${({ theme }) => theme.color.background.surface};

  & .goods-pressed-dimmed {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${({ theme }) => theme.color.states.pressedCell};
    opacity: 0;
    transition: opacity 0.2s;
  }

  & .brand-box {
    padding: 1rem 0;
  }

  & .brand-name {
    ${({ theme }) => theme.mixin.ellipsis()};
    flex: none;
    flex-grow: 0;
    order: 1;
    width: 100%;
    margin-bottom: 0.4rem;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.smallB};
  }

  & .goods-box:not(${ListItemSelect}) {
    display: flex;
    flex-basis: 100%;
    flex-shrink: 1;
    padding: 1.2rem 2.4rem;
    outline: none;
  }

  & .goods-box${ListItemSelect} {
    .item-inner {
      padding-top: ${({ theme }) => theme.spacing.s4};
      padding-bottom: ${({ theme }) => theme.spacing.s12};
      font-size: inherit;
    }

    .item-content {
      padding-top: ${({ theme }) => theme.spacing.s8};
    }
  }

  & .goods-box-anchor {
    width: 100%;
  }

  & .goods-prefix-box {
    display: inline-flex;
    flex-direction: column;
    margin-right: 0.8rem;
    padding: 0.2rem;
  }

  & .goods-action-box {
    margin-top: 1.6rem;
  }

  & .goods-info-box {
    display: flex;
    flex-grow: 1;
    gap: 8px;
    justify-content: space-between;
    width: 100%;

    &.no-brand {
      align-items: center;
    }
  }

  & .goods-name {
    flex: none;
    margin-bottom: 0.4rem;
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.medium};
    word-wrap: break-word;
    word-break: break-all;
  }

  & .goods-option {
    margin-bottom: 0;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
  }

  & .goods-info {
    overflow: hidden;

    & .goods-status-text,
    & .brand-name,
    & .goods-name,
    & .goods-options {
      display: block;
    }

    & .goods-ticket-validity {
      display: flex;
      flex-direction: column;
    }
  }

  & .goods-order-box {
    display: inline-flex;
    margin-top: ${({ orderStatus }) => (!orderStatus ? '0.8rem' : '1rem')};

    & .goods-order-delivery {
      flex: none;
      flex-grow: 0;
      order: 0;
      margin-right: 0.6rem;
      color: ${({ theme, orderStatusColor }) => orderStatusColor ?? theme.color.brand.tint};
      font: ${({ theme }) => theme.fontType.smallB};
    }
  }

  & .goods-img-box {
    display: inline-flex;
    flex-direction: column;
    align-self: start;
    height: 100%;

    & .goods-image {
      & .img-box {
        overflow: hidden;
        position: relative;
        width: 100%;
        padding-top: 100%;

        & .img-in {
          display: flex;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  & .goods-img-wrapper {
    position: relative;
    background: ${({ theme }) => theme.color.background.bg};
    line-height: 0;

    &,
    & .goods-image-lnk > .imgbx,
    & .goods-image-lnk > .imgbx img {
      border-radius: ${({ theme }) => theme.radius.r8};
    }
  }

  &.not-buyable {
    .goods-name,
    .goods-option-item {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }

    .goods-img-wrapper:after {
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      border-radius: ${({ theme }) => theme.radius.r8};
      background: ${({ theme }) => theme.color.states.disabledMedia};
      content: '';
    }

    .goods-status-text {
      margin-bottom: 0.4rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.miniB};
    }
  }
`;

export interface GoodsOptionsProps {
  /** option 리스트 */
  options?: string[];
  /** 구매 수량 */
  quantity?: number | null;
  /** 클래스명 */
  className?: string;
}

export const GoodsOptions = styled(({ options, quantity, className }: GoodsOptionsProps) => {
  const isAppendBar = (index: number): boolean => {
    return options ? index !== options?.length - 1 || !!quantity : false;
  };

  return (
    <span className={className}>
      {!isEmpty(options) &&
        options?.map((option, index) => (
          <Fragment key={index.toString()}>
            <span className="goods-option-item">{option}</span>
            {isAppendBar(index) && <span className="goods-option-bar" />}
          </Fragment>
        ))}
      {quantity && <span className="goods-option-item">{quantity}개</span>}
    </span>
  );
})`
  line-height: 0;

  .goods-option-item {
    position: relative;
    margin-right: 0.8rem;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
  }

  .goods-option-bar {
    display: inline-block;
    width: 0.1rem;
    height: 1.2rem;
    margin-right: 0.8rem;
    background: ${({ theme }) => theme.color.backgroundLayout.line};
    vertical-align: middle;
  }

  .goods-option-item:last-child {
    margin-right: 0;
  }
`;

export interface TicketValidityProps {
  /** 만료일 표기 */
  expiryDateText: string;
  /** 만료일시 */
  expiryDate: number;
  /** 곧 만료예정 */
  soonExpire?: boolean;
  /** D-Day 기간인 경우 */
  dDays?: boolean;
  /** 카운트 다운여부 */
  usableCountDown?: boolean;
  /** 티켓 상태 */
  status?: {
    code: string;
    name: string;
  };
  /** 티켓 만료 이벤트 */
  onTicketExpired?: () => void;
  /** 클래스 명 */
  className?: string;
  /** 탑승자 정보 */
  userName?: string;
}

export const TicketValidity = styled(
  ({
    userName,
    className,
    expiryDateText,
    expiryDate,
    soonExpire,
    usableCountDown,
    onTicketExpired,
  }: TicketValidityProps) => {
    const { countDown, isEnd } = useDDay({
      time: usableCountDown ? expiryDate ?? 0 : -1,
      enabled: usableCountDown,
    });

    React.useEffect(() => {
      usableCountDown && isEnd && onTicketExpired?.();
    }, [usableCountDown, isEnd]);

    return (
      <span className={className}>
        <span className={`ticket-validity ${soonExpire ? 'is-soon' : ''}`}>
          {usableCountDown ? toHHMMSS(countDown) : expiryDateText}
        </span>
        <span className={`ticket-validity ${soonExpire ? 'is-soon' : ''}`}>{userName ?? userName}</span>
      </span>
    );
  },
)`
  margin-top: ${({ theme }) => theme.spacing.s8};
  font: ${({ theme }) => theme.fontType.miniB};

  .ticket-validity {
    color: ${({ theme }) => theme.color.text.textTertiary};

    &.is-soon {
      color: ${({ theme }) => theme.color.semantic.noti};
    }
  }
`;

export interface GoodsPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 할인율 */
  discountRate: number;
  /** 판매가 */
  price: number;
  /** 정가 */
  consumerPrice: number;
}

export const GoodsPrice = styled(
  forwardRef<HTMLDivElement, GoodsPriceProps>(({ discountRate, price, consumerPrice, ...rest }, ref) => {
    const className = classnames(rest.className);
    const priceText = price.toLocaleString();
    const consumerPriceText = consumerPrice.toLocaleString();

    return (
      <div {...rest} className={className} ref={ref}>
        {discountRate > 0 && <span className="rate">{discountRate}%</span>}

        <span className="price">
          {priceText}
          <span className="unit">원</span>
        </span>

        {discountRate > 0 && (
          <span className="consumer">
            {consumerPriceText}
            <span className="unit">원</span>
          </span>
        )}
      </div>
    );
  }),
)`
  color: ${({ theme }) => theme.color.text.textPrimary};
  font: ${({ theme }) => theme.fontType.smallB};
  text-align: left;

  & .consumer {
    display: block;
    margin-top: 0.2rem;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
    line-height: 1.4rem;
    text-decoration: line-through;
  }

  .rate {
    display: inline-block;
    margin-right: 0.6rem;
    color: ${({ theme }) => theme.color.semantic.sale};
  }

  .price {
    color: ${({ theme }) => theme.color.text.textPrimary};
  }
`;
