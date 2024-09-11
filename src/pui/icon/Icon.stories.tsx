import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { createDebug } from '@utils/debug';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Icon } from './Icon';
import * as icons from './icons';

const debug = createDebug();

/** 제목 컴포넌트 */
const Title = styled.h2`
  width: 100%;
  margin: 6rem 0 3rem;
  padding: 0 0 2rem;
  border-bottom: ${({ theme }) => `1px solid ${theme.color.gray20}`};
  font: ${({ theme }) => theme.fontType.t20B};
`;
/** 아이콘 리스트 */
const IconViewerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* max-width: 100rem; */
  margin: 0 auto;
  &:nth-child(1) ${Title} {
    margin-top: 1rem;
  }
`;
/** 아이콘 리스트 아이템 */
const IconViewer = styled.button.attrs({ type: 'button' })`
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 12.5%;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: transparent;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.color.brand.tint};
    color: ${({ theme }) => theme.color.surface};
  }
`;
/** 아이콘 이름 */
const IconName = styled.span`
  display: block;
`;

export default {
  title: `${StoriesMenu.Graphic}/Iconography`,
  component: Icon,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7525%3A31483',
    },
  },
  args: {
    size: '2.4rem',
    minSize: undefined,
    maxSize: undefined,
    colorCode: undefined,
    color: undefined,
  },
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => {
  const handelClick = (iconName: string) => () => {
    copy(`<${iconName} />`);
    debug.log(`클립보드복사: <${iconName} />`);
    toast.success(`클립보드복사: <${iconName} />`);
  };

  return (
    <>
      <IconViewerContainer>
        <Title>Stroke Type</Title>
        {outline.map((name) => {
          const OutlineIcon = (icons as any)[name];
          return (
            <IconViewer key={name} onClick={handelClick(name)}>
              <OutlineIcon {...args} />
              <IconName>{name}</IconName>
            </IconViewer>
          );
        })}
      </IconViewerContainer>

      <IconViewerContainer>
        <Title>Solid Type</Title>
        {solid.map((name) => {
          const SolidIcon = (icons as any)[name];
          return (
            <IconViewer key={name} onClick={handelClick(name)}>
              <SolidIcon {...args} />
              <IconName>{name}</IconName>
            </IconViewer>
          );
        })}
      </IconViewerContainer>

      <IconViewerContainer>
        <Title>Deprecated</Title>
        {deprecated.map((name) => {
          const DeprecatedIcon = (icons as any)[name];
          return (
            <IconViewer key={name} onClick={handelClick(name)}>
              <DeprecatedIcon {...args} />
              <IconName>{name}</IconName>
            </IconViewer>
          );
        })}
      </IconViewerContainer>
    </>
  );
};

export const 기본 = Template.bind({});

const outline = [
  'Home',
  'ChevronLeft',
  'ArrowLeft',
  'Hamburger',
  'Video',
  'ZoomOut',
  'Card',
  'Option',
  'Discover',
  'ChevronRight',
  'ArrowRight',
  'Search',
  'Bubble',
  'Claim',
  'Coupon',
  'OptionVertical',
  'Bag',
  'ChevronUp',
  'ArrowUp',
  'Like',
  'Pin',
  'Delivery',
  'Gps',
  'CheckboxCheckAos',
  'Profile',
  'ChevronDown',
  'ArrowDown',
  'ShareIos',
  'Price',
  'Order',
  'Sort',
  'CheckboxCheckIos',
  'Info',
  'Plus',
  'Close',
  'ShareAos',
  'MuteOff',
  'Wifi',
  'Filter',
  'Checkmark',
  'Question',
  'Minus',
  'Bell',
  'Edit',
  'MuteOn',
  'Empty',
  'Trashbin',
  'CircleCheck',
  'PrizmLive',
  'Schedule',
  'Setting',
  'Clear',
  'ChevronRightThin',
  'Download',
  'Duplicate',
  'Gobackward',
  'Wheelchair',
  'Stand',
  'Camera',
  'Image',
  'Tag',
  'Location',
  'Pin1',
  'Calendar',
  'Notice',
  'Luggage',
];

const solid = [
  'HomeFilled',
  'BellFilled',
  'VideoFilled',
  'KakaoFilled',
  'ProfileSignin',
  'NaverPayFilled',
  'DiscoverFilled',
  'LikeFilled',
  'BubbleFilled',
  'AppleFilled',
  'ApplePay',
  'TossFilled',
  'BagFilled',
  'CameraFilled',
  'PinFilled',
  'PlayStoreFilled',
  'PrizmPayFilled',
  'KBPayFilled',
  'ProfileFilled',
  'CardFilled',
  'PriceFilled',
  'InfoFilled',
  'LineFilled',
  'ScheduleFilled',
  'SendFilled',
  'InfantFilled',
  'NoticeFilled',
  'ErrorFilled',
  'CouponFilled',
  'PauseFilled',
  'Translate',
  'PlayFilled',
];

const deprecated = [
  'Back',
  'BagPlus',
  'BagPlusFilled',
  'BellCircle',
  'Clipboard',
  'Forward',
  'LikeSlash',
  'LikeSlashFilled',
  'List',
  'ListFilled',
  'Logo',
  'NaverFilled',
  'Play',
  'ThumbsDown',
  'ThumbsDownFilled',
  'ThumbsUp',
  'ThumbsUpFilled',
  'Upward',
];
