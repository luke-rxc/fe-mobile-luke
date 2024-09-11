/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useLoadingStore } from '@stores/useLoadingStore';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { SEO } from '@pui/seo';
import { useShowroomService } from '../services';
import {
  AccomInfo,
  CouponList,
  ContentList,
  CoverMedia,
  GoodsList,
  Profile,
  SectionsList,
  ReviewList,
  RegionShortcutList,
} from '../components';
import { getColor, setColor } from '../utils';
import { Showroom } from '../types';

/**
 * Showroom Container
 */
export const ShowroomContainer = () => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const {
    showroom,
    cover,
    profile,
    coupon,
    content,
    reviews,
    goods,
    sections,
    seo,
    accom,
    filterList,
    sortingOptions,
    regionShortcuts,
  } = useShowroomService();
  const containerRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showroom.colors && containerRef.current) {
      setColor(containerRef, showroom.colors);
    }
    document.body.style.backgroundColor = showroom.colors?.backgroundColor ? showroom.colors.backgroundColor : '';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [showroom.colors, showroom.type]);

  useHeaderDispatch({
    type: 'brand',
    enabled: true,
    overlay: true,
    title: showroom.name || '',
    titleImagePath: showroom.logoURL,
    transitionTrigger: trigger,
    transitionOffset: ['end', 'start'],
    quickMenus: ['cart', 'menu'],
  });

  useEffect(() => {
    showroom.status === 'loading' ? showLoading() : hideLoading();
  }, [showroom.status]);

  if (showroom.status === 'loading') {
    return null;
  }

  if (showroom.status === 'error') {
    return <PageError error={showroom.error} />;
  }

  return (
    <>
      <SEO {...seo} helmetProps={{ title: seo?.title }} />
      <Container ref={containerRef} type={showroom.type}>
        {cover && <CoverMedia {...cover} />}
        {profile && <Profile {...profile} type={showroom.type} ref={trigger} />}
        {coupon && <CouponList {...coupon} type={showroom.type} />}
        {accom && <AccomInfo {...accom} />}
        {regionShortcuts && <RegionShortcutList {...regionShortcuts} />}
        {content && <ContentList {...content} type={showroom.type} />}
        {reviews && <ReviewList {...reviews} />}

        {/* 일반 쇼룸 - 상품 필터, 상품 목록 */}
        {showroom.type !== 'CONCEPT' && goods && filterList && sortingOptions && (
          <GoodsList {...goods} filterList={filterList} sortingOptions={sortingOptions} />
        )}

        {/* 콘셉트 쇼룸 - 섹션 목록 */}
        {showroom.type === 'CONCEPT' && sections && <SectionsList {...sections} type={showroom.type} />}
      </Container>
    </>
  );
};

const Container = styled.div<{ type?: Showroom }>`
  color: ${getColor('contentColor')};
  background: ${getColor('backgroundColor')};

  &::after {
    z-index: -1;
    ${({ theme }) => theme.mixin.fixed({ t: 0, r: 0, l: 0, b: 0 })};
    background: ${getColor('backgroundColor')};
    content: '';
  }

  ${Profile} {
    /** 커버영역과 겹치도록 profile 컴포넌트의 BrandListItemLarge 컴포넌트 높이 값 만큼 위로 당김 */
    margin-top: -12.9rem;
  }

  ${AccomInfo},
  ${ContentList},
  ${ReviewList},
  ${GoodsList},
  ${RegionShortcutList},
  ${SectionsList} {
    padding-top: ${({ theme }) => theme.spacing.s12};
  }
`;
