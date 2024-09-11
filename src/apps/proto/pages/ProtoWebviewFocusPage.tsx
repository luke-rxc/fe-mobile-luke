import React from 'react';
import styled from 'styled-components';
import { Select } from '@pui/select';
import { TextField } from '@pui/textfield';

const options: Array<{ label: string; value: string }> = [
  { label: 'option 1', value: '1' },
  { label: 'option 2', value: '2' },
  { label: 'option 3', value: '3' },
  { label: 'option 4 - textarea focus', value: '4' },
];

const ProtoWebviewFocusPage: React.FC = () => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target.value === '4' && textAreaRef.current?.focus();
  };

  return (
    <WrapperStyled>
      <SectionStyled>
        <Select onChange={handleChange}>
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </SectionStyled>
      <SectionStyled>
        <TextField ref={textAreaRef} value="text area" type="textarea" />
      </SectionStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  padding: 1.6rem 1.6rem;
`;

const SectionStyled = styled.section`
  margin-bottom: 1.6rem;
`;

export default ProtoWebviewFocusPage;
