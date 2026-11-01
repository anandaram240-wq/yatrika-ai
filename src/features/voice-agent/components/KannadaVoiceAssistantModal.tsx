/**
 * src/features/voice-agent/components/KannadaVoiceAssistantModal.tsx
 * Backwards-compatible adapter delegating to the professional VoiceAssistantModal.
 * Bridges legacy VoiceIntentResult contracts with the formal 10-state Voice State Machine.
 */

import React from 'react';
import { VoiceAssistantModal } from '../../voice/VoiceAssistantModal';
import { ParsedTravelEntities } from '../../voice/VoiceStateMachine';
import { classifyKannadaIntent } from '../services/kannadaIntentClassifier';
import { VoiceIntentResult } from '../domain/types';

export interface KannadaVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyIntent: (intentResult: VoiceIntentResult) => void;
}

export const KannadaVoiceAssistantModal: React.FC<KannadaVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyIntent,
}) => {
  const handleApplyPlan = (parsed: ParsedTravelEntities, rawText: string) => {
    const classified = classifyKannadaIntent(rawText);
    if (parsed.destination) classified.entities.destination = parsed.destination;
    if (parsed.origin) classified.entities.origin = parsed.origin;
    if (parsed.durationDays) classified.entities.durationDays = parsed.durationDays;
    if (parsed.budgetInr) classified.entities.budgetInr = parsed.budgetInr;
    onApplyIntent(classified);
  };

  return (
    <VoiceAssistantModal
      isOpen={isOpen}
      onClose={onClose}
      onApplyPlan={handleApplyPlan}
      defaultLanguage="kn-IN"
    />
  );
};
