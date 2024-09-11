import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { MoreLabel } from '@constants/ui';
import { List, ListProps } from '@pui/list';
import { ButtonText } from '@pui/buttonText';
import { TitleSection } from '@pui/titleSection';
import { GoodsCardSmall, GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { Image } from '@pui/image';
import { ShowroomSectionType } from '../constants';
import { getColor } from '../utils';
// eslint-disable-next-line import/no-cycle
import { SectionHeader } from './SectionHeader';

export interface HeaderItem {
  id: number;
  title: string;
  landingLink: string;
  image: {
    src: string;
    blurHash?: string;
  };
}

export interface SectionItemProps {
  type: string;
  title: string;
  subtitle?: string;
  sectionId: number;
  sectionLink?: string;
  content: GoodsCardSmallProps[];
  headerList: HeaderItem[];
  /** Impression 이벤트 콜백 */
  onVisibility?: (item: SectionItemProps) => void;
  /** 전체 보기 클릭 이벤트 콜백 */
  onClickSectionMore?: (item: SectionItemProps) => void;
  /** 섹션 헤더 클릭 이벤트 콜백 */
  onClickSectionHeader?: (item: SectionItemProps, id: number, index: number, title: string) => void;
  /**
   * 섹션 이벤트 핸들러
   * 추후 BrandCardProps | ContentCardSmallProps 추가
   */
  getHandlers?: ListProps<GoodsCardSmallProps>['getHandlers'];
}

export const SectionItem = styled<React.VFC<SectionItemProps>>((props) => {
  const {
    type: sectionType,
    title,
    subtitle,
    sectionId,
    sectionLink,
    content,
    headerList,
    onVisibility,
    onClickSectionMore,
    onClickSectionHeader,
    getHandlers,
    ...rest
  } = props;
  const container = useRef<HTMLDivElement>(null);

  const handleVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (entry.isIntersecting) {
      onVisibility?.(props);
      observer.disconnect();
    }
  };

  const handleClickSectionMore = () => {
    onClickSectionMore?.(props);
  };

  const handleClickSectionHeader = (item: SectionItemProps, id: number, index: number, headerTitle: string) => {
    onClickSectionHeader?.(props, id, index, headerTitle);
  };

  /**
   * Intersection Observer 구독/해제
   */
  useEffect(() => {
    let observer: IntersectionObserver;
    if (container.current) {
      observer = new IntersectionObserver(handleVisibility, { threshold: 0.3 });
      observer.observe(container.current);
    }

    return () => observer && observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isEmpty(content) && (
        <div ref={container} {...rest}>
          <TitleSection
            title={title}
            subtitle={subtitle}
            suffix={
              sectionLink && (
                <ButtonText is="a" link={sectionLink} onClick={handleClickSectionMore} children={MoreLabel} />
              )
            }
          />

          {!isEmpty(headerList) && <SectionHeader section={props} onClickSectionHeader={handleClickSectionHeader} />}

          {sectionType === ShowroomSectionType.GOODS && (
            <List
              is="div"
              source={content}
              component={GoodsCardSmall}
              getKey={({ id, goodsCode }) => id || goodsCode}
              getHandlers={getHandlers}
            />
          )}
        </div>
      )}
    </>
  );
})`
  ${TitleSection} {
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

  ${List} {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    width: 100%;
    padding: 0 2.4rem;
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    ${GoodsCardSmall} {
      flex: 0 0 auto;
      margin-left: 1.6rem;

      &:first-child {
        margin-left: 0;
      }

      .goods-info {
        .brand,
        .goods,
        .price,
        .benefit-label {
          color: ${getColor('contentColor')};
        }

        .brand,
        .benefit-label {
          opacity: 0.5;
        }
      }

      .goods-thumb {
        overflow: hidden;
        border-radius: 0.8rem;
        mask-image: radial-gradient(circle, #fff, #000);
      }

      ${Image}.is-success {
        img {
          background: #f7f7f7;
        }
      }
    }
  }
`;
