import { useState } from 'react';
import filter from 'lodash/filter';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { SearchHistory } from './SearchHistory';
import { SearchHistoryItemSchema } from '../schemas';

const data = new Array(10).fill('').map<SearchHistoryItemSchema>((_, index) => ({
  id: `${index}`,
  query: `${index} string`,
  searchDate: new Date().getTime(),
}));

export default {
  title: `${StoriesMenu.Apps}/search/SearchHistory`,
  component: SearchHistory,
} as ComponentMeta<typeof SearchHistory>;

/**
 *
 */
const Template: ComponentStory<typeof SearchHistory> = () => {
  const [history, setHistory] = useState(data);

  const handleClick = (query: string) => {
    alert(`클릭 ${query}`);
  };

  const handleDelete = (queryId: string) => {
    alert(`삭제 ${queryId}`);
    setHistory(filter(history, ({ id }) => id !== queryId));
  };

  const handleDeleteAll = () => {
    alert(`전체 삭제`);
    setHistory([]);
  };

  return (
    <div style={{ border: '1px solid red' }}>
      {!!history.length && (
        <SearchHistory history={history} onClick={handleClick} onDelete={handleDelete} onDeleteAll={handleDeleteAll} />
      )}
      <div style={{ background: 'red', height: 400 }} />
    </div>
  );
};

export const 기본 = Template.bind({});
