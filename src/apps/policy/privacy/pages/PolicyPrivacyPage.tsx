import { NotFound } from '@features/exception/components';
import { useParams } from 'react-router-dom';
import {
  PrivacyContainer,
  PrivacyV1_1Container,
  PrivacyV1_2Container,
  PrivacyV1_3Container,
  PrivacyV1Container,
} from '../containers';

type Version = string;

const PrivacyContents: Record<Version, () => () => JSX.Element> = {
  latest: () => PrivacyContainer,
  v1_3: () => PrivacyV1_3Container,
  v1_2: () => PrivacyV1_2Container,
  v1_1: () => PrivacyV1_1Container,
  v1: () => PrivacyV1Container,
} as const;

const PolicyPrivacyPage = () => {
  const { version } = useParams<{ version?: Version }>();

  const versionKey = version ?? 'latest';
  const Content = PrivacyContents[versionKey]?.();

  return Content ? <Content /> : <NotFound />;
};

export default PolicyPrivacyPage;
