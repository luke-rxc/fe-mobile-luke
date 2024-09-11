import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useLink } from '@hooks/useLink';
import { List } from '@pui/list';
import { ButtonText } from '@pui/buttonText';
import { TitleSection } from '@pui/titleSection';
import { ContentListItem, ContentListItemProps } from '@pui/contentListItem';
import { UniversalLinkTypes } from '@constants/link';
import { MoreLabel } from '@constants/ui';

interface Props {
  /** 페이지 링크 여부 */
  isAbleContentPage: boolean;
  contentsList: ContentListItemProps[];
  showroomId: number | null;
  /** 리스트 타이틀 클릭 */
  onListTitleClick: () => void;
  /** 리스트 클릭 */
  onListClick: (contentListInfoProps: ContentListItemProps) => void;
}

export const GoodsContent: React.FC<Props> = ({
  isAbleContentPage,
  contentsList,
  showroomId,
  onListTitleClick,
  onListClick: handleListClick,
}) => {
  const { getLink } = useLink();

  // 3개 이상이면 페이지 더보기 UI 노출
  const suffix = useMemo(() => {
    if (isAbleContentPage && !!showroomId) {
      return (
        <ButtonText
          is="a"
          link={getLink(UniversalLinkTypes.GOODS_CONTENT, { showroomId: showroomId ?? 0 })}
          onClick={onListTitleClick}
          children={MoreLabel}
        />
      );
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAbleContentPage, showroomId, onListTitleClick]);

  return (
    <ListStyled>
      <TitleSection title="콘텐츠" suffix={suffix} />
      {contentsList.map(({ id, name, code, contentType, imageProps, startDate, release }, index: number) => {
        return (
          <ContentListItem
            key={code}
            id={id}
            name={name}
            code={code}
            contentType={contentType}
            imageProps={imageProps}
            startDate={startDate}
            release={release}
            listIndex={index + 1}
            onClick={handleListClick}
          />
        );
      })}
    </ListStyled>
  );
};

const ListStyled = styled(List)`
  padding-bottom: 2.4rem;
`;
