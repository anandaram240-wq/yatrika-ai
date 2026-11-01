/**
 * @file src/components/ui/StatusIndicator.tsx
 * @description Calm, professional status and provenance badge hierarchy.
 * Eradicates emoji salad in favor of clean typographic indicators.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';

export type StatusVariant = 'official' | 'published' | 'confirmed' | 'warning' | 'unavailable' | 'neutral' | 'danger';

export interface StatusIndicatorProps {
  label: string;
  kannadaLabel?: string;
  variant?: StatusVariant;
  timestamp?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  kannadaLabel,
  variant = 'neutral',
  timestamp,
  className = '',
  size = 'sm',
}) => {
  const variantStyles: Record<StatusVariant, { badge: string; dot: string }> = {
    official: {
      badge: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
      dot: 'bg-[#16a34a]',
    },
    confirmed: {
      badge: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
      dot: 'bg-[#059669]',
    },
    published: {
      badge: 'bg-[#FAF7F2] text-[#4A443C] border-[#E8DFD3]',
      dot: 'bg-[#7A7369]',
    },
    warning: {
      badge: 'bg-[#FEF3C7] text-[#9A3412] border-[#FDE68A]',
      dot: 'bg-[#d97706]',
    },
    unavailable: {
      badge: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
      dot: 'bg-[#64748b]',
    },
    neutral: {
      badge: 'bg-[#F4EFEA] text-[#4A443C] border-[#E8DFD3]',
      dot: 'bg-[#8C8275]',
    },
    danger: {
      badge: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
      dot: 'bg-[#dc2626]',
    },
  };

  const current = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border shadow-xs select-none ${current.badge} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} aria-hidden="true" />
      <span>{label}</span>
      {kannadaLabel && <span className="font-kannada opacity-90">({kannadaLabel})</span>}
      {timestamp && <span className="opacity-75 font-mono text-[10px] pl-1 border-l border-current/25">{timestamp}</span>}
    </span>
  );
};
