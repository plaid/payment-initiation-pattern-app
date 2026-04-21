import React from 'react';

interface AccordionGroupProps {
  children: React.ReactNode;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({ children }) => (
  <div className="divide-y divide-gray-200">{children}</div>
);

interface AccordionItemProps {
  label: string | React.ReactNode;
  isExpanded: boolean;
  onChange: () => void;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  label,
  isExpanded,
  onChange,
  children,
}) => (
  <div>
    <button
      onClick={onChange}
      aria-expanded={isExpanded}
      className="w-full flex items-center justify-between py-3 text-left text-[1.6rem] font-semibold hover:text-plaid-blue transition-colors"
    >
      <span>{label}</span>
      <svg
        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M10.53 17.53l-1.06-1.06L13.94 12 9.47 7.53l1.06-1.06L16.06 12z" />
      </svg>
    </button>
    {isExpanded && <div className="pb-4">{children}</div>}
  </div>
);
