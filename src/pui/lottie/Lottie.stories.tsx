import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import styled from 'styled-components';
import { useState } from 'react';
import { Lottie } from './Lottie';
import * as lotties from './lotties';

export default {
  title: `${StoriesMenu.Graphic}/Lottie`,
  component: Lottie,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7539%3A33061',
    },
  },
} as ComponentMeta<typeof Lottie>;

/** 제목 컴포넌트 */
const Title = styled.h2`
  width: 100%;
  margin: 6rem 0 3rem;
  padding: 0 0 2rem;
  border-bottom: ${({ theme }) => `1px solid ${theme.color.gray20}`};
  font: ${({ theme }) => theme.fontType.t20B};
`;

/** 로띠 리스트 */
const LottieViewerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100rem;
  margin: 0 auto;
  &:nth-child(1) ${Title} {
    margin-top: 1rem;
  }
  .viewer {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 15rem;
    height: 16rem;
    margin-right: 1rem;
    margin-bottom: 2rem;
    text-align: center;
    & .name {
      margin-bottom: 1.5rem;
    }
  }
`;

/** 로띠 리스트 아이템 */
const LottieViewer = styled.div`
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 10%;
  padding: 1rem;
  text-align: center;
`;

const lottieProfileList = Object.keys(lotties).filter((name) => name.includes('Profile'));

const lottieList = Object.keys(lotties).filter((name) => !name.includes('Profile'));

const Template: ComponentStory<typeof Lottie> = ({ ...args }) => {
  return (
    <>
      <LottieViewerContainer>
        <Title>Profile Lottie List</Title>
        {lottieProfileList.map((name) => {
          const LottieItem = (lotties as any)[name];
          const size = name.replace(/[^0-9]/g, '');
          return (
            <LottieViewer key={name} className="viewer">
              <div className="name">{name}</div>
              <div style={{ width: +size, height: +size }}>
                <LottieItem {...args} />
              </div>
            </LottieViewer>
          );
        })}
      </LottieViewerContainer>

      <LottieViewerContainer>
        <Title>기타 Lottie List</Title>
        {lottieList.map((name) => {
          const LottieItem = (lotties as any)[name];
          return (
            <LottieViewer key={name}>
              <LottieItem lottieColor="#000000" {...args} />
              <div>{name}</div>
            </LottieViewer>
          );
        })}
      </LottieViewerContainer>
    </>
  );
};

export const 로띠_전체리스트 = Template.bind({});
로띠_전체리스트.args = {};

const LikeItem = (lotties as any).Like;
const Template2: ComponentStory<typeof LikeItem> = ({ ...args }) => <LikeItem {...args} />;
export const 로띠컬러적용 = Template2.bind({});
로띠컬러적용.args = {
  width: '200px',
  height: '200px',
  lottieColor: '#ff0000',
};

const BellItem = (lotties as any).Bell;
const Template3: ComponentStory<typeof BellItem> = ({ ...args }) => <BellItem {...args} />;
export const 로띠_커스텀플레이_옵션 = Template3.bind({});
로띠_커스텀플레이_옵션.args = {
  width: '200px',
  height: '200px',
  animationOptions: {
    loop: false,
  },
};
const MuteItem = (lotties as any).Mute;
const Template4: ComponentStory<typeof MuteItem> = ({ ...args }) => {
  const [muted, setMuted] = useState(true);
  const handleClickToggle = () => {
    setMuted((prev) => !prev);
  };
  return (
    <MuteItem
      {...{
        toggle: {
          active: !muted,
          disabled: false,
          onClickToggle: handleClickToggle,
        },
      }}
      {...args}
    />
  );
};
export const 로띠_토글옵션 = Template4.bind({});
로띠_토글옵션.args = {
  width: '200px',
  height: '200px',
};
