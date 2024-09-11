import styled from 'styled-components';
import { getUniversalLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { UniversalLinkTypes } from '@constants/link';
import { Action } from '@pui/action';

const { isApp } = userAgent();

export const href = (...args: Parameters<typeof getUniversalLink>) => {
  const { web, app } = getUniversalLink(...args);
  return isApp ? app : web;
};

export const DescriptionText = styled.p`
  white-space: pre-line;
  word-break: keep-all;
  text-align: center;
  color: ${({ theme }) => theme.color.text.textHelper};
  font: ${({ theme }) => theme.fontType.micro};
  .link {
    color: ${({ theme }) => theme.color.text.textLink};
  }
`;

const FooterBoxStyled = styled.div`
  width: 100%;
  cursor: none;
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
`;

export const DrawAuthFooter = () => {
  return (
    <FooterBoxStyled>
      <DescriptionText>
        본{' '}
        <Action is="a" className="link" link={href(UniversalLinkTypes.POLICY_PRIVACY, { section: 'marketing' })}>
          이벤트 및 쿠폰 마케팅 정보 수신
        </Action>{' '}
        약관 내용을 확인 및 동의하였으며, 응모에 참여합니다.
      </DescriptionText>
    </FooterBoxStyled>
  );
};
