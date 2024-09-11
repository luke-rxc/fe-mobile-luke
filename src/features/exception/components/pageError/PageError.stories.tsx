import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { PageError } from './PageError';
import { ErrorActionButtonLabel } from '../../constants';

export default {
  title: 'features/Exception/PageError',
  component: PageError,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=10699%3A53366',
    },
  },
} as ComponentMeta<typeof PageError>;

/** Error Model 예시 */
const errorDataResponse: ErrorDataModel = {
  code: 'E404600',
  errors: [],
  message: '상품을 찾을 수 없습니다.',
  timestamp: 1624869250972,
};
const errorResponse: Omit<ErrorModel, 'data'> = {
  config: {},
  status: 404,
  message: 'Request failed with status code ~~',
};
const defaultErrorResponse: ErrorModel = {
  ...errorResponse,
  data: errorDataResponse,
};

const Template: ComponentStory<typeof PageError> = (args) => {
  return (
    <div style={{ maxWidth: '375px', height: '812px', margin: '0 auto' }}>
      <PageError {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  error: defaultErrorResponse,
};

export const 하단_버튼_삽입 = Template.bind({});
하단_버튼_삽입.args = {
  error: defaultErrorResponse,
  actionLabel: ErrorActionButtonLabel.HOME,
  onAction: () => {
    // eslint-disable-next-line no-console
    console.log('Home 으로 이동');
  },
};

export const DefaultMessage = Template.bind({});
const errorNotMessageResponse = {
  ...errorResponse,
  data: {
    ...errorDataResponse,
    message: '',
  },
};
DefaultMessage.args = {
  error: errorNotMessageResponse,
  defaultMessage: '오류리턴 메시지가 없을때 defaultMessage 사용',
};

export const Status = Template.bind({});
Status.args = {
  error: defaultErrorResponse,
  status: {
    404: {
      title: '404 오류 타이틀',
      description: '404 오류를 따로 처리합니다.',
      actionLabel: '버튼이름',
      onAction: () => {
        // eslint-disable-next-line no-console
        console.log('404 버튼 액션을 진행');
      },
    },
    405: {
      title: '405 오류 타이틀',
      description: '405 오류를 따로 처리합니다.',
      actionLabel: '버튼이름',
      onAction: () => {
        // eslint-disable-next-line no-console
        console.log('405 버튼 액션을 진행');
      },
    },
  },
};

export const 오류객체_무시하고_커스텀으로_워딩구성 = Template.bind({});
오류객체_무시하고_커스텀으로_워딩구성.args = {
  error: defaultErrorResponse,
  title: '이건 커스텀 타이틀',
  description: '오류 Response 무시하고 여기에 세팅된 문구대로 표시',
};

export const 오류객체_없이_커스텀으로_워딩구성 = Template.bind({});
오류객체_없이_커스텀으로_워딩구성.args = {
  title: '이건 커스텀 타이틀',
  description: '오류 Response 없이 여기에 세팅된 문구대로 표시',
};

export const Error429 = Template.bind({});
const error429Response = {
  ...errorResponse,
  status: 429,
  data: errorDataResponse,
};
Error429.args = {
  error: error429Response,
};

export const Error500 = Template.bind({});
const error500Response = {
  ...errorResponse,
  status: 503,
  data: errorDataResponse,
};
Error500.args = {
  error: error500Response,
};
