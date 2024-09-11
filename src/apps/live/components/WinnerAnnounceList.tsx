import styled, { keyframes } from 'styled-components';
import classNames from 'classnames';

interface WinnerAnnounceListProps {
  winnerList: string[];
  nickname: string;
}

export const WinnerAnnounceList = ({ winnerList, nickname }: WinnerAnnounceListProps) => {
  const loserContent = nickname ? '다음에 다시 도전해주세요' : '다음엔 꼭 참여해보세요';

  return (
    <>
      {!winnerList.includes(nickname) && (
        <LoserContentWrapperStyled>
          <span className="loser-content">{loserContent}</span>
        </LoserContentWrapperStyled>
      )}
      {winnerList.map((value) => (
        <ContentItemsStyled key={value} text={value}>
          <span className={classNames('winner-content', { 'is-winner': value === nickname })}>{value}</span>
        </ContentItemsStyled>
      ))}
    </>
  );
};
const winnerTransition = keyframes`
  0% { transform: scale(1); } // 0s
  16.67% { transform: scale(1.1); } // 0.125s
  33.33% { transform: scale(1); } // 0.25s

  100% { transform: scale(1); } // 0.75s
`;

const LoserContentWrapperStyled = styled.div`
  margin: 0 auto;
  width: 32rem;
  height: 4rem;
  padding: 0 2.4rem;
  ${({ theme }) => theme.mixin.centerItem()};

  .loser-content {
    width: 27.2rem;
    height: 1.8rem;
    text-align: center;
    color: ${({ theme }) => theme.light.color.tint};
    font: ${({ theme }) => theme.fontType.t15B};
  }
`;

const ContentItemsStyled = styled.div<{ text: string }>`
  margin: 0 auto;
  width: 32rem;
  height: 6.4rem;
  padding: 0 2.4rem;
  color: ${({ theme }) => theme.light.color.gray50};
  font-size: ${({ theme, text }) => (text.length >= 18 ? theme.fontSize.s28 : theme.fontSize.s32)};
  ${({ theme }) => theme.mixin.centerItem()};

  .winner-content {
    width: 27.2rem;
    height: 3.8rem;
    line-height: 3.8rem;
    text-align: center;

    &.is-winner {
      color: ${({ theme }) => theme.light.color.tint};
      font-weight: ${({ theme }) => theme.fontWeight.bold};
      animation-name: ${winnerTransition};
      animation-duration: 0.75s;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }
  }
`;
