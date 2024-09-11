import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '@assets/logo_prizm.svg';
import { WebLinkTypes } from '@constants/link';
import { useCollapse } from '@hooks/useCollapse';
import { getWebLink } from '@utils/link';
import { Action } from '@pui/action';
import { Divider } from '@pui/divider';
import { ChevronDown } from '@pui/icon';
import { toDateFormat } from '@utils/date';

/**
 * styled logos
 */
const PrizmLogo = styled(Logo)``;

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  expanded?: boolean;
  defaultExpanded?: boolean;
  /** 이용약관등의 정책관련 랜딩 hide 여부 */
  hidePolicyLink?: boolean;
}

const FooterComponent = forwardRef<HTMLElement, FooterProps>(
  ({ expanded, hidePolicyLink, defaultExpanded, ...props }, ref) => {
    const collapseEl = useRef<HTMLDivElement>(null);
    const { setExpanded, controllerProps, collapseProps } = useCollapse(collapseEl, { expanded, defaultExpanded });

    const handleToggle = () => {
      setExpanded((expand) => !expand);
    };

    const currentYear = toDateFormat(Date.now(), 'yyyy');

    return (
      <footer ref={ref} {...props}>
        <div className="footer-logo">
          <Action onClick={handleToggle} {...controllerProps}>
            <PrizmLogo />
            <ChevronDown />
          </Action>
        </div>

        <div ref={collapseEl} className="footer-info" {...collapseProps}>
          <div className="footer-info-inner">
            <div>
              <address className="address">
                <span className="address-item">회사명: (주)알엑스씨</span>
                <span className="address-item">대표: 유한익</span>
                <span className="address-item">사업자등록번호: 284-88-01847</span>
                <span className="address-item">통신판매업: 2021-서울강남-05596</span>
                <span className="address-item">대표번호: 1644-3920</span>
                <span className="address-item">이메일: contact@prizm.co.kr</span>
                <span className="address-item">
                  사업장 소재지: 서울특별시 강남구 선릉로 602, 10~14층(삼성동,삼릉빌딩)
                </span>
                <span className="address-item">호스팅서비스: Amazon Web Services, Inc</span>
              </address>
              <Divider l={0} r={0} />
              <p className="compulsory">
                (주)알엑스씨는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 상품, 상품 정보, 거래, 배송에 관한
                의무와 책임은 판매자에게 있습니다.
              </p>
            </div>
          </div>
        </div>

        {!hidePolicyLink && (
          <div className="footer-links">
            <Action is="a" link={getWebLink(WebLinkTypes.POLICY_TERM)} children="이용약관" />
            <Action
              is="a"
              link="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=2848801847"
              target="_blank"
              children="사업자정보"
            />
            <Action
              is="a"
              link={getWebLink(WebLinkTypes.POLICY_PRIVACY)}
              children="개인정보처리방침"
              className="is-bold"
            />
            <Action is="a" link="mailto:partner@rxc.co.kr" children="입점문의" />
          </div>
        )}
        <div className="footer-copy">&copy; {currentYear} RXC</div>
      </footer>
    );
  },
);

/**
 * Figma Footer 컴포넌트
 *
 * Notion - https://www.notion.so/rxc/Footer-9ff699e916084555917e4ef80413c580
 * @TODO - collapse모션 고도화
 */
export const Footer = styled(FooterComponent)`
  padding: ${({ theme }) => `${theme.spacing.s24} ${theme.spacing.s32}`};
  background: ${({ theme }) => theme.color.background.surface};
  color: ${({ theme }) => theme.color.text.textTertiary};
  text-align: center;

  .footer-logo {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 3.2rem;

    ${Action} {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: ${({ theme }) => theme.spacing.s8};
    }

    ${PrizmLogo} {
      width: 6.9rem;
      height: 1.2rem;
      color: ${({ theme }) => theme.color.text.textPrimary};

      & *[fill] {
        fill: currentColor;
      }
      & *[stroke] {
        stroke: currentColor;
      }
    }

    ${ChevronDown} {
      width: 1.2rem;
      height: 1.2rem;
      margin-left: ${({ theme }) => theme.spacing.s8};
      transition: transform 250ms;
    }

    ${Action}[aria-expanded='true'] {
      ${ChevronDown} {
        transform: rotate(180deg);
      }
    }
  }

  .footer-info {
    &-inner {
      ${({ theme }) => theme.mixin.wordBreak};
      padding: ${({ theme }) => `${theme.spacing.s4} 0`};
      font: ${({ theme }) => theme.fontType.micro};
    }

    .address {
      &-item {
        padding-left: ${({ theme }) => theme.spacing.s12};
      }
      &:first-child:after {
        padding-left: 0;
      }

      .address-item {
        display: inline-block;
      }
    }

    ${Divider} {
      margin-top: ${({ theme }) => theme.spacing.s12};
    }

    .compulsory {
      margin-top: ${({ theme }) => theme.spacing.s12};
    }
  }

  .footer-links {
    margin-top: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.mini};

    ${Action} {
      display: inline-block;
      position: relative;
      padding: ${({ theme }) => `0 ${theme.spacing.s8}`};

      &:after {
        ${({ theme }) => theme.mixin.absolute({ t: '50%', l: 0 })};
        transform: translateY(-50%);
        width: 0.1rem;
        height: 1rem;
        background: ${({ theme }) => theme.color.gray8};
        content: '';
      }

      &:first-child:after {
        display: none;
      }
    }

    ${Action}.is-bold {
      font-weight: bold;
    }
  }

  .footer-copy {
    margin-top: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.mini};
  }
`;
