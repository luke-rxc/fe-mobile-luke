import styled from 'styled-components';
import { useRef, useEffect } from 'react';
import { List } from '@pui/list';
import { Action } from '@pui/action';
import { TitleSection } from '@pui/titleSection';
import { getColor } from '../utils';

type RegionShortcutListItem = { name: string; link: string };

export interface RegionShortcutListProps {
  regions: RegionShortcutListItem[];
  className?: string;
  onImpression?: (regions: RegionShortcutListItem[]) => void;
  onClickShortcut?: (region: RegionShortcutListItem, index: number) => void;
}

const RegionShortcutListComponent: React.FC<RegionShortcutListProps> = ({
  regions,
  className,
  onImpression,
  onClickShortcut,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry], _observer) => {
      if (entry.isIntersecting) {
        onImpression?.(regions);
        _observer.disconnect();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer?.disconnect();
  }, [onImpression, regions]);

  return (
    <div ref={containerRef} className={className}>
      <TitleSection title="지역별 숙소" />
      <List
        is="div"
        source={regions}
        getKey={({ name }) => name}
        render={(region, index) => (
          <Action
            is="a"
            link={region.link}
            children={<span className="text">{region.name}</span>}
            onClick={() => onClickShortcut?.(region, index)}
          />
        )}
      />
    </div>
  );
};

/**
 * 지역 숏컷 리스튼
 */
export const RegionShortcutList = styled(RegionShortcutListComponent)`
  padding-bottom: ${({ theme }) => theme.spacing.s32};

  ${TitleSection} {
    .title {
      color: ${getColor('contentColor')};
    }
  }

  ${List} {
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    gap: ${({ theme }) => theme.spacing.s8};
    width: 100%;
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    ${Action} {
      display: flex;
      overflow: hidden;
      position: relative;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      z-index: 0;
      height: 4.8rem;
      padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
      border-radius: ${({ theme }) => theme.radius.r8};

      &::before {
        ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
        background: ${getColor('tintColor')};
        opacity: 0.16;
        content: '';
      }

      &::after {
        ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
        background: ${({ theme }) => theme.color.states.pressedCell};
        transition: opacity 200ms;
        opacity: 0;
        content: '';
      }

      &:active::after {
        opacity: 0.6;
      }

      .text {
        position: relative;
        z-index: 1;
        color: ${getColor('contentColor')};
        font: ${({ theme }) => theme.fontType.mediumB};
      }
    }
  }
`;
