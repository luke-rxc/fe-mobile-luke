import styled from 'styled-components';
import { OptionBubble } from './OptionBubble';
import { BubbleValuesType, OptionBubbleSelectedValuesType } from '../types';

interface Props {
  title: string;
  bubbles: BubbleValuesType[];
  selected: OptionBubbleSelectedValuesType;
  index?: number;
  onClick: (row: string, item: BubbleValuesType, index?: number) => void;
}

export const OptionBubbleRow = ({ title, bubbles, selected, index, onClick: handleClick }: Props) => {
  return (
    <Wrapper>
      <div className="title">{title}</div>
      <div className="bubble-wrapper">
        {bubbles.map((bubble) => {
          const { title: bubbleTitle, disabled, price } = bubble;

          const isSelected = selected && selected.row === title && selected.item === bubbleTitle;

          return (
            <OptionBubble
              key={bubbleTitle}
              option={bubbleTitle}
              price={price}
              selected={isSelected}
              disabled={disabled}
              onClick={() => handleClick(title, bubble, index)}
            />
          );
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .title {
    ${({ theme }) => theme.absolute({ t: 0, l: 0 })};
    display: flex;
    align-items: center;
    height: 5.6rem;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  .bubble-wrapper {
    display: flex;
    width: 100%;
    padding: ${({ theme }) => `5.6rem ${theme.spacing.s24} ${theme.spacing.s16}`};
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    ${OptionBubble} + ${OptionBubble} {
      margin-left: ${({ theme }) => theme.spacing.s8};
    }
  }
`;
