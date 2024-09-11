import styled from 'styled-components';
import { useRef, useEffect } from 'react';
import { GeoMapLocation, GeoMapLocationProps } from '@features/map/components';
import { getColor } from '../utils';

export interface AccomInfoProps extends GeoMapLocationProps {
  info: { title: string; contents: string[] }[];
  className?: string;
}

const AccomInfoItem: React.FC<ArrayElement<AccomInfoProps['info']>> = ({ title, contents }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleIntersect: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const isFirstChild = !entry.target.previousElementSibling;
      const controlClassName = isFirstChild ? 'mask-left' : 'mask-right';

      return entry.isIntersecting
        ? containerRef.current?.classList.remove(controlClassName)
        : containerRef.current?.classList.add(controlClassName);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: contentRef.current,
      threshold: [1],
    });

    if (contentRef.current) {
      const { firstChild, lastChild } = contentRef.current;

      firstChild && observer.observe(firstChild as HTMLElement);
      lastChild && observer.observe(lastChild as HTMLElement);
    }

    return () => observer.disconnect();
  }, [contents]);

  return (
    <div ref={containerRef} className="info-group">
      <div className="info-title">{title}</div>
      <div ref={contentRef} className="info-contents">
        {contents.map((item) => (
          <span key={item} className="item" children={item} />
        ))}
      </div>
    </div>
  );
};

const AccomInfoComponent: React.FC<AccomInfoProps> = ({ info, place, className, onClickMap, onClickCopy }) => {
  return (
    <div className={className}>
      <div className="accom-info">
        {info.map(({ title, contents }) => (
          <AccomInfoItem key={title} title={title} contents={contents} />
        ))}
      </div>
      <div className="accom-place">
        <GeoMapLocation place={place} onClickMap={onClickMap} onClickCopy={onClickCopy} />
      </div>
    </div>
  );
};

export const AccomInfo = styled(AccomInfoComponent)`
  .accom-info {
    padding-bottom: ${({ theme }) => theme.spacing.s24};

    .info-group {
      position: relative;
      z-index: 0;
      color: ${getColor('contentColor')};

      &::before,
      &::after {
        ${({ theme }) => theme.mixin.absolute({ t: 0 })};
        z-index: 2;
        width: 4.8rem;
        height: 5.6rem;
        pointer-events: none;
        transition: opacity 200ms;
        opacity: 0;
        content: '';
      }

      &::before {
        left: 0;
        background: linear-gradient(90deg, ${getColor('backgroundColor')}, transparent);
      }

      &::after {
        right: 0;
        background: linear-gradient(90deg, transparent, ${getColor('backgroundColor')});
      }

      &.mask-left::before,
      &.mask-right::after {
        opacity: 1;
      }
    }

    .info-title {
      ${({ theme }) => theme.mixin.absolute({ t: 10, l: theme.spacing.s24 })};
      color: ${getColor('contentColor')};
      font: ${({ theme }) => theme.fontType.mini};
      pointer-events: none;
      opacity: 0.5;
      z-index: 3;
    }

    .info-contents {
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      overflow-x: auto;
      position: relative;
      z-index: 1;
      padding: 2.8rem 0 1rem;
      font: ${({ theme }) => theme.fontType.medium};
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      &::after,
      &::before {
        display: block;
        flex-shrink: 0;
        width: ${({ theme }) => theme.spacing.s24};
        content: '';
      }

      .item {
        display: flex;
        flex-shrink: 0;
        align-items: center;
      }

      .item::after {
        display: block;
        width: 0.1rem;
        height: 1.2rem;
        margin: ${({ theme }) => `0 ${theme.spacing.s8}`};
        background: ${getColor('contentColor')};
        opacity: 0.08;
        content: '';
      }

      .item:last-child::after {
        display: none;
      }
    }
  }

  .accom-place {
    ${GeoMapLocation} {
      .item-title {
        color: ${getColor('contentColor')};
      }

      .item-description {
        color: ${getColor('contentColor')};
        opacity: 0.5;
      }

      .button-content {
        color: ${getColor('tintColor')};
        opacity: 0.5;
      }

      .button-content svg {
        color: inherit;
      }
    }
  }
`;
