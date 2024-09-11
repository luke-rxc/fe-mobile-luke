import styled from 'styled-components';
import { GoodsOptions } from '@pui/orderGoodsListItem';
import { AdditionalInfoOptionProps } from '../types';
import { CountdownProgress } from './CountdownProgress';
import { AdditionalInfoCarousel } from './AdditionalInfoCarousel';

export const AdditionalInfoOptionList = ({
  inputFormOptionList,
  isSubmitInputForm,
  sectionType,
}: AdditionalInfoOptionProps) => {
  return (
    <>
      {inputFormOptionList?.map((data) => {
        return (
          <div key={data.optionId}>
            <WrapperStyled>
              <div className="title-area">
                <div className="title-options-area">
                  <span className="title">{data.title}</span>
                  <GoodsOptions options={data.options} />
                </div>
                {!isSubmitInputForm && <CountdownProgress count={data.currentCount} total={data.totalCount} />}
              </div>
            </WrapperStyled>
            <CarouselStyled>
              <AdditionalInfoCarousel
                optionId={data.optionId}
                goodsId={data.goodsId}
                goodsName={data.goodsName}
                items={data.airlineTicketList}
                isSubmitInputForm={isSubmitInputForm}
                isCompleteInputForm={data.totalCount === data.currentCount}
                sectionType={sectionType}
                inputFormType={data.inputFormType}
              />
            </CarouselStyled>
          </div>
        );
      })}
    </>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};

  .title-area {
    display: flex;
    position: relative;
    align-items: center;
    width: 100%;
    .title-options-area {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      font: ${({ theme }) => theme.fontType.mediumB};
      color: ${({ theme }) => theme.color.text.textPrimary};
      margin-right: ${({ theme }) => theme.spacing.s16};
      word-break: keep-all;
      .title {
        margin-bottom: ${({ theme }) => theme.spacing.s4};
      }
    }
  }
`;

const CarouselStyled = styled.div`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s24} ${theme.spacing.s12} ${theme.spacing.s24}`};
  overflow: hidden;
`;
