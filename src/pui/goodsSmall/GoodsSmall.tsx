/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/aria-role */
import React, { forwardRef, Fragment } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Image, ImageProps } from '@pui/image';

export interface GoodsSmallProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 상품 이미지 데이터 */
  image: Omit<ImageProps, 'radius' | 'width' | 'height' | 'lazy' | 'resizeWidth'>;
  /** 상품명 */
  goodsName: string;
  /** 상품 코드 - 상품상세 랜딩을 위한 데이터 */
  goodsCode?: string;
  /** 브랜드명 */
  brandName?: string;
  /** 상품 옵션정보 데이터 */
  options?: string[];
  /** 링크기능을 비활성화 */
  noLink?: boolean;
}

export const GoodsSmallComponent = forwardRef<HTMLDivElement, GoodsSmallProps>((props, ref) => {
  const { goodsName, goodsCode, brandName, image, options, noLink, ...rest } = props;

  const { getLink } = useLink();
  const link = goodsCode ? getLink(UniversalLinkTypes.GOODS, { goodsCode }) : '';
  const linkable = !!goodsCode && !noLink;

  return (
    <div ref={ref} {...rest}>
      <Conditional
        className="goods-inner"
        condition={linkable}
        trueExp={<Action is="a" link={link} />}
        falseExp={<span role="text" />}
      >
        <span className="goods-thumb">
          <Image lazy resizeWidth={192} {...image} />
        </span>

        <span className="goods-info">
          {brandName && <span className="brand">{brandName}</span>}
          <span className="name">{goodsName}</span>
          {options && !isEmpty(options) && (
            <span className="options">
              {options.map((option, index) => (
                <Fragment key={`${option}-${index}`}>
                  {option}
                  {index < options.length - 1 && <span className="bar" />}
                </Fragment>
              ))}
            </span>
          )}
        </span>
      </Conditional>
    </div>
  );
});

/**
 * GoodsSmall 컴포넌트
 */
export const GoodsSmall = styled(GoodsSmallComponent)`
  .goods-inner {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 7.2rem;
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    background: ${({ theme }) => theme.color.background.surface};
    transition: background 0.2s ease 0s;

    &${Action}:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }

  .goods-thumb {
    display: block;
    width: 4.4rem;
    height: 4.4rem;
    flex-shrink: 0;
    border-radius: ${({ theme }) => theme.radius.r8};

    ${Image} {
      display: block;
      border-radius: inherit;
    }
  }

  .goods-info {
    display: flex;
    overflow: hidden;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    margin-left: ${({ theme }) => theme.spacing.s12};
    gap: ${({ theme }) => theme.spacing.s2};

    .brand {
      font: ${({ theme }) => theme.fontType.miniB};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }

    .name {
      ${({ theme }) => theme.mixin.ellipsis()};
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .options {
      ${({ theme }) => theme.mixin.ellipsis()};
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }

    .bar {
      display: inline-block;
      width: 0.1rem;
      height: 1.2rem;
      margin: ${({ theme }) => `0 ${theme.spacing.s8}`};
      background: ${({ theme }) => theme.color.backgroundLayout.line};
    }
  }
`;
