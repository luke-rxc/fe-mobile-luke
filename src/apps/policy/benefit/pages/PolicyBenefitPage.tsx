import { NotFound } from '@features/exception/components';
import { useParams } from 'react-router-dom';
import { BenefitContainer } from '../containers';

type Version = string;

const BenefitContents: Record<Version, () => () => JSX.Element> = {
  latest: () => BenefitContainer,
} as const;

const PolicyBenefitPage = () => {
  const { version } = useParams<{ version?: Version }>();

  const versionKey = version ?? 'latest';
  const Content = BenefitContents[versionKey]?.();

  return Content ? <Content /> : <NotFound />;
};

export default PolicyBenefitPage;
