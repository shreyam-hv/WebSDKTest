import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="form-group">
      <label>{label} {required && <span className="required">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="form-group checkbox">
      <input
        type="checkbox"
        id={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
};

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {label}
    </button>
  );
};
