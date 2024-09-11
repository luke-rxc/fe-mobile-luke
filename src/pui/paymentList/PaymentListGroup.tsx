import { forwardRef, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { PaymentListItem, PaymentListItemProps } from './PaymentListItem';
import { PaymentListRolling } from './PaymentListRolling';

export type PaymentItemType = Omit<PaymentListItemProps, 'handleSelect' | 'selected'>;
export type PaymentListGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  /** pay item 리스트  */
  list: PaymentItemType[];
  /** group id -  여러 그룹핑을 사용할 경우, 각 그룹을 구분하기 위한 값 */
  groupId?: number;
  /** 그룹 활성화 상태 */
  selected?: boolean;
  /** 그룹 내 활성화 할 아이템 index */
  selectedItemIndex?: number;
  /** group select시 콜백 */
  onSelect?: (groupId: number, itemIndex: number) => void;
};

/**
 * Figma 결제수단 컴포넌트
 */
const PaymentListGroupComponent = forwardRef<HTMLDivElement, PaymentListGroupProps>(
  ({ className, list = [], selected = false, groupId = 0, selectedItemIndex = 0, onSelect }, ref) => {
    const isGroup = useMemo(() => list.length > 1, [list]);
    const [activeItemNum, setActiveItemNum] = useState<number>(selectedItemIndex);
    const [groupList, setGroupList] = useState<PaymentListItemProps[]>([]);
    const listWrapperRef = useRef<HTMLDivElement>(null);
    const listInnerRef = useRef<HTMLDivElement>(null);
    const rollWrapperRef = useRef<HTMLButtonElement>(null);
    const [isClosed, setIsClose] = useState<boolean>(!selected);
    const [isRollingMotion, setIsRollingMotion] = useState<boolean>(!selected);
    const groupTransition = useRef<boolean>(false); // 최초 transition 모션 적용 x

    /** 아이템 선택 */
    const handleItemSelect = useCallback(
      (itemIndex: number) => {
        if (!isGroup) {
          setIsClose(false);
        }

        setActiveItemNum(itemIndex);
        onSelect?.(groupId, itemIndex);

        setGroupList((prev) => {
          return prev.map((item, idx) => {
            return {
              ...item,
              selected: idx === itemIndex,
              transition: true,
            };
          });
        });
      },
      [groupId, isGroup, onSelect],
    );

    /** 그룹 활성 */
    const handleGroupSelect = useCallback(() => {
      setIsClose(false);
      onSelect?.(groupId, activeItemNum);
    }, [activeItemNum, groupId, onSelect]);

    useEffect(() => {
      const updatedList = list.map((item, idx) => {
        const itemSelected =
          // eslint-disable-next-line no-nested-ternary
          selected === true ? (isGroup ? activeItemNum === idx : activeItemNum < 0 ? false : selected) : false;
        const itemTransition = !(groupTransition.current === false && itemSelected); // 최초 셀렉 상태인 경우, transition 적용 x
        return {
          ...item,
          selected: itemSelected,
          transition: itemTransition,
        };
      });
      setGroupList(updatedList);
    }, [activeItemNum, groupTransition, isGroup, list, selected]);

    useEffect(() => {
      setIsClose(!selected);
    }, [selected]);

    /**
     * 닫힘, 열림 모션
     */
    useEffect(() => {
      const duration = groupTransition.current ? 250 : 0; // 초기 활성화 표시시 애니메이션이 일어나지 않도록 처리
      const rollzIndex = 100;
      const itemHt = 70; // 아이템 select 되지 않은 상태의 마진값 까지 포함한 크기

      if (listWrapperRef.current && listInnerRef.current && rollWrapperRef.current) {
        const listWrapperEl = listWrapperRef.current;
        const listInnerEl = listInnerRef.current;
        const rollWrapperEl = rollWrapperRef.current;
        const lists = listInnerEl.children;

        if (isClosed) {
          listWrapperEl.style.height = `${listInnerEl.offsetHeight / 10}rem`;
          listWrapperEl.style.transition = `height ${duration}ms ease-in-out`;
          rollWrapperEl.style.display = 'block';

          window.requestAnimationFrame(() => {
            // 롤링 영역만큼 크기로 height 줄임 모션
            listWrapperEl.style.height = `${rollWrapperEl.offsetHeight / 10}rem`;

            Array.from(lists).forEach((item, idx) => {
              const el = item as HTMLButtonElement;
              el.style.transform = `translate3d(0, ${(itemHt * idx * -1) / 10}rem, 0)`;
              el.style.transition = `transform ${duration}ms ease-in-out`;
              el.style.zIndex = `${rollzIndex - idx}`;
            });
          });

          // 모션 닫힘 완료 후 리스트 none , 롤링 시작
          setTimeout(() => {
            if (listInnerEl) {
              listInnerEl.style.display = 'none';
            }
            setIsRollingMotion(true);
          }, duration);
        } else {
          listInnerEl.style.display = 'block';
          listWrapperEl.style.height = `${rollWrapperEl.offsetHeight / 10}rem`;
          listWrapperEl.style.transition = `height ${duration}ms ease-in-out`;
          rollWrapperEl.style.display = 'none';

          window.requestAnimationFrame(() => {
            // 아이템 전체 영역만큼 크기로 height 늘림 모션
            listWrapperEl.style.height = `${listInnerEl.offsetHeight / 10}rem`;
            Array.from(lists).forEach((item) => {
              const el = item as HTMLButtonElement;
              el.style.transform = `translate3d(0, 0, 0)`;
              el.style.transition = `transform ${duration}ms ease-in-out`;
            });
          });

          // 모션 열림 완료 후 스타일 초기화, 롤링 정지
          setTimeout(() => {
            listWrapperEl.style.height = '';
            listWrapperEl.style.transition = '';

            Array.from(lists).forEach((item) => {
              const el = item as HTMLButtonElement;
              el.style.transform = '';
              el.style.transition = '';
            });
            setIsRollingMotion(false);
          }, duration);
        }
      }

      groupTransition.current = true;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClosed, rollWrapperRef.current]);

    return (
      <div
        ref={ref}
        className={classNames(className, {
          'is-group': isGroup,
        })}
      >
        <div className="list-wrapper" ref={listWrapperRef}>
          <div className="list-inner" ref={listInnerRef}>
            {groupList.map((item: PaymentListItemProps, index) => {
              return (
                <PaymentListItem
                  key={item.pgType}
                  className="pay-item"
                  {...{
                    ...item,
                    onSelect: () => handleItemSelect(index),
                  }}
                />
              );
            })}
          </div>
        </div>
        {isGroup && (
          <PaymentListRolling ref={rollWrapperRef} list={list} active={isRollingMotion} onClick={handleGroupSelect} />
        )}
      </div>
    );
  },
);

export const PaymentListGroup = styled(PaymentListGroupComponent)`
  position: relative;
  &.is-group {
    & > .list-wrapper {
      min-height: 5.8rem;
      & .pay-item {
        margin-top: 1.2rem;
        &:first-child {
          margin-top: 0;
        }
      }
    }
    ${PaymentListRolling} {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }
  }
`;
