import styled from 'styled-components';
import { Button } from '@pui/button';
import { CollapseSection } from './CollapseSection';
import { AdditionalInfoProps } from '../types';
import { AdditionalInfoOptionList } from './AdditionalInfoOptionList';
import { AdditionalInfoText } from '../constants';

const ButtonWrapperStyled = styled.div`
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} 0 ${theme.spacing.s24}`};
`;

export const AdditionalInfo = ({
  data,
  className,
  handleConfirmAirlineTicket,
  isConfirmAirlineTicketLoading,
}: AdditionalInfoProps) => {
  const { title, sectionType, inputFormOptionList, isSubmitInputForm, isCompletedEntry } = data;
  return (
    <CollapseSection title={title} className={className}>
      <AdditionalInfoOptionList
        inputFormOptionList={inputFormOptionList}
        isSubmitInputForm={isSubmitInputForm}
        sectionType={sectionType}
      />
      {!isSubmitInputForm && (
        <ButtonWrapperStyled>
          <Button
            bold
            block
            variant="primary"
            size="large"
            onClick={handleConfirmAirlineTicket}
            loading={isConfirmAirlineTicketLoading}
            disabled={!isCompletedEntry}
          >
            {AdditionalInfoText.SECTION.CONFIRM}
          </Button>
        </ButtonWrapperStyled>
      )}
    </CollapseSection>
  );
};
