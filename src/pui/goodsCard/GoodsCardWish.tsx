import React, { forwardRef, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { Like, LikeFilled } from '@pui/icon';
import { Like as LikeLottie, LottieRef } from '@pui/lottie';

/** 위시리스트를 Display 할때 필요한 Prop + 연동에 필수적인 Prop */
export interface GoodsCardWishUpdateProps {
  /** 위시리스트 선택된 상태인지 */
  wished: boolean;
  /** 위시리스트 선택시 motion 작동여부, @default false */
  wishedMotion?: boolean;
  /** 위시리스트 연동시 진행할 쇼룸 ID */
  showRoomId: number;
}

export type GoodsCardWishChangeParams = GoodsCardWishUpdateProps & {
  /** 위시리스트 연동시 진행할 상품 번호 */
  goodsId: number;
  /** 위시리스트 연동시 진행할 상품 Code */
  goodsCode: string;
};

export type GoodsCardWishProps = GoodsCardWishChangeParams &
  Omit<React.HTMLAttributes<HTMLButtonElement>, 'id'> & {
    onChangeWish?: (wish: GoodsCardWishChangeParams) => void;
  };

/**
 * Wished - Wish 된 상태, Not Motion
 * WishedMotion - Wish 될때 Motion 과 함께 활성화
 * NoWished - Wish 해제된 상태, Not Motion
 */
type WishDisplayType = 'Wished' | 'WishedMotion' | 'NoWished';

const getWishDisplayType = ({
  wished,
  wishedMotion,
}: Pick<GoodsCardWishProps, 'wished' | 'wishedMotion'>): WishDisplayType => {
  if (!wished) {
    return 'NoWished';
  }
  return wishedMotion ? 'WishedMotion' : 'Wished';
};

const getWished = (wishType: WishDisplayType) => wishType !== 'NoWished';

const GoodsCardWishComponent = forwardRef<HTMLButtonElement, GoodsCardWishProps>(
  ({ goodsId, goodsCode, showRoomId, wished, wishedMotion = false, className, onChangeWish }, ref) => {
    const { theme } = useTheme();
    const lottie = useRef<LottieRef>(null);
    const { wishItemUpdatedValues } = useWebInterface();
    const [wishType, setWishType] = useState<WishDisplayType>(getWishDisplayType({ wished, wishedMotion }));

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onChangeWish?.({
        goodsId,
        goodsCode,
        showRoomId,
        wished: getWished(wishType),
      });

      event.preventDefault();
      event.stopPropagation();
    };

    useEffect(() => {
      if (wishItemUpdatedValues && wishItemUpdatedValues.goodsId === goodsId) {
        const { isAdded } = wishItemUpdatedValues;
        const updatedType = getWishDisplayType({
          wished: isAdded,
          wishedMotion: isAdded,
        });
        const isChangeState = wishType !== updatedType;

        isChangeState && setWishType(updatedType);
      }
    }, [wishItemUpdatedValues, goodsId, wishType]);

    return (
      <Button className={className} ref={ref} onClick={handleClick}>
        {wishType === 'Wished' && <LikeFilled size="2.4rem" color="red" />}
        {wishType === 'NoWished' && <Like size="2.4rem" colorCode="rgba(0, 0, 0, 0.20)" />}
        {wishType === 'WishedMotion' && (
          <div className="lottie">
            <LikeLottie
              ref={lottie}
              animationOptions={{
                loop: false,
                autoplay: true,
              }}
              lottieColor={theme.color.red}
              className="lottie-motion"
            />
            <Like size="2.4rem" color="red" className="lottie-bg" />
          </div>
        )}
      </Button>
    );
  },
);

export const GoodsCardWish = styled(GoodsCardWishComponent)`
  width: 4.4rem;
  height: 4.4rem !important;

  .lottie {
    position: relative;
    margin-top: 0.3rem;
    .lottie-bg {
      position: absolute;
      top: 0;
      left: 0;
    }
    .lottie-motion {
      position: relative;
      z-index: 1;
      width: 2.4rem;
      height: auto;
    }
  }
`;
