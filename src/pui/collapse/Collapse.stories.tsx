import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Button, ButtonProps } from '@pui/button';
import { Collapse, CollapseRef } from './Collapse';

/**
 * 토글버튼
 */
const Toggle = styled(Button).attrs<ButtonProps>((props) => {
  return {
    bold: true,
    size: 'squircle',
    variant: 'tertiaryfill',
    children: props['aria-expanded'] ? '접기' : '펼침',
  };
})`
  margin-bottom: ${({ theme }) => theme.spacing.s24};
`;

/**
 * Dummy 콘텐츠
 */
const Box = styled.div`
  display: flex;
  height: 15rem;
  background: ${({ theme }) => theme.color.gray20};
  align-items: center;

  &:after {
    display: block;
    width: 100%;
    font: ${({ theme }) => theme.fontType.headlineB};
    text-align: center;
    content: 'content';
  }
`;

export default {
  title: `${StoriesMenu.NonPDS}/Collapse`,
  component: Collapse,
} as ComponentMeta<typeof Collapse>;

const Template: ComponentStory<typeof Collapse> = ({ expanded, ...args }) => {
  const [isExpanded, setExpanded] = useState<boolean>(expanded);

  useEffect(() => {
    setExpanded(expanded);
  }, [expanded]);

  return (
    <>
      <Toggle aria-expanded={isExpanded} onClick={() => setExpanded(!isExpanded)} />
      <Collapse {...args} expanded={isExpanded}>
        <Box />
      </Collapse>
    </>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  expanded: true,
};

export const 최대_축소_설정 = Template.bind({});
최대_축소_설정.args = {
  expanded: false,
  collapseOptions: {
    collapsedHeight: 100,
  },
};

export const 최대_확장_설정 = Template.bind({});
최대_확장_설정.args = {
  expanded: true,
  collapseOptions: {
    expandedHeight: 100,
    expandedStyle: { overflow: 'auto' },
  },
};

export const 애니메이션_없음 = Template.bind({});
애니메이션_없음.args = {
  expanded: true,
  collapseOptions: {
    disabledAnimation: true,
  },
};

export const 축소시_자식요소_삭제 = Template.bind({});
축소시_자식요소_삭제.args = {
  expanded: true,
  removeChild: true,
};

const Template2: ComponentStory<typeof Collapse> = () => {
  const ref = useRef<CollapseRef>(null);
  return (
    <>
      <Toggle onClick={() => ref.current?.handleToggle()} />
      <Collapse defaultExpanded ref={ref}>
        <Box />
      </Collapse>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Ref로_제어 = Template2.bind({});
