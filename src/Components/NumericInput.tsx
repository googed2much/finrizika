import React from "react";

type NumericInputProps = {
  value: number | string;
  onChange: (value: number | "") => void;
  placeholder?: string;
  className?: string;
};

export function NumericInput({
  value,
  onChange,
  placeholder,
  className,
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // allow empty string
    if (raw === "") {
      onChange("");
      return;
    }

    // allow only digits + optional decimal
    if (/^-?\d*\.?\d*$/.test(raw)) {
      onChange(Number(raw));
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
