import React from 'react';

interface NumberInputProps {
  id: string;
  large?: boolean;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: () => React.ReactNode;
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  large,
  label,
  value,
  onChange,
  prefix,
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
    <div className="flex items-center">
      {prefix && (
        <span
          className={`px-3 bg-gray-100 border border-r-0 border-gray-400 rounded-l-threads flex items-center ${large ? 'text-[2.4rem] h-14' : 'text-[1.6rem] h-10'}`}
        >
          {prefix()}
        </span>
      )}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        className={`flex-1 border border-gray-400 px-3 focus:outline-none focus:ring-2 focus:ring-plaid-blue ${
          prefix ? 'rounded-r-threads' : 'rounded-threads'
        } ${large ? 'text-[2.4rem] h-14' : 'text-[1.6rem] h-10'}`}
      />
    </div>
  </div>
);

NumberInput.displayName = 'NumberInput';
export default NumberInput;
