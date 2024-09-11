import { EventBannerList, EventBannerListProps } from '@pui/eventBanner';
import styled from 'styled-components';

export interface PrizmPayEventBannerProps extends Omit<EventBannerListProps, 'onClick'> {
  onClick: () => void;
}

export const PrizmPayEventBanner = ({ list, onClick, onIndexChange, bgColor, ...rest }: PrizmPayEventBannerProps) => {
  return (
    <ContainerStyled {...rest}>
      <EventBannerList list={list} bgColor={bgColor} onClick={onClick} onIndexChange={onIndexChange} />
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  padding: 2.4rem;

  ${EventBannerList} {
    padding: 0;
  }
`;
