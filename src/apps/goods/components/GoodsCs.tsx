import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';

interface Props {
  className?: string;
}

export const GoodsCs: React.FC<Props> = ({ className }) => {
  return (
    <Wrapper className={className}>
      <Section>
        <h2 className="title bold">반품/교환 안내</h2>
        <ul>
          <li>
            <p>배송 완료 시점으로부터 7일 이내</p>
          </li>
          <li>
            <p>
              수령한 제품이 표시/광고 내용과 다른 경우 수령 받은 날로부터 3개월 이내, 그 사실을 안 날로부터 30일 이내
            </p>
          </li>
          <li>
            <p>상품 회수 및 확인 후 반품/교환 처리</p>
          </li>
        </ul>
      </Section>
      <Divider className="divider" />
      <Section>
        <h2 className="title bold">반품/교환 비용</h2>
        <ul>
          <li>
            <p>상품 불량 및 오배송 등의 사유로 반품 요청 시, 반품 배송비 무료</p>
          </li>
          <li>
            <p>
              단순 변심인 경우 배송 비용과 반품/교환 왕복 배송비 발생 (최초 배송비가 무료인 경우 왕복 배송비 차감 후
              환불 될 수 있음)
            </p>
          </li>
          <li>
            <p>구매 시점에 따라 적용되는 반품 배송비는 다를 수 있으며, 구매 당시의 배송비로 적용</p>
          </li>
          <li>
            <p>여러 개의 박스로 나누어 발송된 경우 박스당 반품 배송비 부과</p>
          </li>
        </ul>
      </Section>
      <Divider className="divider" />
      <Section>
        <h2 className="title bold">반품/교환 제한</h2>
        <ul>
          <li>
            <p>반품/교환 가능 기간을 초과하였을 경우 </p>
          </li>
          <li>
            <p>상품 및 구성품을 분실하였거나 부주의로 인해 파손, 고장, 오염으로 상품의 가치가 훼손된 경우</p>
          </li>
          <li>
            <p>세트 상품 중 일부를 사용한 경우</p>
          </li>
          <li>
            <p>
              상품 포장을 개봉하여 사용 또는 설치 완료되어 상품 가치가 훼손된 경우 (상품 확인을 위한 포장 훼손 제외)
            </p>
          </li>
          <li>
            <p>사용 또는 일부 소비에 의해 상품 가치가 훼손된 경우</p>
          </li>
          <li>
            <p>
              재고가 부족한 경우
              <br />
              (단순 변심으로 교환 신청했으나 재고가 부족한 경우 환불 처리될 수 있음)
            </p>
          </li>
          <li>
            <p>모니터 해상도 차이로 인해 색상 등 이미지가 실제와 다른 경우</p>
          </li>
        </ul>
      </Section>
      <Section>
        <h3 className="title">상품별 반품/교환 제한</h3>
        <dl>
          <dt>경매 입찰</dt>
          <dd>경매 입찰에서 거래가 체결된 이후 단순 변심인 경우 (상품 불량, 오배송 제외)</dd>
        </dl>
        <dl>
          <dt>의류, 잡화, 수입명품</dt>
          <dd>상품 TAG 제거, 라벨 및 상품 훼손, 구성품 누락으로 상품 가치가 훼손된 경우</dd>
        </dl>
        <dl>
          <dt>뷰티</dt>
          <dd>
            상품 이용 시 트러블이 발생한 경우 진료 확인서 및 소견서 등 증빙 가능한 경우는 반품 가능 (배송비 고객 부담)
          </dd>
        </dl>
        <dl>
          <dt>신선 식품 (냉장, 냉동, 생물)</dt>
          <dd>사유가 단순 변심인 경우</dd>
        </dl>
        <dl>
          <dt>주문/제작</dt>
          <dd>상품 제작이 이미 진행이 된 경우</dd>
        </dl>
        <dl>
          <dt>가전, 디지털, 가구, 설치</dt>
          <dd>
            - 설치나 사용으로 재판매가 불가한 경우
            <br />
            - 액정이 있는 상품의 전원을 연결한 경우
            <br />- 상품의 고유 시리얼넘버, 보증 라벨, 홀로그램 등이 분리, 분실, 훼손하여 상품 가치가 훼손된 경우
          </dd>
        </dl>
        <dl>
          <dt>복제 가능 (CD, DVD, 책, 게임)</dt>
          <dd>포장이 개봉/훼손된 경우</dd>
        </dl>
      </Section>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 2.4rem 2.4rem 2.4rem;

  & .divider {
    margin-top: 1.25rem;
    padding: 0;
  }
`;

const Section = styled.div`
  margin-top: 1.2rem;
  &:first-child {
    margin-top: 0;
  }
  & .title {
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
    padding: 1.9rem 0;
    &.bold {
      font-weight: ${({ theme }) => theme.fontWeight.bold};
    }
  }

  & ul {
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.text.textSecondary};

    & li {
      display: -webkit-box;
      padding: 0.4rem 0;
      & p {
        padding-right: 1rem;
        word-break: keep-all;
      }
    }

    & li::before {
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

  & dl {
    display: flex;
    padding: 0.8rem 0;
    font: ${({ theme }) => theme.fontType.small};
    & dt {
      color: ${({ theme }) => theme.color.text.textTertiary};
      margin-right: 0.8rem;
      width: 8rem;
      word-break: keep-all;
    }
    & dd {
      color: ${({ theme }) => theme.color.text.textPrimary};
      flex: 1;
      word-break: keep-all;
    }
  }
`;
