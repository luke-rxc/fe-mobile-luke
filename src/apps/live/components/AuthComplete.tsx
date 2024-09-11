import styled from 'styled-components';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { useLink } from '@hooks/useLink';
import { UniversalLinkTypes } from '@constants/link';

interface Props {
  isCompleted: boolean;
  onClick: () => void;
}

export const AuthComplete = ({ isCompleted, onClick: handleClick }: Props) => {
  const { getLink } = useLink();

  return (
    <FixedAreaStyled>
      <section className="content">
        <div className="description-box">
          <span className="text">
            경매 낙찰 시 등록된 카드로 자동 결제됩니다.
            <br />
            <Action
              className="policy-auction"
              is="a"
              link={getLink(UniversalLinkTypes.AUCTION_POLICY)}
              children="경매약관"
            />
            에 동의하며 입찰에 참여합니다.
          </span>
        </div>
        <Button
          bold
          block
          disabled={!isCompleted}
          variant="primary"
          size="large"
          children="완료"
          onClick={handleClick}
        />
      </section>
    </FixedAreaStyled>
  );
};

const FixedAreaStyled = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 0px;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};

  padding: 0 2.4rem;
  width: 100%;
  z-index: 1;

  &:before {
    display: block;
    width: 100%;
    height: 1.2rem;
    background: ${({ theme }) => `linear-gradient(180deg, ${theme.color.surface}00 0%, ${theme.color.surface} 100%)`};
    content: '';
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: ${({ theme }) => theme.color.surface};

    .description-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding-bottom: 1.2rem;

      .text {
        color: ${({ theme }) => theme.color.gray50};
        font: ${({ theme }) => theme.fontType.t10};
        line-height: 1.2rem;
        white-space: pre-line;
        text-align: center;

        .policy-auction {
          color: ${({ theme }) => theme.color.tint};
        }
      }
    }
  }
`;
