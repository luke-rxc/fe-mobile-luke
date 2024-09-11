import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';
import { InformationModel } from '../models';

interface Props {
  informationList: InformationModel;
  className?: string;
}

export const GoodsInformationTicket: React.FC<Props> = ({ informationList, className }) => {
  const { information, providerInfo } = informationList;
  const { address, businessNumber, mailOrderSalesNumber, name, presidentName, email } = providerInfo;

  return (
    <Wrapper className={className}>
      <ListWrapper>
        {information.map(({ id, title, contents }, index) => (
          <ListTicket key={id}>
            <Title>
              {index + 1}. {title}
            </Title>
            <p className="contents">
              <span className="contents-inner">{contents}</span>
            </p>
            <Divider className="divider" />
          </ListTicket>
        ))}
      </ListWrapper>
      <Title>판매자정보</Title>
      <ListWrapper>
        <List>
          <p className="title">입점사명</p>
          <p className="contents">{name}</p>
        </List>
        <List>
          <p className="title">사업자번호</p>
          <p className="contents">{businessNumber}</p>
        </List>
        <List>
          <p className="title">통신판매업 신고번호</p>
          <p className="contents">{mailOrderSalesNumber}</p>
        </List>
        <List>
          <p className="title">대표자명</p>
          <p className="contents">{presidentName}</p>
        </List>
        <List>
          <p className="title">사업장소재지</p>
          <p className="contents">{address}</p>
        </List>
        <List>
          <p className="title">이메일</p>
          <p className="contents">{email}</p>
        </List>
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 2.4rem 2.4rem 2.4rem;

  & .divider {
    margin: 1.25rem 0 1.2rem 0;
    padding: 0;
    &.is-ios::after {
      height: 0.07rem;
    }
  }

  & .no-padding {
    padding: 0;
  }
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fontType.mediumB};
  padding: 1.902rem 0 1.91rem 0;
  color: ${({ theme }) => theme.color.text.textPrimary};
  /* Work break */
  ${({ theme }) => theme.mixin.wordBreak()}
  overflow: hidden;
`;

const ListWrapper = styled.ul`
  font: ${({ theme }) => theme.fontType.small};
`;

const List = styled.li`
  display: flex;
  padding: 1.15rem 0;
  line-height: 1.7rem;
  .title {
    width: 12rem;
    margin-right: 0.8rem;
    color: ${({ theme }) => theme.color.text.textTertiary};
    flex-shrink: 0;
  }
  .contents {
    flex: 1;
    color: ${({ theme }) => theme.color.text.textPrimary};
    /* Work break */
    ${({ theme }) => theme.mixin.wordBreak()}
    overflow: hidden;
  }
`;

const ListTicket = styled.li`
  .contents {
    color: ${({ theme }) => theme.color.text.textSecondary};
    padding: 0.4rem 0;
    white-space: pre-wrap;
    /* Work break */
    ${({ theme }) => theme.mixin.wordBreak()}
    overflow: hidden;

    .contents-inner {
      display: block;
      overflow: hidden;
    }

    &::before {
      float: left;
      display: block;
      margin-top: 0.8rem;
      width: 0.2rem;
      height: 0.2rem;
      margin-right: 0.6rem;
      border-radius: 100%;
      background: ${({ theme }) => theme.color.text.textTertiary};
      content: '';
    }
  }
`;
