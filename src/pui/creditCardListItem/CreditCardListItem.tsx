import styled from 'styled-components';
import classnames from 'classnames';
import { Image } from '@pui/image';
import { forwardRef } from 'react';

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

const DotStyled = styled.span`
  position: relative;
  width: 0.7rem;
  height: 0.7rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;

  &::after {
    content: '';
    position: absolute;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.gray50};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export interface CreditCardListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** logo 이미지 url */
  logoUrl: string;
  /** 카드 이름 */
  name: string;
  /** 카드 번호 */
  no: string;
  /** 카드 색상 */
  color: string;
  /** 기본 카드 유무 */
  primary?: boolean;
  /** 카드 만료 여부 */
  expired?: boolean;
  /** 항목 우측 커스터마이징 */
  suffix?: React.ReactNode;
}

const CreditCardListItemComponent = forwardRef<HTMLDivElement, CreditCardListItemProps>(
  ({ logoUrl, name, no, primary = false, expired = false, suffix = null, ...rest }, ref) => {
    const className = classnames(rest.className, { expired });
    const maskedNo = toCardNoWithMask(no);

    return (
      <div {...rest} ref={ref} className={className}>
        <span className="logo-img-box">{logoUrl && <Image src={logoUrl} className="logo-img" />}</span>
        <div className="card-content">
          {expired ? (
            <span className="badge-wrapper">
              <span className="badge expired">기간만료</span>
            </span>
          ) : (
            primary && (
              <span className="badge-wrapper">
                <span className="badge">주카드</span>
              </span>
            )
          )}
          <span className="card-name">{name}</span>
          <span className="card-no">{maskedNo}</span>
        </div>
        {suffix && <div className="suffix-wrapper">{suffix}</div>}
      </div>
    );
  },
);

/**
 * Figma CreditCardListItem 컴포넌트
 */
export const CreditCardListItem = styled(CreditCardListItemComponent)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.2rem 1.6rem 1.2rem 2.4rem;

  & .logo-img-box {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${({ color }) => color};
    padding: 0.8rem 1.2rem;
    min-width: 9.6rem;
    width: 9.6rem;
    min-height: 6.4rem;
    height: 6.4rem;
    border-radius: ${({ theme }) => theme.radius.r8};

    & .logo-img {
      width: 7.2rem;
      height: 4.8rem;
      background: none;
    }
  }

  & .card-content {
    display: inline-flex;
    flex-basis: 100%;
    flex-shrink: 1;
    flex-direction: column;
    margin-left: 1.6rem;

    & > span {
      word-break: break-word;
      &:first-child {
        margin-top: 0.1rem;
      }

      margin-top: 0.6rem;
    }

    & .card-name {
      font: ${({ theme }) => theme.fontType.mediumB};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    & .card-no {
      display: flex;
      align-items: center;
      font: ${({ theme }) => theme.fontType.mini};
      line-height: 1.4rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  & .badge-wrapper {
    display: inline-flex;

    & .badge {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0.3rem 0.6rem;
      min-width: 4rem;
      font: ${({ theme }) => theme.fontType.microB};
      border-radius: 5rem;
      background: ${({ theme }) => theme.color.brand.tint3};
      color: ${({ theme }) => theme.color.brand.tint};
      line-height: 1.2rem;
      text-align: center;
    }
  }

  & .suffix-wrapper {
    margin-left: 1.6rem;
  }

  &.expired {
    & .logo-img-box::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${({ theme }) => theme.color.background.surface};
      opacity: 0.7;
      border-radius: ${({ theme }) => theme.radius.r8};
    }

    & .card-name,
    & .card-no {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }

    & .badge {
      background: ${({ theme }) => theme.color.brand.tint3};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }

    ${DotStyled} {
      &::after {
        background: ${({ theme }) => theme.color.text.textDisabled};
      }
    }
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
`;
