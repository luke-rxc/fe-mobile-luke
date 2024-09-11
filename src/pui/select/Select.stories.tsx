import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import styled from 'styled-components';
import { Select } from './Select';
import { Option } from './Option';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Select/Select`,
  component: Select,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7013%3A29588',
    },
  },
} as ComponentMeta<typeof Select>;

const values = [
  {
    text: '옵션1',
    value: 'option1',
  },
  {
    text: '옵션2',
    value: 'option2',
  },
  {
    text: '옵션3',
    value: 'option3',
  },
  {
    text: '긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트',
    value: 'longText',
  },
];

const Template: ComponentStory<typeof Select> = (args) => {
  return (
    <ContainerStyled>
      <SectionStyled>
        <Select {...args}>
          {values.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.text}
            </Option>
          ))}
        </Select>
      </SectionStyled>
    </ContainerStyled>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  size: 'large',
  disabled: false,
  placeholder: 'placeholder',
  placeholderStyleProps: undefined,
  error: false,
  helperText: '',
  suffix: null,
};

export const Error = Template.bind({});
Error.args = {
  size: 'large',
  disabled: false,
  placeholder: 'placeholder',
  placeholderStyleProps: undefined,
  error: true,
  helperText: '에러 메세지 영역입니다.에러 메세지 영역입니다.에러 메세지 영역입니다.에러 메세지 영역입니다.',
  suffix: null,
};

const PlaceholderTemplate: ComponentStory<typeof Select> = (args) => {
  return (
    <ContainerStyled>
      <DescriptionStyled>placeholder는 실 기기에서 확인해주세요.</DescriptionStyled>
      <SectionStyled>
        <Select {...args}>
          {values.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.text}
            </Option>
          ))}
        </Select>
      </SectionStyled>
    </ContainerStyled>
  );
};

export const PlaceholderLongText = PlaceholderTemplate.bind({});
PlaceholderLongText.args = {
  size: 'large',
  disabled: false,
  placeholder: 'placeholder placeholder placeholder placeholder placeholder placeholder placeholder placeholder',
  placeholderStyleProps: undefined,
  error: false,
  helperText: '',
  suffix: null,
};

export const PlaceHolderStyleProps = PlaceholderTemplate.bind({});
PlaceHolderStyleProps.args = {
  size: 'large',
  disabled: false,
  placeholder: 'placeholder',
  placeholderStyleProps: { disabled: true },
  error: false,
  helperText: '',
  suffix: null,
};

const SectionStyled = styled.div`
  margin-bottom: 3.2rem;
`;

const ContainerStyled = styled.div`
  .tools {
    margin-bottom: 1rem;
  }
`;

const DescriptionStyled = styled.span`
  display: block;
  margin-bottom: 1rem;
`;
