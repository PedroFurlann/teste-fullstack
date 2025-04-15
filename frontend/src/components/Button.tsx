import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

type MotionButtonProps = ComponentProps<typeof motion.button>;

interface ButtonProps extends MotionButtonProps {
  label: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  bgColor?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  size = 'medium',
  disabled = false,
  bgColor = 'bg-violet-600',
  icon,
  iconPosition = 'left',
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 text-center';
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        `${bgColor} hover:opacity-80 transition-all ease-in-out duration-300 disabled:cursor-not-allowed disabled:bg-gray-600`
      )}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{label}</span>
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </motion.button>
  );
};

export default Button;
