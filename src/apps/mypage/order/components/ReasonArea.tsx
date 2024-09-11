import styled from 'styled-components';

export interface ReasonInfoProps {
  /** 컴포넌트 클래스네임 */
  className?: string;
  /** 타이틀 */
  title: string;
  /** 취소 사유 */
  reasonText?: string;
}

const ReasonAreaComponent = ({ className, title, reasonText }: ReasonInfoProps) => {
  return (
    <div className={className}>
      <div className="title">{title}</div>
      <div className="reason" children={reasonText} />
    </div>
  );
};

export const ReasonArea = styled(ReasonAreaComponent)`
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s16};
  margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s12} ${theme.spacing.s24}`};
  border-radius: ${({ theme }) => theme.radius.r8};
  background: ${({ theme }) => theme.color.brand.tint3};

  .title {
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  .reason {
    margin-top: ${({ theme }) => theme.spacing.s4};
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.text.textTertiary};
  }
`;
