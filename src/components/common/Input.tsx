import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface InputFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      css={inputStyle}
    />
  );
};

export default InputField;

// InputField 컴포넌트에 대한 스타일
const inputStyle = css`
  width: 95%;
  padding: 10px;
  margin: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background-color: #211e1e; /* 배경을 남색으로 설정 */
  color: white; /* 입력된 텍스트를 흰색으로 설정 */

  ::placeholder {
    color: white; /* placeholder 색상을 흰색으로 설정 */
    opacity: 0.8; /* 가독성을 높이기 위해 약간의 투명도 적용 */
  }
`;
