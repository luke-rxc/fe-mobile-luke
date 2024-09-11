import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GeoMapLocation } from './GeoMapLocation';

export default {
  title: `${StoriesMenu.Features}/map/GeoMapLocation`,
  component: GeoMapLocation,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?type=design&node-id=73917-81914&mode=dev',
    },
  },
} as ComponentMeta<typeof GeoMapLocation>;

const Template: ComponentStory<typeof GeoMapLocation> = (args) => {
  return (
    <Wrapper>
      <GeoMapLocation {...args} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 102.4rem;
  margin: 0 auto;
`;

export const 기본 = Template.bind({});
기본.args = {
  place: {
    id: 17,
    name: 'WE호텔 제주',
    latitude: 33.2861399,
    longitude: 126.44420860000001,
    country: 'KOR',
    address: '제주 서귀포시 1100로 453-95',
    mapImage: {
      id: 1468389,
      path: 'goods/20240311/b334167e-4d0a-4021-8791-75e959f7c6a9.jpg',
      blurHash:
        '|MRypZo~XRo#WUr^X7o}V@^+j?bvjYbIi_bcf$afbua#e.a}jYbvaee:f*?^jFi_jujZb]e.jFf+bvjFe:jZfRg2e:jFbb^+flf*flfijGf5f+f6ixfkbbfjf+i_fRbbjZ^+fkbaj[bHjGa|f*f7f+a|f6f6f6bHbHf6f6',
      width: 1024,
      height: 192,
      fileType: 'IMAGE',
      extension: 'jpg',
    },
    googleLink:
      'https://www.google.com/maps/search/?api=1&query=33.2861399%2C126.44420860000001&query_place_id=ChIJEfvBU6JQDDURs7hn6t5mrdQ',
  },
};
