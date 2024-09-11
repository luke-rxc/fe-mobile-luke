export const handleChangeFormat = (value: string, isSettingFormat: boolean) => {
  if (isSettingFormat) {
    // string yyyymmdd -> yyyy.mm.dd format
    const sYear = value.substring(0, 4);
    const sMonth = value.substring(4, 6);
    const sDate = value.substring(6, 8);
    return `${sYear}. ${sMonth}. ${sDate}`;
  }
  // yyyy.mm.dd -> yyyymmdd string
  return value.replace(/./g, '');
};
