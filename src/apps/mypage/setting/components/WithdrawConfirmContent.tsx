import { Divider } from '@pui/divider';
import { List } from '@pui/list';
import { ListItemText } from '@pui/listItemText';
import styled from 'styled-components';

export interface WithdrawConfirmContentProps {
  title: string;
  description: string[];
  divider?: boolean;
}

export const WithdrawConfirmContent = ({ title, description, divider }: WithdrawConfirmContentProps) => {
  return (
    <>
      <TitleWrapperStyled>
        <p className="title">{title}</p>
      </TitleWrapperStyled>
      <ListWrapperStyled>
        {description.map((text) => (
          <ListItemWrapperStyled key={text}>{text}</ListItemWrapperStyled>
        ))}
      </ListWrapperStyled>
      {divider && <Divider />}
    </>
  );
};
const TitleWrapperStyled = styled.div`
  padding: 1.6rem 2.4rem 2rem;
  font: ${({ theme }) => theme.fontType.t18B};
  .title {
    white-space: pre-wrap;
  }
`;
const ListWrapperStyled = styled(List)`
  margin-bottom: ${({ theme }) => theme.spacing.s24};
`;
const ListItemWrapperStyled = styled(ListItemText)`
  margin-bottom: ${({ theme }) => theme.spacing.s8};
`;
