import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { SearchBar, SearchBarProps } from './SearchBar';

const data = (keyword: string) => {
  if (keyword.length < 1) {
    return [];
  }

  return new Array(10).fill({}).map((_, index) => ({
    id: `id-${index}`,
    keyword: `${keyword}-${index}`,
    date: index < 4 ? new Date().getTime() : undefined,
  }));
};

export default {
  title: `${StoriesMenu.Apps}/search/SearcBar`,
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

/**
 * SearchBar
 */
const Template: ComponentStory<typeof SearchBar> = () => {
  const [autoComplete, setAutoComplete] = useState<SearchBarProps['autoComplete']>();

  const onChangeKeyword = (keyword: string) => {
    setAutoComplete({ keyword, list: data(keyword) });
  };

  const handleSubmit = (keyword: string) => {
    alert(`Submit 키워드: ${keyword}`);
  };

  return <SearchBar onChangeKeyword={onChangeKeyword} onSubmit={handleSubmit} autoComplete={autoComplete} />;
};

export const 기본 = Template.bind({});
