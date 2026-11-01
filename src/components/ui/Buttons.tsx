/**
 * @file src/components/ui/Buttons.tsx
 * @description Standardized button design system for YatriKa AI.
 * Implements PrimaryButton, SecondaryButton, DangerButton, and IconButton
 * with consistent typography, padding, states, and accessibility focus treatment.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<BaseButtonProps> = ({
  children,
  className = '',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none
        bg-[#A44A28] text-white hover:bg-[#8A3E22] active:bg-[#73331C]
        border border-[#8A3E22] shadow-sm hover:shadow
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A44A28] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#A44A28]
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export const SecondaryButton: React.FC<BaseButtonProps> = ({
  children,
  className = '',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none
        bg-white text-[#1A1714] hover:bg-[#FAF7F2] active:bg-[#F4EFEA]
        border border-[#D5C9B8] hover:border-[#B8A894] shadow-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A44A28] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export const DangerButton: React.FC<BaseButtonProps> = ({
  children,
  className = '',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-5 py-3 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none
        bg-[#FEF2F2] text-[#991B1B] hover:bg-[#FEE2E2] active:bg-[#FCA5A5]/30
        border border-[#FECACA] hover:border-[#F87171] shadow-xs
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'glass' | 'subtle' | 'solid';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  className = '',
  size = 'md',
  variant = 'subtle',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const variantClasses = {
    glass: 'bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20',
    subtle: 'bg-white hover:bg-[#FAF7F2] text-[#4A443C] hover:text-[#1A1714] border border-[#E8DFD3]',
    solid: 'bg-[#A44A28] hover:bg-[#8A3E22] text-white border border-[#8A3E22]',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A44A28] focus-visible:ring-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
