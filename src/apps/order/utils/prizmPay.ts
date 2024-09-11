export const prizmPay = () => {
  const isFail = () => {
    return false;
  };

  const isUserCancel = () => {
    return false;
  };

  const approve = async () => {
    return true;
  };

  return {
    isFail,
    isUserCancel,
    approve,
  };
};
