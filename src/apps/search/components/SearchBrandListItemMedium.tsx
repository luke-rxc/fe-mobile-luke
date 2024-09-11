import { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import { BrandListItemMedium, BrandListItemMediumProps } from '@pui/brandListItemMedium';

interface FollowParams {
  id: number;
  code: string;
  name: string;
  follow: boolean;
}

export interface SearchBrandListItemMediumProps extends Omit<BrandListItemMediumProps, 'onChangeFollow'> {
  // Follow 클릭 콜백
  onClickFollow?: (params: FollowParams) => void;
  // Follow 변경 콜백
  onChangeFollow?: (params: Omit<FollowParams, 'name'>) => void;
}

export const SearchBrandListItemMedium = styled(
  forwardRef<HTMLDivElement, SearchBrandListItemMediumProps>((props, ref) => {
    const { subscribeShowroom, showroomFollowStatusValues } = useWebInterface();

    const { followed, showroomId, showroomCode, onClickFollow, onChangeFollow, ...other } = props;

    const [follow, setFollow] = useState(followed ?? false);

    useEffect(() => {
      setFollow((prev) => followed ?? prev);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followed]);

    /**
     * 알림 신청 여부 변경사항 구독
     *
     * @description 구버전 호환성을 위한 유지
     */
    useEffect(() => {
      if (!subscribeShowroom) {
        return;
      }

      if (subscribeShowroom.showroomId === showroomId && subscribeShowroom.showroomCode === showroomCode) {
        setFollow(subscribeShowroom.isSubscribed);

        // onlyState 옵션이 true인 경우 state 변경만 처리하고, 이후 onChangeFollow는 skip
        subscribeShowroom.options?.onlyState ||
          onChangeFollow?.({
            id: subscribeShowroom.showroomId,
            code: subscribeShowroom.showroomCode,
            follow: subscribeShowroom.isSubscribed,
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribeShowroom]);

    /**
     * 알림 신청 여부 변경사항 구독
     */
    useEffect(() => {
      const { showroomList } = showroomFollowStatusValues ?? { showroomList: [] };

      // 변경된 쇼룸
      const updated = showroomList.find(({ id, code }) => id === props.showroomId && code === props.showroomCode);

      if (updated) {
        // Update State
        setFollow(updated.isFollowed);

        // onlyState 옵션이 true인 경우 state 변경만 처리하고, 이후 onChangeFollow는 skip
        updated.options?.onlyState ||
          onChangeFollow?.({
            id: updated.id,
            code: updated.code,
            follow: updated.isFollowed,
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showroomFollowStatusValues]);

    return (
      <BrandListItemMedium
        ref={ref}
        {...other}
        followed={follow}
        showroomId={showroomId}
        showroomCode={showroomCode}
        onChangeFollow={(isSubscribed, { showroomId: id, showroomCode: code, title: name }) => {
          onClickFollow?.({ id, code, name, follow: isSubscribed });
        }}
      />
    );
  }),
)``;
