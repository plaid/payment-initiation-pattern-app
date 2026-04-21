import React from 'react';

interface TextInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
}) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="block text-[1.4rem] font-medium text-dark-gray mb-1"
      >
        {label}
      </label>
    )}
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="block w-full border border-gray-400 rounded-threads px-3 py-2 text-[1.6rem] focus:outline-none focus:ring-2 focus:ring-blue-900"
    />
  </div>
);

TextInput.displayName = 'TextInput';
export default TextInput;
