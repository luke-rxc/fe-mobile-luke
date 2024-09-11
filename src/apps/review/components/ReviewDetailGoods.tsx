import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { UniversalLinkTypes } from '@constants/link';
import type { ReviewGoodsModel } from '@features/review/models';
import { useLink } from '@hooks/useLink';
import { Image } from '@pui/image';
import { convertHexToRGBA } from '@utils/color';
import { useLogService } from '../services';

/**
 * 리뷰 상품 영역
 */
export type ReviewDetailGoodsProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  /** 리뷰 id */
  id: number;
  /** 상품 정보 */
  goods: ReviewGoodsModel;
};
const ReviewDetailGoodsComponent = forwardRef<HTMLDivElement, ReviewDetailGoodsProps>(
  ({ className, id, goods }, ref) => {
    const { toLink, getLink } = useLink();
    const { logTapReviewGoodsBanner } = useLogService();
    const [isActive, setIsActive] = useState(false);
    const { image, brandName, name, code } = goods;

    const handleActionLink = () => {
      // 진입 로그
      const params = {
        goodsId: goods.id,
        goodsName: goods.name,
        reviewId: id,
        optionId: goods.options?.id ?? null,
        optionName:
          goods.options?.itemList && goods.options.itemList.length > 0
            ? goods.options.itemList.map((item) => item.value).join(',')
            : '',
      };
      logTapReviewGoodsBanner(params);

      const link = getLink(UniversalLinkTypes.GOODS, { goodsCode: code });
      toLink(link);
    };

    const handleTouchStart = () => {
      setIsActive(true);
    };

    const handleTouchEnd = () => {
      setIsActive(false);
    };

    return (
      <div
        ref={ref}
        className={classNames(className, { 'is-active': isActive })}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleActionLink}
      >
        <>
          {image && (
            <div className="image-wrapper">
              <Image src={image.path} lazy />
            </div>
          )}
          <div className="text-wrapper">
            {brandName && <p className="text prd-brand">{brandName}</p>}
            <p className="text prd-name">{name}</p>
          </div>
        </>
      </div>
    );
  },
);

export const ReviewDetailGoods = styled(ReviewDetailGoodsComponent)`
  display: flex;
  position: relative;
  align-items: center;
  height: 7.2rem;
  padding: 1.4rem 2.4rem;
  transition: transform 0.2s;

  & .image-wrapper {
    overflow: hidden;
    flex-shrink: 0;
    width: 4.4rem;
    height: 4.4rem;
    margin-right: 1.2rem;
    border-radius: ${({ theme }) => theme.radius.s8};
    background: ${({ theme }) => theme.color.white};

    & img {
      width: 100%;
      height: 100%;
      border-radius: ${({ theme }) => theme.radius.s8};
      vertical-align: middle;
      object-fit: cover;
    }
  }

  & .text-wrapper {
    overflow: hidden;
    width: 100%;
    margin-right: 2.4rem;
    text-align: left;

    & .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;

      &.prd-brand {
        margin-bottom: 0.2rem;
        color: ${({ theme }) => theme.color.gray50};
        font: ${({ theme }) => theme.fontType.t12B};
      }

      &.prd-name {
        color: ${({ theme }) => theme.color.black};
        font: ${({ theme }) => theme.fontType.t14};
      }
    }
  }

  &.is-active {
    &::before {
      ${({ theme }) => theme.absolute({ t: 0, r: 0, b: 0, l: 0 })};
      background: ${({ theme }) => convertHexToRGBA(theme.color.black, 0.03)};
      content: '';
    }

    &.modal {
      transform: scale(0.96);

      &::before {
        z-index: 4;
        border-radius: ${({ theme }) => theme.radius.s12};
      }
    }
  }
`;
