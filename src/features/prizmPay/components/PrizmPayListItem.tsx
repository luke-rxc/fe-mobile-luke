import styled from 'styled-components';
import classnames from 'classnames';
import { HTMLAttributes } from 'react';
import { PrizmPayCardLogoImage } from './PrizmPayCardLogoImage';

export interface Props {
  logoUrl: string;
  name: string;
  no: string;
  color: string;
  className?: string;
  isDefault?: boolean;
  isExpired?: boolean;
  isPlay?: boolean;
  suffix?: React.ReactNode;
  badgeLabel?: string;
  disabled?: boolean;
}

function toCardNoWithMask(no: string) {
  const cardNo1 = (no ?? '').slice(0, 4);
  const cardNo2 = toMask((no ?? '').slice(4, 8));
  const cardNo3 = toMask((no ?? '').slice(8, 12));
  const cardNo4 = (no ?? '').slice(12, 16);
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

export const PrizmPayListItem = ({
  logoUrl,
  name,
  no,
  color,
  className: classNameProps,
  isPlay = false,
  suffix,
  badgeLabel,
  disabled,
}: Props) => {
  const className = classnames(classNameProps, { disabled });
  const logoImageClassName = classnames('logo-img-box', { disabled });

  return (
    <ContainerStyled className={className}>
      <PrizmPayCardLogoImage className={logoImageClassName} src={logoUrl} isPlay={isPlay} color={color} />
      <div className="card-content">
        {badgeLabel && <Badge label={badgeLabel} />}
        <span className="card-name">{name}</span>
        <span className="card-no">{toCardNoWithMask(no)}</span>
      </div>
      {suffix && <div className="suffix-wrapper">{suffix}</div>}
    </ContainerStyled>
  );
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
}

const Badge = styled(({ label, ...reset }: BadgeProps) => {
  return (
    <span {...reset}>
      <span className="badge expired">{label}</span>
    </span>
  );
})`
  display: inline-flex;

  & .badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.3rem 0.6rem;
    min-width: 4rem;
    font: ${({ theme }) => theme.fontType.t10B};
    border-radius: 5rem;
    background: ${({ theme }) => theme.color.tint3};
    color: ${({ theme }) => theme.color.tint};
    line-height: 1.2rem;
    text-align: center;
  }
`;

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

const ContainerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.2rem 1.6rem 1.2rem 2.4rem;
  position: relative;

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

      margin-top: ${({ theme }) => theme.spacing.s4};
    }

    & .card-name {
      font: ${({ theme }) => theme.fontType.t15B};
      color: ${({ theme }) => theme.color.black};
    }

    & .card-no {
      display: flex;
      align-items: center;
      font: ${({ theme }) => theme.fontType.t12};
      line-height: 1.4rem;
      color: ${({ theme }) => theme.color.gray50};
    }
  }

  & .suffix-wrapper {
    margin-left: 1.6rem;
  }

  &.disabled {
    & .card-name,
    & .card-no {
      color: ${({ theme }) => theme.color.gray20};
    }

    & ${Badge} .badge {
      background: ${({ theme }) => theme.color.tint3};
      color: ${({ theme }) => theme.color.gray50};
    }

    ${DotStyled} {
      &::after {
        background: ${({ theme }) => theme.color.gray20};
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
