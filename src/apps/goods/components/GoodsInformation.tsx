import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';
import { InformationModel } from '../models';

interface Props {
  informationList: InformationModel;
  className?: string;
}

export const GoodsInformation: React.FC<Props> = ({ informationList, className }) => {
  const { information, providerInfo } = informationList;
  const { address, businessNumber, mailOrderSalesNumber, name, presidentName, email } = providerInfo;

  return (
    <Wrapper className={className}>
      <>
        <Title>상품고시</Title>
        <ListWrapper>
          {information.map(({ id, title, contents }) => (
            <List key={id}>
              <p className="title">{title}</p>
              <p className="contents">{contents}</p>
            </List>
          ))}
        </ListWrapper>
      </>
      <Divider className="divider no-padding" />
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
    margin: 1.34rem 0 1.2rem 0;
  }

  & .no-padding {
    padding: 0;
  }
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fontType.mediumB};
  padding: 1.902rem 0 1.91rem 0;
  color: ${({ theme }) => theme.color.text.textPrimary};
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
    white-space: pre-wrap;
    /* Work break */
    ${({ theme }) => theme.mixin.wordBreak()}
    overflow: hidden;
  }
`;
