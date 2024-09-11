import styled from 'styled-components';
import { TitleSub } from '@pui/titleSub';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { ListType } from '../types';

export interface SettingListProps {
  title: string;
  list: ListType[];
  onClick: (value: ListType) => void;
  divider?: boolean;
}

export const SettingList = ({ title, list, onClick: handleClick, divider }: SettingListProps) => {
  return (
    <>
      <TitleSubWrapper>
        <TitleSection title={title} />
        {list.map((value) => (
          <TitleSub key={value.title} title={value.title} onClick={() => handleClick && handleClick(value)} noBold />
        ))}
      </TitleSubWrapper>
      {divider && <Divider />}
    </>
  );
};
const TitleSubWrapper = styled.div`
  padding-bottom: 1.2rem;
`;
