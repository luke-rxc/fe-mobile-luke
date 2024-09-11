import { useParams } from 'react-router-dom';
import { AdditionalInfoContainer } from '../containers';
import { AdditionalInfoCommonProps } from '../types';

const AdditionalInfoPage = () => {
  const { type } = useParams<AdditionalInfoCommonProps>();
  return <AdditionalInfoContainer type={type} />;
};

export default AdditionalInfoPage;
