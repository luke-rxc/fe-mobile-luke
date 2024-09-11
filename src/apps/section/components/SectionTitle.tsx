import styled from 'styled-components';

interface SectionTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

const SectionTitleComponent: React.FC<SectionTitleProps> = ({ title, subtitle, className, ...props }) => {
  return (
    <div className={className}>
      <div className="inner" {...props}>
        <div className="title">{title}</div>
        {!!subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export const SectionTitle = styled(SectionTitleComponent)`
  display: flex;
  padding: ${({ theme }) => `0 ${theme.spacing.s24}`};

  .inner {
    display: inline-flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 0;
    justify-content: center;
    min-width: 20rem;
    min-height: 5.6rem;
    transition: opacity 250ms;
    opacity: 1;

    &:active {
      opacity: 0.5;
    }
  }

  .title {
    ${({ theme }) => theme.mixin.ellipsis()};
    overflow: hidden;
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.smallB};
  }

  .subtitle {
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
  }
`;
