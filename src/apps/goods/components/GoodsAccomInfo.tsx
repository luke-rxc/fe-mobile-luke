import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { GoodsAccomInfoTitle } from '../constants';
import { AccomModel } from '../models';

interface Props {
  accom: AccomModel;
  onScrollAccomInfo: (tagType: string) => void;
}

/** 이벤트 로깅 tag_type 적재하기 위한 함수 */
const getAccomInfoType = (title: string): string => {
  switch (title) {
    case GoodsAccomInfoTitle.PERSON:
      return 'standard_size';
    case GoodsAccomInfoTitle.DETAIL:
      return 'roomtype';
    case GoodsAccomInfoTitle.AMENITY:
      return 'amenity';
    default:
      return '';
  }
};

export const GoodsAccomInfo = ({ accom, onScrollAccomInfo: handleScrollAccomInfo }: Props) => {
  const { title, contents } = accom;
  const tagType = getAccomInfoType(title);

  if (isEmpty(contents)) {
    return null;
  }

  const maskRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleVisibility = ([entry]: IntersectionObserverEntry[], isLeft: boolean) => {
    const { isIntersecting, boundingClientRect } = entry;
    const maskEl = maskRef.current;

    if (!maskEl) {
      return;
    }

    if (!isIntersecting) {
      maskEl.classList.add(isLeft ? 'left-mask' : 'right-mask');
      isLeft && boundingClientRect.x !== 0 && handleScrollAccomInfo(tagType);

      return;
    }

    maskEl.classList.remove(isLeft ? 'left-mask' : 'right-mask');
  };

  useEffect(() => {
    let leftObserver: IntersectionObserver;
    let rightObserver: IntersectionObserver;

    const leftTagEl = tagRefs.current[0] as HTMLSpanElement;
    const rightTagEl = tagRefs.current[1] as HTMLSpanElement;

    if (leftTagEl) {
      leftObserver = new IntersectionObserver((entry) => handleVisibility(entry, true), {
        threshold: 1,
      });
      leftObserver.observe(leftTagEl);
    }

    if (rightTagEl) {
      rightObserver = new IntersectionObserver((entry) => handleVisibility(entry, false), {
        threshold: 0.9,
      });
      rightObserver.observe(rightTagEl);
    }

    return () => {
      leftObserver && leftObserver.disconnect();
      rightObserver && rightObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <div className="tag-info" ref={maskRef}>
        <span className="tag-title">{title}</span>
        <div className="tag-description">
          <span
            className="observer"
            ref={(ref) => {
              tagRefs.current[0] = ref;
            }}
          />
          {contents.map((content, contentIndex) => (
            <React.Fragment key={content}>
              <span className="tag-item">{content}</span>
              {contentIndex !== contents.length - 1 && <span className="separator" />}
            </React.Fragment>
          ))}
          <span
            className="observer"
            ref={(ref) => {
              tagRefs.current[1] = ref;
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .tag-info {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;

    &:before {
      ${({ theme }) => theme.absolute({ b: 0, l: 0 })};
      width: 4.8rem;
      height: 5.6rem;
      background: ${({ theme }) =>
        `linear-gradient(90deg, ${theme.color.background.surface} 0%, rgba(255, 255, 255, 0) 100%)`};
      content: '';
      z-index: 2;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:after {
      ${({ theme }) => theme.absolute({ b: 0, r: 0 })};
      width: 4.8rem;
      height: 5.6rem;
      background: ${({ theme }) =>
        `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${theme.color.background.surface} 100%)`};
      content: '';
      opacity: 0;
      transition: opacity 0.2s;
    }

    &.left-mask:before {
      opacity: 1;
    }

    &.right-mask:after {
      opacity: 1;
    }
  }

  .tag-title {
    ${({ theme }) => theme.absolute({ t: '1rem', l: 0 })};
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.text.textTertiary};
    padding-left: ${({ theme }) => theme.spacing.s24};
    z-index: 2;
  }

  .tag-description {
    position: relative;
    display: flex;
    width: 100%;
    padding-top: 1.8rem;
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
    overflow: hidden;
    overflow-x: auto;
    scrollbar-width: none;
    /* chrome, safari */
    &::-webkit-scrollbar {
      display: none;
    }

    > span {
      flex: 0 0 auto;
    }
  }

  .observer {
    width: 2.4rem;
    height: 100%;
  }

  .separator {
    width: 0.1rem;
    height: 1.2rem;
    margin: auto ${({ theme }) => theme.spacing.s8};
    background: ${({ theme }) => theme.color.backgroundLayout.line};
  }
`;
