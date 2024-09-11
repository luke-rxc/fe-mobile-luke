/**
 * 개인정보 처리 방침 버전 관리
 */
export const usePrivacyVersionService = () => {
  const privacyVersionList = [
    {
      text: 'v.1.4 (2023. 11. 27)',
      value: '',
    },
    {
      text: 'v.1.3 (2023. 11. 13)',
      value: 'v1_3',
    },
    {
      text: 'v.1.2 (2022. 12. 19)',
      value: 'v1_2',
    },
    {
      text: 'v.1.1 (2022. 4. 8)',
      value: 'v1_1',
    },
    {
      text: '최초 개인정보 처리방침',
      value: 'v1',
    },
  ];

  const handleGetVersionList = () => {
    return [...privacyVersionList];
  };

  const handleAnchor = (value: string) => {
    window.location.href = `/policy/privacy/${value}`;
  };

  return {
    handleGetVersionList,
    handleAnchor,
  };
};
