/**
 * @file src/components/ui/States.tsx
 * @description Standardized empty, loading, and error state components.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';
import { PrimaryButton } from './Buttons';

export interface EmptyStateProps {
  title: string;
  kannadaTitle?: string;
  description: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  kannadaTitle,
  description,
  icon = '🏛️',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-6 text-center bg-white rounded-xl border border-[#E8DFD3] text-xs space-y-2 ${className}`}>
      <span className="text-2xl block mb-1">{icon}</span>
      <h4 className="font-serif text-sm font-semibold text-[#1A1714]">
        {title} {kannadaTitle && <span className="font-kannada font-normal text-xs text-[#7A7369]">({kannadaTitle})</span>}
      </h4>
      <p className="text-[#7A7369] max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="pt-2">
          <PrimaryButton size="sm" onClick={onAction}>
            {actionText}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ... (Loading verified information)',
  className = '',
}) => {
  return (
    <div className={`p-8 text-center text-xs text-[#7A7369] space-y-3 ${className}`}>
      <div className="w-6 h-6 border-2 border-[#A44A28] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="font-mono">{label}</p>
    </div>
  );
};

export interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-5 bg-[#FEF2F2] rounded-xl border border-[#FECACA] text-xs text-[#991B1B] text-center space-y-2 ${className}`}>
      <span className="text-lg block">⚠️</span>
      <p className="font-medium">{error}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="underline hover:text-[#7F1D1D] font-semibold mt-1"
        >
          ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ (Try Again)
        </button>
      )}
    </div>
  );
};
