import styled from 'styled-components';
import { LiveFaqItemModel } from '../models';
import { RichText } from './RichText';
import { CollapseSection } from './CollapseSection';

interface Props {
  item: LiveFaqItemModel;
  itemIndex: number;
  onClickItem: (faqId: number, title: string, index: number) => void;
}

export const FaqItem = ({ item: { id: faqId, question, answer }, itemIndex, onClickItem: handleClickItem }: Props) => {
  const onClick = (expand: boolean) => {
    if (!expand) {
      handleClickItem(faqId, question, itemIndex);
    }
  };
  return (
    <CollapseSection title={question} onClickTitle={onClick}>
      <AnswerStyled>
        <RichText originText={answer} />
      </AnswerStyled>
    </CollapseSection>
  );
};

const AnswerStyled = styled.div`
  font: ${({ theme }) => theme.fontType.medium};
  line-height: 1.8rem;
  white-space: pre-wrap;
  padding: 0.8rem ${({ theme }) => theme.spacing.s24};
  margin-bottom: ${({ theme }) => theme.spacing.s24};
`;
