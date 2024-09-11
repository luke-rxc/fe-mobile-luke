import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useQueryString } from '@hooks/useQueryString';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  headerTriggerRef?: React.RefObject<HTMLElement>;
}

export const Layout = ({ children, className, title = '', headerTriggerRef }: Props) => {
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const isActiveMwebFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV);
  const { section: sectionId = '' } = useQueryString<{ section?: string }>();
  const [isVisible, setIsVisible] = useState(false);

  useHeaderDispatch({
    type: 'mweb',
    enabled: isActiveMwebFlag,
    quickMenus: ['cart', 'menu'],
    title,
    transitionTrigger: headerTriggerRef,
    transitionBuffer: -56,
  });

  useEffect(() => {
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      // 특정 약관 섹션 노출
      targetEl.style.display = 'block';
    } else {
      // 약관 전문 노출
      setIsVisible(true);
    }
  }, [sectionId]);

  return <LayoutStyled className={classNames(className, { 'is-visible': isVisible })}>{children}</LayoutStyled>;
};

const LayoutStyled = styled.section(
  ({ theme }) => `
  padding: ${theme.spacing.s12} 0;
  font: ${theme.fontType.t14}
  color: ${theme.color.black};
 
  #policy-all{
    display: none;
  }

  &.is-visible {
    #policy-all{
      display: block;
    }
  }

  & .bold {
    font-weight: 700;
  }

  // li 의 list-style-type 을 사용하고 싶을때 진행
  p.indent-style {
    display: flex;
    & .mark {
      margin-right: 0.4rem;
    }
  }

  & h1 {
    font: ${theme.fontType.t18B};
    padding: 1.75rem 2.4rem;
  }

  & h2 {
    font: ${theme.fontType.t18B};
    padding: 1.75rem 2.4rem;
    color: ${theme.color.black}
  }

  & h3 {
    font: ${theme.fontType.t15B};
    padding: 1.9rem 2.4rem;
    color: ${theme.color.black}
  }

  &.app {
    & h2.first {
      padding-top: 0;
    }
  }

  /** 양옆 패딩을 처리 하기 위한 클래스 */
  & .layout-box {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
  }

  & article {
    margin-top: 1.2rem;
    color: ${theme.color.gray70};
    :first-of-type {
      margin-top: 0;
    }

  }

  & ol li {
    margin-left: ${theme.spacing.s24};
  }

  & ol.number-list li {
    margin-top: 1.8rem;
    list-style-type: decimal;
    &:first-child {
      margin-top: 0;
    }
  }

  .layout-text {
    font: ${theme.fontType.t14};
    padding: 0.4rem 0;
  }

  // 구분자 리스트
  & .lst-indent li {
    margin-left: 0;
    position:relative;
    padding-left: 2.4rem;
    & >.mark {
      position: absolute;
      top: 0.4rem;
      left: 0;
      color: ${theme.color.gray50};
    }
  }

  & .lst-indent.circle-delim>li {
    &::before {
      display: block;
      position: absolute;
      top: 0.4rem;
      left: 0;
      color: ${theme.color.gray50};
      content: '•';
    }
  }
  & .lst-indent.empty-circle-delim>li {
    &::before {
      display: block;
      position: absolute;
      top: 0.4rem;
      left: 0;
      color: ${theme.color.gray50};
      content: '◦';
    }
  }

  // 구분자 단일
  .indent {
    padding-left: 2.4rem;
    position:relative;
    & >.mark {
      position: absolute;
      top: 0.4rem;
      left: 0;
      color: ${theme.color.gray50};
    }
    &.circle-delim::before {
      display: block;
      position: absolute;
      top: 0.4rem;
      left: 0;
      color: ${theme.color.gray50};
      content: '•';
    }
    &.empty-circle-delim::before {
      display: block;
      position: absolute;
      top: 0.4rem;
      left: 0;
      color: ${theme.color.gray50};
      content: '◦';
    }
  }

  & .layout-select {
    position: relative;
  }

  & ol.date li {
    list-style-type: disc;
  }

  & ol.circle li {
    list-style-type: circle;
  }

  & ol.alpha li {
    list-style-type: lower-alpha;
  }

  & ol.roman {
    & li {
      list-style-type: lower-roman;
    }

    &.spacing-16 li {
      margin-left: ${theme.spacing.s16};
    }
  }

  & span {
    &.underline {
      text-decoration: underline;
    }
  }

  & .layout-table {
    padding-top: 2.4rem;
    padding-bottom: 2.4rem;

    & .table-box {
      overflow: auto;
      &.slide-type {
        padding-left: 2.4rem;
        & .col5{
          width: calc(600px + 2.4rem);
        }
        & .col6{
          width: calc(720px + 2.4rem);
        }
        & .table{
          table-layout: initial;
          width: initial;
        }
      }
    }
  }

  .layout-title {
    font: ${theme.fontType.t15};
    padding: 1.9rem 2.4rem;
    margin-top: 1.2rem;

    & + .layout-table {
      padding-top: 0;
    }
  }

  & .hyper-link {
    text-decoration: none;
    color: ${theme.color.tint}
  }

  & table {
    word-break: break-all;
    table-layout: fixed;
    width: 100%;

    // 열을 기준으로 테이블 Title 설정이 될때
    &.row-style {
      table-layout: auto;
      & td:first-child {
        background: ${theme.color.gray3};
        border-bottom: none;
      }
      & tr:first-child {
        & td {
          border-top: 1px solid ${theme.color.gray3};
          &:first-child {
            border-top: none;
          }
        }
      }
    }

    & th {
      padding: 1.2rem 1rem;
      box-sizing: border-box;
      font: ${theme.fontType.t12B};
      background: ${theme.color.gray3};
      text-align: left;
      vertical-align: top;
    }

    & td {
      padding: 1.2rem 1rem;
      border-bottom: 1px solid ${theme.color.gray3};
      box-sizing: border-box;
      line-height: 2.4rem;
      vertical-align: top;
      font: ${theme.fontType.t12};
    }

    /* & td span {
      display: block;
      position: relative;
    } */

    & td span:before {
      display: block;
      position: absolute;
      top: 0.9rem;
      left: 0;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      content: '';
    }

    & td a {
      text-decoration: underline;
    }
  }

`,
);
