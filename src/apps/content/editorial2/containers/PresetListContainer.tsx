import { Fragment } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { Conditional } from '@pui/conditional';
import { ContentTabSection, PresetComponent } from '../components';
import type { ContentStoryModel, PresetItemModel } from '../models';
import { usePresetListService } from '../services';

type PresetListContainerProps = {
  content: ContentStoryModel;
};
export const PresetListContainer = ({ content }: PresetListContainerProps) => {
  const { theme } = useTheme();
  const applyTheme = { ...theme, ...theme.light };

  const { presetSection } = usePresetListService({
    list: content.componentList,
    displayDateTime: content.dateTime,
  });

  return (
    <ThemeProvider theme={applyTheme}>
      <ListWrapperStyled>
        {presetSection.map((section, index) => {
          const { type, items } = section;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={`${content.code}-section-${index}`}>
              <Conditional
                condition={type === 'TAB'} // 탭 영역인 경우
                trueExp={<ContentTabSection />}
              >
                {items.map((preset: PresetItemModel) => (
                  <Fragment key={`${content.code}-${preset.presetId}`}>
                    <PresetComponent preset={preset} />
                  </Fragment>
                ))}
              </Conditional>
            </Fragment>
          );
        })}
      </ListWrapperStyled>
    </ThemeProvider>
  );
};

const ListWrapperStyled = styled.div`
  background-color: ${({ theme }) => theme.light.color.whiteVariant1};
  color: ${({ theme }) => theme.light.color.black};
`;
