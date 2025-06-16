// components/ReCaptcha.tsx
import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ onVerify }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (value: string | null) => {
    if (onVerify) {
      onVerify(value);
    }
  };

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey="6LdL82IrAAAAAAukiP82j_IfzlR1_1nLf-HDh2If"
      onChange={handleChange}
    />
  );
};

export default ReCaptcha;
