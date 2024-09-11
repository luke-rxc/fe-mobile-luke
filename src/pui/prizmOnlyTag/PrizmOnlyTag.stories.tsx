import { useRef } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { PrizmOnlyTag, PrizmOnlyTagComponent, PrizmOnlyTagRef } from './PrizmOnlyTag';

export default {
  title: `${StoriesMenu.Graphic}/PrizmOnlyTag`,
  component: PrizmOnlyTag,
  parameters: {
    design: [
      {
        name: 'figma - 정책',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=30099-116700&mode=design&t=f3jI9rHUyxcSadQo-4',
      },
    ],
  },
} as ComponentMeta<typeof PrizmOnlyTagComponent>;

const Template: ComponentStory<typeof PrizmOnlyTagComponent> = ({ ...args }) => <PrizmOnlyTag {...args} />;

export const prizmOnly = Template.bind({});
prizmOnly.args = { size: 'medium', tagType: 'prizmOnly' };

export const prizmOnlySmall = Template.bind({});
prizmOnlySmall.args = { size: 'small', tagType: 'prizmOnly' };

export const prizmOnlyLarge = Template.bind({});
prizmOnlyLarge.args = { size: 'large', tagType: 'prizmOnly' };

export const liveOnly = Template.bind({});
liveOnly.args = { size: 'medium', tagType: 'liveOnly' };

export const liveOnlySmall = Template.bind({});
liveOnlySmall.args = { size: 'small', tagType: 'liveOnly' };

export const liveOnlyLarge = Template.bind({});
liveOnlyLarge.args = { size: 'large', tagType: 'liveOnly' };

const ControllerTemplate: ComponentStory<typeof PrizmOnlyTagComponent> = ({ ...args }) => {
  const tag = useRef<PrizmOnlyTagRef>(null);

  const handleTagAnimationPlay = () => {
    tag.current?.play();
  };

  return (
    <>
      <PrizmOnlyTag ref={tag} trigger={false} {...args} />
      <br />
      <br />
      <button type="button" onClick={handleTagAnimationPlay}>
        click me
      </button>
    </>
  );
};

export const playController = ControllerTemplate.bind({});
playController.args = {};
