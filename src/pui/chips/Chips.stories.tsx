import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Chips } from './Chips';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Chips/Chips`,
  component: Chips,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=16051%3A48707',
      },
      {
        name: 'figma - 정책',
        type: 'figma',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM?node-id=33124%3A199005',
      },
      {
        name: 'Notion - 애니메이션 가이드',
        type: 'link',
        url: 'https://www.notion.so/rxc/Guide-9095d540ceda4a33b781678f523951e6#8b84635cb0ab4e1f8dbf5b5bcfb95c7a',
      },
    ],
  },
} as ComponentMeta<typeof Chips>;

const Template: ComponentStory<typeof Chips> = () => {
  const data = new Array(26).fill('').map((_, index) => index);
  const getLabel = (item: typeof data[0]) => String.fromCharCode(97 + item);
  const onClickChip = (item: typeof data[0]) => window.console.log(item);
  const onDeleteChip = (item: typeof data[0]) => window.console.log(item);

  return <Chips data={data} getLabel={getLabel} onClickChip={onClickChip} onDeleteChip={onDeleteChip} />;
};

export const 기본 = Template.bind({});
