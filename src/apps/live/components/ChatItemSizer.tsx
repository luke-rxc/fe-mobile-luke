import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  index: number;
  parentWidth: number;
  updateChatItemHeight: (index: number, height: number) => void;
  onClickItem?: (event: React.MouseEvent) => void;
}

/**
 * ChatItemSizer
 *
 * item height 값을 업데이트 처리
 * 부모 width 변경시 height를 재 업데이트 처리
 *
 * @param index item index
 * @param parentWidth 부모 width
 */
export const ChatItemSizer = ({
  children,
  index,
  parentWidth,
  updateChatItemHeight,
  onClickItem: handleClickItem,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      updateChatItemHeight(index, ref.current.getBoundingClientRect().height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentWidth]);

  return (
    <div ref={ref} onClick={handleClickItem}>
      {children}
    </div>
  );
};
