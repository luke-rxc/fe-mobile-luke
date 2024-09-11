import React, { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { SearchRecommendationItemSchema } from '../schemas';

interface SearchRecommendationItemComponentProps {
  /** 검색어 아이템 */
  item: SearchRecommendationItemSchema;
  /** 검색어 정렬 순서 */
  index: number;
  /** 검색어 클릭 이벤트 */
  onClick?: (keyword: SearchRecommendationItemSchema, index: number) => void;
  /** Intersection observer 콜백 이벤트 */
  onVisibility?: (query: string, index: number) => void;
}

/**
 * 추천 검색어 아이템
 */
export const SearchRecommendationItem = styled(
  forwardRef<HTMLLIElement, SearchRecommendationItemComponentProps>(
    ({ item, index, onVisibility, onClick, ...props }, ref) => {
      const { query } = item;
      const container = useRef<HTMLLIElement>(null);

      /**
       * Intersection Observer 콜백
       */
      const handleVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        if (entry.isIntersecting) {
          onVisibility?.(query, index);
          observer.disconnect();
        }
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

      /**
       * 검색어 클릭 이벤트 핸들러
       */
      const handleClick = (keyword: SearchRecommendationItemSchema, id: number) => () => {
        onClick?.(keyword, id);
      };

      /**
       * props ref 세팅
       */
      useImperativeHandle(ref, () => container.current as HTMLLIElement);

      return (
        <li ref={container} {...props}>
          <Action onClick={handleClick(item, index)} children={query} />
        </li>
      );
    },
  ),
)`
  display: inline-block;
  position: relative;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radius.r6};
  margin: 0 0.4rem;

  ${Action} {
    display: flex;
    overflow: hidden;
    position: relative;
    align-items: center;
    height: inherit;
    padding: 0 1.2rem;
    border-radius: inherit;
    background: ${({ theme }) => theme.color.gray3};
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme }) => theme.color.black};

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: ${({ theme }) => theme.color.gray3};
      transition: opacity 0.2s;
      opacity: 0;
      content: '';
    }

    &:active::before {
      opacity: 1;
    }
  }
`;
