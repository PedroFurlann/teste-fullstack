import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  bgColor?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, size = 'medium', disabled = false, bgColor = 'bg-violet-400', ...rest }) => {

  const baseClasses = 'text-white font-bold text rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 text-center';
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        `${bgColor} hover:opacity-70 transition-all ease-in-out duration-300 disabled:cursor-not-allowed disabled:bg-gray-600`
      )}
    >
      {label}
    </button>
  );
};

export default Button;