import React from 'react';

interface Option {
  value: any;
  label: string;
}

interface SelectProps {
  id: string;
  label: string;
  onChange: (selected: Option) => void;
  options: Option[];
  value: Option;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  onChange,
  options,
  value,
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
    <select
      id={id}
      value={value.value}
      onChange={e => {
        const selected = options.find(o => String(o.value) === e.target.value);
        if (selected) onChange(selected);
      }}
      className="block w-full border border-gray-400 rounded-threads px-3 py-2 text-[1.6rem] bg-white focus:outline-none focus:ring-2 focus:ring-plaid-blue"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

Select.displayName = 'Select';
export default Select;
