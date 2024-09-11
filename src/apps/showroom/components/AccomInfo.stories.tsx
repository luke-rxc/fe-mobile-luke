import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { AccomInfo } from './AccomInfo';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/AccomInfo`,
  component: AccomInfo,
  parameters: {
    design: [
      {
        type: 'figma',
        name: '숙소 정보',
        url: 'https://www.figma.com/design/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=82859-428627&t=dkXaqXHXXTjoTYwG-4',
      },
    ],
  },
} as ComponentMeta<typeof AccomInfo>;

const Wrapper = styled.div`
  --backgroundColor: #ffffff;
  --contentColor: #000000;
  --tintColor: #000000;
  --textColor: #ffffff;
`;
const Template: ComponentStory<typeof AccomInfo> = ({ ...args }) => (
  <Wrapper>
    <AccomInfo {...args} />
  </Wrapper>
);

export const 기본 = Template.bind({});
기본.args = {
  info: [
    {
      title: '체크인 | 체크아웃',
      contents: ['오후 3시', '오전 11시'],
    },
    {
      title: '부대시설',
      contents: ['매점/편의점', '수영장', '찜질방', '바베큐장'],
    },
    {
      title: '공용 서비스',
      contents: ['주차가능', '주차가능', '취사가능', '취사가능', '발렛파킹', '발렛파킹', 'WIFI', 'WIFI'],
    },
  ],
  place: {
    id: 1,
    name: '포도호텔',
    address: '제주 서귀포시',
    country: 'KOR',
    googleLink:
      'https://www.google.com/maps/search/?api=1&query=33.3177778%2C126.38749999999999&query_place_id=ChIJQX0R_dNbDDURsB-vTMc0050',
    latitude: 33.3177778,
    longitude: 126.38749999999999,
    mapImage: {
      blurHash:
        '|QPjum}_T0xFROK0t8xGa#^,j[X8f9r@j[t9f5W9t8R%WBWUofWBf8W.a_?ujunQf*oye:aef*kCogf6aebFkCjZn+bFbF?bj]WnjZn+W.a{ayj[r^fjX5jbn+bGfkjZjZ?boMW.jZjZbFbGf6j[oMayaya{j[jba}bFjZ',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 192,
      id: 1468371,
      path: 'goods/20240308/43d45df0-9714-4eb8-a2cd-56962db90703.jpg',
      width: 1024,
    },
  },
};
