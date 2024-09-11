import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { CheckoutShippingFormFields, toCheckoutShippingListModel } from '../models';
import { createShipping, deleteShipping, getShippingList } from '../apis';

type Mode = 'list' | 'form';

export const useShippingService = (defaultMode?: Mode) => {
  const [mode, setMode] = useState<'list' | 'form'>(defaultMode ?? 'list');
  const { getValues, handleSubmit, register, setValue } = useForm<CheckoutShippingFormFields>({
    defaultValues: {
      isDefault: false,
      addressName: '',
      address: '',
      addressDetail: '',
      name: '',
      phone: '',
      postCode: '',
    },
  });
  const { data: shippingList, refetch: refetchShippingList } = useQuery(
    ['checkout', 'shipping'],
    () => getShippingList(),
    {
      select: toCheckoutShippingListModel,
    },
  );
  const { mutateAsync: registerShipping } = useMutation(
    () => {
      const [addressName, address, addressDetail, isDefault, name, phone, postCode] = getValues([
        'addressName',
        'address',
        'addressDetail',
        'isDefault',
        'name',
        'phone',
        'postCode',
      ]);
      return createShipping({
        addressName,
        address,
        addressDetail,
        isDefault,
        name,
        phone,
        postCode,
      });
    },
    {
      onSuccess: () => {
        refetchShippingList();
        setMode('list');
      },
      onError: (err) => {
        alert(err.message);
      },
    },
  );
  const { mutateAsync: removeShipping } = useMutation((shippingId: number) => {
    return deleteShipping(shippingId);
  });

  const onSubmit = async () => {
    await registerShipping();
  };

  const handleRemove = async (shippingId: number) => {
    await removeShipping(shippingId);
    refetchShippingList();
  };

  const handleCreate = () => {
    setMode('form');
  };

  const handleList = () => {
    setMode('list');
  };

  const handleAddressChange = (address: { code: string; addr: string }) => {
    setValue('postCode', address.code);
    setValue('address', address.addr);
  };

  return {
    mode,
    shippingList: shippingList?.content ?? [],
    handleSubmit: handleSubmit(onSubmit),
    handleCreate,
    handleList,
    handleRemove,
    register,
    handleAddressChange,
  };
};
