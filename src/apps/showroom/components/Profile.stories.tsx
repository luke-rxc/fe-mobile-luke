import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Profile } from './Profile';
import reference from './ContentList.stories';

const profileInfo = {
  title: '인스턴트 펑크',
  followed: false,
  showroomCode: 'instantfunk',
  imageURL: 'showroom/20221014/0b674be4-ba99-409c-a9ee-15a529fc8c40.jpeg',
  disabledProfileLink: true,
  blurhash:
    '|2DMQoyWozyWo|yWo}yXkCyWfkfQfkfQfkfQfQfQ*IfkV@f6Vtj[VsayaeyXfkf6fkfQfQfkj[f6HYf6ozfko|ayo}j[kCyWfkj[fjfQj[f6f6fky=fkV@fPVtj[VsafaeyXfkayfkfjf6fkkBayL~f6ozfQo|ayo}kBkC',
};

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/Profile`,
  component: Profile,
  parameters: {
    design: reference.parameters?.design,
  },
  args: {
    description: `셀럽들의 워너비 인스턴트펑크. 일상에서 편하게 입을 수 있는 컨템포러리 클래식 아이템을 선보입니다. https://bit.ly/3r8AnO6`,
  },
} as ComponentMeta<typeof Profile>;

const Template: ComponentStory<typeof Profile> = ({ ...args }) => <Profile {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  profileInfo,
};

export const 팔로잉 = Template.bind({});
팔로잉.args = {
  profileInfo: {
    ...profileInfo,
    followed: true,
  },
};

export const 라이브상태 = Template.bind({});
라이브상태.args = {
  profileInfo: {
    ...profileInfo,
    disabledProfileLink: false, // 라이브 상태일때만 랜딩 적용
    onAir: true,
    liveId: 123,
  },
};
