import React, { forwardRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import classnames from 'classnames';
import { TitleSection } from '@pui/titleSection';
import { ButtonText } from '@pui/buttonText';
import { ContentCard, ContentCardProps } from '@pui/contentCard';
import { Action } from '@pui/action';
import { MoreLabel } from '@constants/ui';
import { getColor } from '../utils';
import { Showroom } from '../types';

export interface ContentListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 콘텐츠 데이터 */
  contents: ContentCardProps[];
  /** 전체(섹션)보기 URL */
  sectionLink?: string;
  /** 쇼룸 타입 */
  type?: Showroom;
  /** 전체(섹션)보기 클릭시 실행할 콜백 함수 */
  onClickSectionLink?: (e: React.MouseEvent<HTMLAnchorElement>, props: ContentListProps) => void;
  /** 콘텐츠 클릭시 실행할 콜백 함수 */
  onClickContentLink?: (e: React.MouseEvent<HTMLAnchorElement>, item: ContentCardProps) => void;
}

/**
 * ContentList 컴포넌트
 */
export const ContentList = styled(
  forwardRef<HTMLDivElement, ContentListProps>((props, ref) => {
    const { contents, sectionLink, type, className, onClickSectionLink, onClickContentLink, ...rest } = props;
    const onlyOne = contents.length < 2;
    const layoutType = onlyOne ? 'none' : 'swipe';
    const classNames = classnames(className, { 'is-swipe': !onlyOne });

    const handleClickSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClickSectionLink?.(e, props);
    };

    const handleClickContent = (item: ContentCardProps) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClickContentLink?.(e, item);
    };

    /**
     * 콘텐츠가 없는 경우
     */
    if (isEmpty(contents)) {
      return null;
    }

    /**
     * 콘텐츠가 있는 경우
     */
    return (
      <div ref={ref} className={classNames} {...rest}>
        <TitleSection
          title="콘텐츠"
          suffix={
            sectionLink && <ButtonText is="a" link={sectionLink} onClick={handleClickSection} children={MoreLabel} />
          }
        />
        <div className="content-card-wrapper">
          {contents.map((content, i) => (
            <ContentCard
              key={content.id || i}
              {...content}
              layoutType={layoutType}
              onClickLink={handleClickContent(content)}
            />
          ))}
        </div>
      </div>
    );
  }),
)`
  ${TitleSection} {
    padding: 0;

    .inner {
      padding: ${({ theme }) => `1.7rem ${theme.spacing.s24} 1.8rem`};
    }

    .title {
      color: ${getColor('contentColor')};
    }

    .subtitle {
      color: ${getColor('contentColor')};
      opacity: 0.5;
    }

    ${ButtonText} {
      color: ${getColor('sectionMoreTextColor')};

      &:active {
        background: ${getColor('sectionMorePressedColor')};
      }
    }
  }

  ${ContentCard} {
    width: 100%;

    ${Action} {
      .info {
        min-height: 6.8rem;
        color: ${getColor('contentColor')};

        .title {
          color: inherit;
        }

        .date {
          margin-top: ${({ theme }) => theme.spacing.s4};
          opacity: 0.5;
          color: inherit;
        }
      }
    }
  }

  &.is-swipe {
    ${ContentCard} {
      width: 25.6rem;
      &:not(:first-of-type) {
        margin-left: ${({ theme }) => theme.spacing.s16};
      }
    }
  }

  .content-card-wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    width: 100%;
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
