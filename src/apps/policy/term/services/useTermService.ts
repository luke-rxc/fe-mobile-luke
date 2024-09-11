/**
 * 서비스 이용 약관 버전 관리
 */
export const useTermService = () => {
  const termVersionList = [
    {
      text: 'v1.1 (2023. 4. 13)',
      value: 'v1_1',
    },
    {
      text: '최초 서비스이용약관',
      value: 'v1',
    },
  ];

  const handleGetVersionList = () => {
    return [...termVersionList];
  };

  const handleAnchor = (value: string) => {
    window.location.href = `/policy/term/${value}`;
  };

  return {
    handleGetVersionList,
    handleAnchor,
  };
};
