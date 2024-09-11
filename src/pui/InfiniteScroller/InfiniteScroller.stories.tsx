import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useState, useCallback, useRef } from 'react';
import { ContentCard, ContentCardProps } from '@pui/contentCard';
import { InfiniteScroller } from './InfiniteScroller';

export default {
  title: `${StoriesMenu.NonPDS}/InfiniteScroller`,
  component: InfiniteScroller,
} as ComponentMeta<typeof InfiniteScroller>;

const Template: ComponentStory<typeof InfiniteScroller> = ({ ...args }) => {
  const getMock = useCallback(() => {
    return new Array(5).fill(true).map<ContentCardProps>((): ContentCardProps => {
      return {
        contentType: 'STORY',
        contentCode: 'elliecontent',
        title: '파이널티켓 프리즘 X 워터밤',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
        startDate: 1658469583660,
      };
    });
  }, []);
  const [items, setItems] = useState<ContentCardProps[]>(getMock());
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const count = useRef<number>(0);

  const requestData = (ms: number): Promise<ContentCardProps[]> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        const mock = getMock();
        resolve(mock);
      }, ms),
    );
  };

  const handleLoadMore = async () => {
    count.current += 1;

    if (count.current === 2) {
      setDisabled(true);
      return;
    }

    setIsLoading(true);
    setDisabled(true);
    const resData = await requestData(1000);
    setItems([...items, ...resData]);
    setIsLoading(false);
    setDisabled(false);
  };

  return (
    <div style={{ width: '390px' }}>
      <InfiniteScroller {...args} isLoading={isLoading} disabled={disabled} onScrolled={handleLoadMore}>
        <div>
          {items.map((content: ContentCardProps, idx: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <ContentCard key={`${content.contentCode}-${idx}`} {...content} />
          ))}
        </div>
      </InfiniteScroller>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
