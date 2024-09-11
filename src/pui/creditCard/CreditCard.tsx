import classNames from 'classnames';
import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Image } from '@pui/image';

export interface CreditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 명칭 */
  name: string;
  /** 카드사 */
  company: string;
  /** 카드 번호 */
  no: string;
  /** 카드 색상 */
  color: string;
  /** 로고 이미지 url */
  logoUrl?: string;
  /** 카드 레이블 */
  cardLabel?: string;
  /** 뱃지 명칭 */
  badgeLabel?: string;
  /** 사용 여부 */
  disabled?: boolean;
}

function toCardNoWithMask(no: string) {
  const cardNo1 = no.slice(0, 4);
  const cardNo2 = toMask(no.slice(4, 8));
  const cardNo3 = toMask(no.slice(8, 12));
  const cardNo4 = no.slice(12, 16);
  return (
    <>
      {cardNo1}
      {cardNo2}
      {cardNo3}
      {cardNo4}
    </>
  );
}

function toMask(no: string) {
  return (
    <span className="dot-wrapper">
      {no.split('').map((_, index) => {
        return <DotStyled key={`dot${index.toString()}`} />;
      })}
    </span>
  );
}

const CreditCardComponent = forwardRef<HTMLDivElement, CreditCardProps>(
  ({ name, company, no, cardLabel, logoUrl, color, badgeLabel, disabled, ...rest }, ref) => {
    const className = classNames(rest.className, { disabled });

    return (
      <div {...rest} ref={ref} className={className}>
        <p className="card-info-box">
          {badgeLabel && <CreditCardBadge label={badgeLabel} className="badge" />}
          <span className="card-name">{name || company}</span>
          <span className="card-no">{toCardNoWithMask(no)}</span>
        </p>
        <span className="logo-img-box">{logoUrl && <Image src={logoUrl} className="logo-img" />}</span>
        <span className="card-label-box">{cardLabel}</span>
      </div>
    );
  },
);

/**
 * Figma CreditCard 컴포넌트
 */
export const CreditCard = styled(CreditCardComponent)`
  position: relative;
  width: 100%;
  max-width: 24rem;
  max-height: 14.4rem;
  padding-bottom: 60%;
  border-radius: ${({ theme }) => theme.radius.r8};
  background: ${({ color }) =>
    `${color} linear-gradient(151.15deg, rgba(255, 254, 254, 0.16) 5.63%, rgba(255, 254, 254, 0) 67.13%)`};

  & .card-info-box {
    display: flex;
    position: absolute;
    bottom: 1.6rem;
    left: 1.6rem;
    flex-direction: column;

    .card-name {
      /** 라이트/다크 모드 색상 고정 */
      color: ${({ theme }) => theme.color.whiteLight};
      font: ${({ theme }) => theme.fontType.mediumB};
    }

    .card-no {
      display: flex;
      align-items: center;
      opacity: 0.5;
      /** 라이트/다크 모드 색상 고정 */
      color: ${({ theme }) => theme.color.whiteLight};
      font: ${({ theme }) => theme.fontType.mini};
      line-height: 1.4rem;
    }

    & > .badge,
    & > .card-name,
    & > .card-no {
      margin-bottom: 0.4rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  & .logo-img-box {
    display: flex;
    position: absolute;
    top: 1.6rem;
    right: 0.8rem;
    align-items: center;
    justify-content: center;
    width: 7.2rem;
    height: 4.8rem;

    & .logo-img {
      background: none;
    }
  }

  & .card-label-box {
    position: absolute;
    right: 1.6rem;
    bottom: 1.6rem;
    opacity: 0.5;
    color: ${({ theme }) => theme.color.whiteLight};
    font: ${({ theme }) => theme.fontType.mini};
    line-height: 1.4rem;
  }

  .dot-wrapper {
    display: inline-flex;

    &:first-child {
      padding-left: 0.1rem;
    }

    &:last-child {
      padding-right: 0.1rem;
    }
  }

  &.disabled::after {
    content: '';
    background: ${({ theme }) => theme.color.states.disabledMedia};
    border-radius: ${({ theme }) => theme.radius.r8};
    ${({ theme }) =>
      theme.mixin.position('absolute', {
        t: 0,
        l: 0,
        r: 0,
        b: 0,
      })}
  }
`;

const DotStyled = styled.span`
  position: relative;
  width: 0.7rem;
  height: 0.7rem;
  padding-right: 0.2rem;
  padding-left: 0.2rem;

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.whiteLight};
    transform: translate(-50%, -50%);
    content: '';
  }
`;

export interface CreditCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
}

const CreditCardBadgeComponent = forwardRef<HTMLDivElement, CreditCardBadgeProps>(({ label, ...rest }) => {
  return (
    <span {...rest}>
      <span className="badge-label">{label}</span>
    </span>
  );
});

export const CreditCardBadge = styled(CreditCardBadgeComponent)`
  display: inline-flex;

  & .badge-label {
    padding: 0.3rem 0.6rem;
    border-radius: 5rem;
    background: ${({ theme }) => theme.color.gray20Light};
    /** 라이트/다크 모드 색상 고정 */
    color: ${({ theme }) => theme.color.whiteLight};
    font: ${({ theme }) => theme.fontType.microB};
  }
`;
