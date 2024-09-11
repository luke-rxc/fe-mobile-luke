import { uid } from '@utils/nanoid';
import { ContentSchema } from '../../schemas';
import { ContentParam, getContentList } from '..';

const dataSet: ContentSchema['content'] = [
  {
    id: 21235,
    code: 'wowdraw3rd',
    name: '아이패드 프로 응모',
    startDate: 1646964000000,
    endDate: null,
    image: {
      id: 46848,
      path: 'story/20220315/da6af664-30da-49a4-ba3a-e008a7f40eb9.jpeg',
      blurHash:
        '|vE9w-S#a:nmnyWYR~oMa*afa#WFayj?oLk9a}j[fqoLoXWoWZn%fAWXfNR.ayo0oLbHayj?o0j@o5azbCoLa~WVo3oLWUoOj@bDa|juj@a#WWa{awf7WYWVoJoLbFWVoLs;j[j=ayjba#a#fQayR%azajj@fibGj?oKoL',
      width: 1440,
      height: 1080,
    },
    type: 'TEASER',
    contentType: 'teaser',
    showRoom: null,
    isActive: false,
  },
  {
    id: 21224,
    code: 'wowdraw2nd',
    name: '3월 2주차 와우 드로우',
    startDate: 1648447200000,
    endDate: null,
    image: {
      id: 44588,
      path: 'story/20220311/b8866305-0030-452d-a1e8-62046d3000fb.jpeg',
      blurHash:
        '|BFzGNKQ9CNYN6r%bVxdV|IVRoS7oZn.xaotR.t70Fxc^}R$s}R%M~R+Rkj|sYM-SItJj[s*oJaf-;R$W7s=N4WCWGj;xsxdW*s~s?NLWCjMn$f#V~R*IVn-%Lobt2oIRUV%oy%JaeWTa$RnWARkR.WCRnoeRjk9t6oftM',
      width: 1440,
      height: 1080,
    },
    type: 'TEASER',
    contentType: 'teaser',
    showRoom: null,
    isActive: true,
  },
  {
    id: 21221,
    code: 'wowdraw0304',
    name: '3월 1주차 와우 드로우',
    startDate: 1646146800000,
    endDate: null,
    image: {
      id: 33571,
      path: 'story/20220302/e3c6cf1b-4a9c-4014-8f18-76768e8f75d0.jpeg',
      blurHash:
        '|GE^b,xyD;NXnsRmoikBRpN3V|RobCoNoboaa%s,DyX1-+n:Rzj[NFjdWAWHWSRljeouogs;j;RkxpfgWDj[RkWGa#kAt7s[bEt2s;RiWCWEaxt7W-WGM}f6t5obofbERkjdogt6WAogj?R*WFRnIXRnkBoeayocoea_t6',
      width: 1024,
      height: 768,
    },
    type: 'TEASER',
    contentType: 'teaser',
    showRoom: null,
    isActive: true,
  },
];

export const contentMock: ContentSchema = {
  content: dataSet.slice(),
  metadata: null,
  nextParameter: 'salesStartDate=1625119293000&id=46&sortNumber=0',
};

const getRandomCount = () => {
  return Math.floor(Math.random() * dataSet.length);
};

let count = 0;
const createContentMock = ({ nextParameter = '', size = 20 }: Omit<ContentParam, 'showroomId'>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  count += 1;
  const content = Array(size)
    .fill(contentMock.content[getRandomCount()])
    .map(() => ({
      ...contentMock.content[getRandomCount()],
      code: `${contentMock.content[getRandomCount()].code}${uid()}`,
      name: contentMock.content[getRandomCount()].name,
      image: contentMock.content[getRandomCount()].image,
      startDate: contentMock.content[getRandomCount()].startDate,
    }));
  return {
    ...contentMock,
    content,
    nextParameter,
  };
};

export const contentsMockApi = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showroomId,
  nextParameter = '',
  size,
}: ContentParam): ReturnType<typeof getContentList> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(createContentMock({ nextParameter, size }));
    }, 1000);
  });
