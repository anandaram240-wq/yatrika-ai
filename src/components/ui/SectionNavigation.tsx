/**
 * @file src/components/ui/SectionNavigation.tsx
 * @description Polished segmented section navigation for destination dossiers.
 * Supports horizontal scrolling on mobile, keyboard navigation, and conditional counts.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useRef } from 'react';

export interface SectionTabItem {
  id: string;
  label: string;
  kannadaLabel?: string;
  count?: number;
}

export interface SectionNavigationProps {
  tabs: SectionTabItem[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  className?: string;
}

export const SectionNavigation: React.FC<SectionNavigationProps> = ({
  tabs,
  activeTab,
  onChangeTab,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      onChangeTab(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onChangeTab(tabs[prevIndex].id);
    }
  };

  return (
    <nav
      ref={containerRef}
      role="tablist"
      aria-label="Dossier section navigation"
      className={`flex items-center gap-1.5 border-b border-[#E8DFD3] pb-2 my-4 overflow-x-auto no-scrollbar scroll-smooth ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        const hasCount = typeof tab.count === 'number' && tab.count > 0;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChangeTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all duration-150 select-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A44A28] focus-visible:ring-offset-1
              ${
                isActive
                  ? 'bg-[#A44A28] text-white shadow-xs font-semibold'
                  : 'text-[#5C5446] hover:text-[#1A1714] hover:bg-[#F4EFEA]/80'
              }`}
          >
            {tab.kannadaLabel && <span className="font-kannada">{tab.kannadaLabel}</span>}
            {tab.kannadaLabel && <span>•</span>}
            <span>{tab.label}</span>
            {hasCount && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-[#E8DFD3] text-[#4A443C]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
