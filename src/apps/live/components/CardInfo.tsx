import styled from 'styled-components';

interface Props {
  cardName: string;
  cardNumber: string;
}

const toMask = (cardNumber: string) => {
  return (
    <span className="dot-wrapper">
      {cardNumber.split('').map((_, index) => {
        return <DotStyled key={`dot${index.toString()}`} />;
      })}
    </span>
  );
};

/**
 * 카드정보 component
 */
export const CardInfo = ({ cardName, cardNumber }: Props) => {
  const cardNo1 = (cardNumber ?? '').slice(0, 4);
  const cardNo2 = toMask((cardNumber ?? '').slice(4, 8));
  const cardNo3 = toMask((cardNumber ?? '').slice(8, 12));
  const cardNo4 = (cardNumber ?? '').slice(12, 16);
  return (
    <CardInfoStyled>
      <div className="text-wrapper">
        <span className="card-name">{cardName}</span>
        <span className="card-number">
          {cardNo1}
          {cardNo2}
          {cardNo3}
          {cardNo4}
        </span>
      </div>
    </CardInfoStyled>
  );
};

const CardInfoStyled = styled.span`
  display: flex;
  align-items: center;

  .dot-wrapper {
    display: inline-flex;

    &:first-child {
      padding-left: 0.1rem;
    }

    &:last-child {
      padding-right: 0.1rem;
    }
  }

  .text-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    font: ${({ theme }) => theme.fontType.t12};
    color: ${({ theme }) => theme.color.gray50};
  }

  .card-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 11.2rem);
  }

  .card-number {
    margin-left: 5px;
    flex: 0 0 auto;
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
