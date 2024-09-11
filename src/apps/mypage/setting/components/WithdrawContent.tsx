import styled from 'styled-components';

export interface WithdrawContentProps {
  title: string;
  description: string;
}

export const WithdrawContent = ({ title, description }: WithdrawContentProps) => {
  return (
    <TitleWrapper>
      <p className="title">{title}</p>
      <p className="description">{description}</p>
    </TitleWrapper>
  );
};
const TitleWrapper = styled.div`
  padding: 1.6rem 2.4rem 0;

  .title {
    font: ${({ theme }) => theme.fontType.t18B};
    margin-bottom: ${({ theme }) => theme.spacing.s12};
  }
  .description {
    font: ${({ theme }) => theme.fontType.t15};
    color: ${({ theme }) => theme.color.gray50};
  }
`;
