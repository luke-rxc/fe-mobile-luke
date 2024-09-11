import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAddress } from '../../hooks';
import { CheckoutShippingModel, CheckoutShippingFormProps } from '../../models';

interface Props extends CheckoutShippingFormProps {
  item?: CheckoutShippingModel;
  onSubmit: () => void;
  onAddressChange: (address: { code: string; addr: string }) => void;
}

export const CheckoutShippingForm = ({ item, register, onAddressChange, onSubmit: handleSubmit, ...other }: Props) => {
  const { address, show, ref } = useAddress<HTMLDivElement>();
  const [isShowAddressSearch, setIsShowAddressSearch] = useState(false);

  function handleAddressSearch() {
    setIsShowAddressSearch(!isShowAddressSearch);
  }

  useEffect(() => {
    if (isShowAddressSearch) {
      show();
    }
  }, [isShowAddressSearch, show]);

  useEffect(() => {
    if (address) {
      onAddressChange(address);
    }
    setIsShowAddressSearch(false);
  }, [address, onAddressChange]);

  return (
    <ContainerStyled onSubmit={handleSubmit} {...other}>
      <label>
        <span>수취인명</span>
        <input {...register('name')} type="text" />
      </label>
      <label>
        <span>핸드폰번호</span>
        <input {...register('phone')} type="text" />
      </label>
      <label>
        <span>배송지명</span>
        <input {...register('addressName')} type="text" />
      </label>
      <label>
        <span>우편번호</span>
        <div className="address_search">
          <input {...register('postCode')} type="text" readOnly />
          <AddressSearchButtonStyled type="button" onClick={handleAddressSearch}>
            검색
          </AddressSearchButtonStyled>
        </div>
      </label>
      {isShowAddressSearch && (
        <AddressSearchContainerStyled>
          <AddressSearchStyled ref={ref} />
        </AddressSearchContainerStyled>
      )}
      <label>
        <span>배송지주소</span>
        <input {...register('address')} type="text" readOnly />
      </label>
      <label>
        <span>상세주소</span>
        <input {...register('addressDetail')} type="text" />
      </label>
      <label>
        <input {...register('isDefault')} type="checkbox" /> 기본배송지로 저장
      </label>
      <ShippingRegisterButtonStyled type="submit">등록하기</ShippingRegisterButtonStyled>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  label {
    display: block;
    width: 100%;
    margin-bottom: 1rem;

    span {
      display: inline-block;
      width: 30%;
    }
    input[type='text'] {
      display: inline-block;
      width: 60%;
    }
    input[type='checkbox'] {
      vertical-align: middle;
    }
  }

  .address_search {
    display: inline-block;
    width: 60%;
  }
`;

const ShippingRegisterButtonStyled = styled.button`
  width: 33%;
  min-width: 55px;
  min-height: 55px;
  color: #fff;
  background-color: #1c64f2;
  border: none;
  border-radius: 4px;
`;

const AddressSearchContainerStyled = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const AddressSearchStyled = styled.div`
  height: 300px;
`;

const AddressSearchButtonStyled = styled.button`
  display: inline-block;
  box-sizing: border-box;
  width: 45px;
  height: 25px;
  color: #000;
  font-size: 99%;
  background-color: #fff;
  border: none;
  border-radius: 4px;
`;
