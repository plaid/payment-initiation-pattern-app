import React from 'react';

const baseClasses =
  'inline-flex items-center justify-center px-4 py-[1.2rem] text-[1.6rem] font-semibold rounded-threads transition-colors';

const variantClasses = {
  primary:
    'text-white bg-black-1000 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
  secondary:
    'text-black-1000 border border-gray-400 hover:border-plaid-blue hover:text-plaid-blue',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  wide?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  wide,
  className,
  children,
  ...props
}) => (
  <button
    className={`${baseClasses} ${variantClasses[variant]} ${wide ? 'w-full' : ''} ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

Button.displayName = 'Button';
export default Button;
