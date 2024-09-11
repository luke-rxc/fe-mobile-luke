import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import styled, { useTheme } from 'styled-components';
import classNames from 'classnames';
import { PGType } from '@constants/order';
import {
  Card,
  CardFilled,
  IconProps,
  KBPayFilled,
  KakaoFilled,
  NaverPayFilled,
  PrizmPayFilled,
  TossFilled,
} from '@pui/icon';

export type PayIconProps = HTMLAttributes<HTMLDivElement> & {
  /** 결제 타입 */
  pgType: PGType;
  /** 활성 여부 */
  active?: boolean;
  /** 트랜지션 사용여부 */
  noTransition?: boolean;
  /** 아이콘 추가 옵션 */
  icons?: Pick<IconProps, 'size' | 'minSize' | 'maxSize' | 'color'>;
};

const PayIconComponent = forwardRef<HTMLDivElement, PayIconProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, pgType, active, noTransition = false, icons }, ref) => {
    const pgName = useMemo(() => {
      switch (pgType) {
        case PGType.CREDIT_CARD:
          return 'credit';
        case PGType.NAVER_PAY:
          return 'naver';
        case PGType.KAKAO_PAY:
          return 'kakao';
        case PGType.TOSS_PAY:
          return 'toss';
        case PGType.PRIZM_PAY:
          return 'prizm-pay';
        case PGType.KB_PAY:
          return 'kb-pay';
        default:
          return '';
      }
    }, [pgType]);

    return (
      <div
        ref={ref}
        className={classNames(className, pgName, {
          'is-active': active,
        })}
      >
        {pgType === PGType.CREDIT_CARD && (
          <>
            <div className="ico-wrapper ico-inactive">
              <Card {...(icons && { ...icons })} />
            </div>
            <div className="ico-wrapper ico-active">
              <CardFilled {...(icons && { ...icons })} />
            </div>
          </>
        )}
        {pgType === PGType.NAVER_PAY && (
          <>
            <div className="ico-wrapper ico-inactive">
              <NaverPayFilled {...(icons && { ...icons })} />
            </div>
            <div className="ico-wrapper ico-active">
              <NaverPayFilled {...(icons && { ...icons })} />
            </div>
          </>
        )}
        {pgType === PGType.KAKAO_PAY && (
          <>
            <div className="ico-wrapper ico-inactive">
              <KakaoFilled {...(icons && { ...icons })} />
            </div>
            <div className="ico-wrapper ico-active">
              <KakaoFilled {...(icons && { ...icons })} />
            </div>
          </>
        )}
        {pgType === PGType.TOSS_PAY && (
          <>
            <div className="ico-wrapper ico-inactive">
              <TossFilled {...(icons && { ...icons })} />
            </div>
            <div className="ico-wrapper ico-active">
              <TossFilled {...(icons && { ...icons })} />
            </div>
          </>
        )}
        {pgType === PGType.PRIZM_PAY && (
          <>
            <div className="ico-wrapper ico-inactive">
              <PrizmPayFilled {...(icons && { ...icons })} />
            </div>
            <div className="ico-wrapper ico-active">
              <PrizmPayFilled {...(icons && { ...icons })} />
            </div>
          </>
        )}
        {pgType === PGType.KB_PAY && (
          <>
            <div className="ico-wrapper ico-inactive">
              <KBPayFilled {...(icons && { ...icons })} />
            </div>
            <div className="ico-wrapper ico-active">
              <KBPayFilled {...(icons && { ...icons })} />
            </div>
          </>
        )}
      </div>
    );
  },
);

export const PayIcon = styled(PayIconComponent).attrs(() => {
  const { isDarkMode } = useTheme();
  return {
    isDarkMode,
  };
})`
  position: relative;
  width: 100%;
  height: 100%;
  & .ico-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: opacity;
    transition: ${({ noTransition }) => `${noTransition ? '' : 'opacity 0.2s'}`};
  }

  & .ico-active {
    opacity: 0;
  }
  & .ico-inactive {
    opacity: 1;
  }

  &.is-active {
    & .ico-active {
      opacity: 1;
    }
    & .ico-inactive {
      opacity: 0;
    }
  }

  &.credit {
    & .ico-active {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.brand.tint};
      }
    }
    & .ico-inactive {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.gray20};
      }
    }
  }
  &.naver {
    & .ico-active {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme, isDarkMode }) => (isDarkMode ? theme.color.black : '#03C75A')};
      }
    }
    & .ico-inactive {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.gray20};
      }
    }
  }
  &.kakao {
    & .ico-active {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme, isDarkMode }) => (isDarkMode ? theme.color.black : '#3B2324')};
      }
    }
    & .ico-inactive {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.gray20};
      }
    }
  }
  &.toss {
    & .ico-active {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme, isDarkMode }) => (isDarkMode ? theme.color.black : '#0064FF')};
      }
    }
    & .ico-inactive {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.gray20};
      }
    }
  }
  &.prizm-pay {
    & .ico-active {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.brand.tint};
      }
    }
    & .ico-inactive {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.gray20};
      }
    }
  }
  &.kb-pay {
    & .ico-active {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme, isDarkMode }) => (isDarkMode ? theme.color.black : '#FFBC00')};
      }
    }
    & .ico-inactive {
      & svg *[fill],
      svg *[stroke] {
        fill: ${({ theme }) => theme.color.gray20};
      }
    }
  }
`;
