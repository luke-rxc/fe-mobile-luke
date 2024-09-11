import { Fragment } from 'react';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { getDistinctId, getExperiments, getIdentificationFlag } from '@utils/abTest';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { useWebInterface } from '@hooks/useWebInterface';
import { MP_DISTINCT_ID, MP_IDENTIFICATION_FLAG } from '@constants/abTest';
import { useDeviceDetect } from '@hooks/useDeviceDetect';

export const ABTestInfoContainer = () => {
  const experiments = getExperiments();
  const flag = getIdentificationFlag() ? '1' : '';
  const { isApp } = useDeviceDetect();
  const { showToastMessage } = useWebInterface();

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>, message: string) => {
    e.preventDefault();
    copy(e.currentTarget.innerText);
    showToastMessage({ message });
  };

  return (
    <div>
      <TitleSection title="A/B 테스트 기본 정보" />
      <TitleSection title={MP_DISTINCT_ID} />
      <DescriptionStyled
        onClick={(e) => handleCopy(e, 'Distinct-Id가 복사되었습니다')}
      >{`${getDistinctId()}`}</DescriptionStyled>
      <Divider />
      <TitleSection title={MP_IDENTIFICATION_FLAG} />
      <DescriptionStyled>{flag}</DescriptionStyled>
      <Divider />
      {!isApp && (
        <>
          <TitleSection title="실험 정보" />
          {experiments.map((experiment) => {
            return (
              <Fragment key={experiment.id}>
                <DescriptionStyled>
                  <ul>
                    <li className="field">id: {experiment.id}</li>
                    <li className="field">type: {experiment.type}</li>
                    <li className="field">name: {experiment.name}</li>
                    <li className="field">group: {experiment.group}</li>
                  </ul>
                </DescriptionStyled>
                <Divider />
              </Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

const DescriptionStyled = styled.div`
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};

  .field {
    padding-top: ${({ theme }) => theme.spacing.s8};
    padding-bottom: ${({ theme }) => theme.spacing.s8};

    &:last-child {
      padding-bottom: 0;
    }
    &:first-child {
      padding-top: 0;
    }
  }
`;
