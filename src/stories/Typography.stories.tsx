import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import get from 'lodash/get';
import omit from 'lodash/omit';

import { StoriesMenu } from '@stories/menu';
import { theme as globalTheme, Theme } from '@styles/theme';

/** FontType key값 */
type FontTypeKeys = keyof Theme['fontType'];
/** FontType 아이템  */
const Typography = styled(({ font, className }: { font: FontTypeKeys; deprecated?: boolean; className?: string }) => {
  const attrs = get(globalTheme.fontType, font, '').replace(globalTheme.fontFamily, '').trim();

  const handelClick = () => {
    copy(`theme.fontType.${font}`);
    toast.success(`클립보드복사: theme.fontType.${font}`);
  };

  return (
    <button type="button" className={className} onClick={handelClick}>
      <span className="typo-title">{font}</span>
      <span className="typo-attrs">{attrs}</span>
      <span className="typo-text">자세히 보아야 예쁘다 오래 보아야 사랑스럽다 너도 그렇다</span>
    </button>
  );
})`
  display: flex;
  width: 100%;
  padding: 2.5rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.color.gray8};
  background: ${({ theme }) => theme.color.white};
  ${({ deprecated }) => deprecated && 'text-decoration: line-through;'}
  transition: background 0.3s;
  align-items: center;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.color.gray3};
  }

  .typo-title,
  .typo-attrs {
    flex: 0 0 auto;
    font: ${({ theme }) => theme.fontType.t20B};
    color: ${({ theme }) => theme.color.gray50};
  }

  .typo-title {
    min-width: 10rem;
  }

  .typo-attrs {
    min-width: 30rem;
  }

  .typo-text {
    flex: 1 1 auto;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font: ${({ theme, font }) => theme.fontType[font]};
  }
`;

export default {
  title: `${StoriesMenu.Foundation}/Typography`,
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    design: [
      {
        name: 'KO',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7506%3A30806',
      },
      {
        name: 'EN',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7484%3A32722',
      },
    ],
  },
};

const Template = () => {
  return (
    <>
      {Object.keys(
        omit(globalTheme.fontType, [
          't32B',
          't24B',
          't24',
          't20B',
          't20',
          't18B',
          't18',
          't15B',
          't15',
          't14B',
          't14',
          't12B',
          't12',
          't10B',
          't10',
        ]),
      ).map((font) => (
        <Typography key={font} font={font as FontTypeKeys} />
      ))}
    </>
  );
};

export const 기본 = Template.bind({});
