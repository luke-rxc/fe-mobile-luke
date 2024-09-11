/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useRef, useMemo, useState, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import head from 'lodash/head';
import { useDeepCompareEffect } from 'react-use';
import classnames from 'classnames';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Button } from '@pui/button';
import { Divider } from '@pui/divider';
import { getColor } from '../utils';
import { Showroom } from '../types';

export interface CouponItem {
  id: number;
  title: string;
  name: string;
}

export interface CouponListProps extends React.HTMLAttributes<HTMLDivElement> {
  expanded: boolean;
  /** 쇼룸 타입 */
  type?: Showroom;
  /** 다운로드한 쿠폰 리스트 */
  downloadedCoupons?: CouponItem[];
  /** 다운 가능한 쿠폰 */
  downloadableCoupons?: CouponItem[];
  /** 쿠폰 다운로드 버튼 클릭 이벤트 콜백 */
  onClickDownload?: (e: React.MouseEvent<HTMLButtonElement>, props: CouponListProps) => void;
  /** 쿠폰 페이지 링크 버튼 클릭 이벤트 콜백 */
  onClickCouponLink?: (e: React.MouseEvent<HTMLAnchorElement>, props: CouponListProps) => void;
}

export const CouponList = styled(
  forwardRef<HTMLDivElement, CouponListProps>((props, ref) => {
    const {
      expanded,
      type,
      downloadedCoupons = [],
      downloadableCoupons = [],
      onClickDownload,
      onClickCouponLink,
      ...rest
    } = props;
    const { getLink } = useLink();

    // status
    const [renderDOM, setRenderDOM] = useState<boolean>(!!expanded);
    const [expandStyles, setExpandStyles] = useState<React.CSSProperties>({});

    // coupon items
    const [downloadedItems, setDownloadedItems] = useState<CouponItem[]>(downloadedCoupons);
    const [downloadableItems, setDownloadableItems] = useState<CouponItem[]>(downloadableCoupons);

    // ref
    const container = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);

    /**
     * 쿠폰 정보가 여러개인가?
     */
    const multiple = (downloadedItems.length || 0) + (downloadableItems.length || 0) > 1;

    /**
     * 다운로드 가능상태인가?
     */
    const downloadable = !!downloadableItems.length;

    /**
     * summary 데이터
     */
    const summary = useMemo(() => {
      const coupons = downloadable ? downloadableItems : downloadedItems;

      const title = coupons.length > 1 ? `${coupons.length}장의 쿠폰` : `${head(coupons)?.title} 쿠폰`;
      const suffix = downloadable ? '다운로드 가능' : '다운로드 완료';

      return { title, suffix };
    }, [downloadedItems, downloadableItems, downloadable]);

    /**
     * 쿠폰 다운로드 이벤트 핸들러
     */
    const handleClickDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClickDownload?.(e, props);
    };

    /**
     * 쿠폰 확인하기 이벤트 핸들러
     */
    const handleClickCouponLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClickCouponLink?.(e, props);
    };

    /**
     * transition end 이벤트 핸들러 => 쿠폰 영역 확장후 DOM 제거
     */
    const handleCollapseEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target === container.current || e.propertyName === 'height') {
        !expanded && setRenderDOM(false);
      }
    };

    /**
     * 쿠폰리스트가 hidden되는 상태는 쇼룸을 언팔로우 할 때로
     * 쇼룸 언팔로우시 쇼룸 정보를 조회하는 API에서 쿠폰 데이터가 없는 상태로
     * 데이터가 갱신되서 전달됨. 이로 인해 쿠폰이 닫히는 애니매이션이 실행될때
     * 기존 쿠폰데이터가 유지 되지 않고 빈 상태로 변경됨. 이를 해결하기 위해
     * 쇼룸이 열린상태일떄만 쿠폰 status를 업데이트.
     */
    useDeepCompareEffect(() => {
      if (expanded) {
        setRenderDOM(true);
        setDownloadedItems(downloadedCoupons);
        setDownloadableItems(downloadableCoupons);
      } else {
        setExpandStyles({ height: 0 });
      }
    }, [expanded, downloadedCoupons, downloadableCoupons]);

    /**
     * 쿠폰이 보여지고 있는 상태에서 쿠폰리스트가 변경된 경우 height재조정
     */
    useEffect(() => {
      const height = content.current?.offsetHeight || 0;
      height && expanded && setExpandStyles({ height, transitionDuration: '0s' });
    }, [downloadedItems, downloadableItems]);

    /**
     * 쿠폰 콘텐츠가 렌더링된 후 쿠폰 콘텐츠의 높이 값 만큼 컨테이너에 적용
     */
    useEffect(() => {
      expanded && setExpandStyles({ height: content.current?.offsetHeight || 0 });
    }, [renderDOM]);

    /**
     * ref 전달
     */
    useImperativeHandle(ref, () => container.current as HTMLDivElement);

    return (
      <div ref={container} {...rest} style={expandStyles} onTransitionEnd={handleCollapseEnd}>
        {renderDOM && (
          <>
            <Divider />
            <div ref={content} className="coupon-content">
              <div className="coupon-info">
                <div className={classnames('summary', { 'is-done': !downloadable })}>
                  <em>{summary.title}</em> {summary.suffix}
                </div>
                {multiple &&
                  downloadableItems.map(({ id, title, name }) => (
                    <div key={id} className="item" children={`${title} ${name}`} />
                  ))}

                {multiple &&
                  downloadedItems.map(({ id, title, name }) => (
                    <div key={id} className="item is-done" children={`${title} ${name}`} />
                  ))}
              </div>

              <div className="coupon-action">
                {downloadable ? (
                  <Button
                    size="medium"
                    variant="primary"
                    className="action-download"
                    children="쿠폰다운"
                    onClick={handleClickDownload}
                  />
                ) : (
                  <Button
                    selected
                    is="a"
                    size="medium"
                    variant="primary"
                    className="action-confirm"
                    children="쿠폰확인"
                    link={getLink(UniversalLinkTypes.COUPON)}
                    onClick={handleClickCouponLink}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }),
)`
  position: relative;
  overflow: hidden;
  width: 100%;
  will-change: height;
  transition: height 600ms;

  .coupon-content {
    ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0, r: 0 })};
    ${({ theme }) => theme.mixin.wordBreak()};
    display: flex;
    padding: 2.4rem;
  }

  .coupon-info {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;

    .summary + .item {
      margin-top: 1.2rem;
    }

    .summary {
      font: ${({ theme }) => theme.fontType.t15};
      color: ${getColor('contentColor')};

      em {
        font-weight: bold;
        color: ${({ theme }) => theme.color.red};
      }

      &.is-done {
        color: ${getColor('contentColor')};
        opacity: 0.2;

        em {
          color: inherit;
        }
      }
    }

    .item {
      position: relative;
      margin-top: 0.8rem;
      padding-left: 0.9rem;
      font: ${({ theme }) => theme.fontType.t14};
      color: ${getColor('contentColor')};

      &:after {
        ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
        content: '•';
      }

      &.is-done {
        color: ${getColor('contentColor')};
        opacity: 0.2;
      }
    }
  }

  .coupon-action {
    flex-shrink: 0;
    margin-left: 0.4rem;

    .action-download {
      background: ${getColor('tintColor')};
      color: ${getColor('textColor')};
    }

    .action-confirm {
      box-shadow: 0 0 0 1px ${getColor('tintColor')} inset;
      background: transparent;
      color: ${getColor('tintColor')};
    }
  }
`;
