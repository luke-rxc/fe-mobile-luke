import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { ContentListItem } from '@pui/contentListItem';
import { List } from '@pui/list';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { ContentListModel } from '../models';

interface Props {
  contentsList: ContentListModel[];
  hasMoreContentList?: boolean;
  isContentListFetching: boolean;
  onLoadContentList: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<ContentListModel, ErrorModel<ErrorDataModel>>>;
  className?: string;
}

export const ContentInfiniteList = ({
  contentsList,
  hasMoreContentList = false,
  isContentListFetching,
  onLoadContentList: handleLoadContentList,
  className,
}: Props) => {
  if (!contentsList || contentsList.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <InfiniteScroller
        infiniteOptions={{ rootMargin: '50px' }}
        disabled={!hasMoreContentList}
        onScrolled={handleLoadContentList}
        loading={isContentListFetching}
      >
        <List>
          {contentsList.map(({ id, name, code, contentType, image, startDate, isActive }, index: number) => {
            return (
              <ContentListItem
                key={code}
                id={id}
                name={name}
                code={code}
                contentType={contentType}
                imageProps={image}
                startDate={startDate}
                release={isActive}
                listIndex={index + 1}
              />
            );
          })}
        </List>
      </InfiniteScroller>
    </div>
  );
};
