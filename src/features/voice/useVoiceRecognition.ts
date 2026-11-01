/**
 * src/features/voice/useVoiceRecognition.ts
 * React Hook managing complete voice state machine and NLP parsing.
 */

import { useReducer, useEffect, useCallback, useRef } from 'react';
import {
  voiceStateReducer,
  INITIAL_VOICE_CONTEXT,
  VoiceLanguage,
  ParsedTravelEntities,
} from './VoiceStateMachine';
import { voiceControllerInstance } from './VoiceController';
import { classifyKannadaIntent } from '../voice-agent/services/kannadaIntentClassifier';

export function useVoiceRecognition(options?: {
  defaultLanguage?: VoiceLanguage;
  onPlanConfirmed?: (parsed: ParsedTravelEntities, rawText: string) => void;
}) {
  const [context, dispatch] = useReducer(voiceStateReducer, {
    ...INITIAL_VOICE_CONTEXT,
    language: options?.defaultLanguage || 'kn-IN',
    isSupported: voiceControllerInstance.isSupported(),
  });

  const onPlanConfirmedRef = useRef(options?.onPlanConfirmed);
  useEffect(() => {
    onPlanConfirmedRef.current = options?.onPlanConfirmed;
  }, [options?.onPlanConfirmed]);

  // Check support on mount
  useEffect(() => {
    const supported = voiceControllerInstance.isSupported();
    dispatch({ type: 'CHECK_SUPPORT', supported });

    // Clean up recognition on unmount
    return () => {
      voiceControllerInstance.cancelListening();
    };
  }, []);

  const parseTextToEntities = useCallback((text: string): ParsedTravelEntities => {
    if (!text.trim()) {
      return {};
    }

    const intentResult = classifyKannadaIntent(text);
    const waypoints: string[] = [];

    // Extract intermediate stops if present (e.g. "ಹಾಸನದ ಮೂಲಕ", "ಮೈಸೂರು ಮಾರ್ಗವಾಗಿ")
    if (text.includes('ಹಾಸನ') && intentResult.entities.destination !== 'ಹಾಸನ') {
      waypoints.push('ಹಾಸನ (Hassan)');
    }
    if (text.includes('ಬೇಲೂರು') && intentResult.entities.destination !== 'ಬೇಲೂರು') {
      waypoints.push('ಬೇಲೂರು (Belur)');
    }
    if (text.includes('ಶೆಟ್ಟಿಹಳ್ಳಿ')) {
      waypoints.push('ಶೆಟ್ಟಿಹಳ್ಳಿ (Shettihalli)');
    }

    return {
      origin: intentResult.entities.origin,
      destination: intentResult.entities.destination,
      waypoints: waypoints.length > 0 ? waypoints : undefined,
      durationDays: intentResult.entities.durationDays,
      budgetInr: intentResult.entities.budgetInr,
      isFemalePassenger: intentResult.entities.isFemalePassenger,
      unresolvedTerms: intentResult.requiresClarification ? ['ಸ್ಥಳ ಸ್ಪಷ್ಟೀಕರಣ ಅಗತ್ಯ (Clarification Required)'] : undefined,
    };
  }, []);

  const startListening = useCallback(() => {
    if (!context.isSupported) {
      dispatch({
        type: 'FAIL',
        error: {
          code: 'UNSUPPORTED_BROWSER',
          messageKannada: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.',
          messageEnglish: 'Voice recognition is not supported in this browser.',
          retryable: false,
        },
      });
      return;
    }

    dispatch({ type: 'START_LISTENING' });

    voiceControllerInstance.setLanguage(context.language);
    voiceControllerInstance.startListening({
      onStart: () => {
        dispatch({ type: 'AUDIO_STARTED' });
      },
      onInterimResult: (text) => {
        dispatch({ type: 'INTERIM_RESULT', text });
      },
      onFinalResult: (text) => {
        dispatch({ type: 'FINAL_RESULT', text });
        const entities = parseTextToEntities(text);
        const intent = classifyKannadaIntent(text);
        dispatch({
          type: 'PARSING_COMPLETE',
          entities,
          confidence: intent.confidence,
        });
      },
      onError: (error) => {
        dispatch({ type: 'FAIL', error });
      },
      onEnd: () => {
        // onEnd handled naturally by state transitions
      },
    });
  }, [context.isSupported, context.language, parseTextToEntities]);

  const stopListening = useCallback(() => {
    voiceControllerInstance.stopListening();
    dispatch({ type: 'STOP' });

    // If we have an existing transcript, trigger parse
    const activeText = context.transcript || context.interimTranscript;
    if (activeText) {
      const entities = parseTextToEntities(activeText);
      const intent = classifyKannadaIntent(activeText);
      dispatch({
        type: 'PARSING_COMPLETE',
        entities,
        confidence: intent.confidence,
      });
    }
  }, [context.transcript, context.interimTranscript, parseTextToEntities]);

  const cancelListening = useCallback(() => {
    voiceControllerInstance.cancelListening();
    dispatch({ type: 'CANCEL' });
  }, []);

  const reset = useCallback(() => {
    voiceControllerInstance.cancelListening();
    dispatch({ type: 'RESET' });
  }, []);

  const setLanguage = useCallback((language: VoiceLanguage) => {
    voiceControllerInstance.setLanguage(language);
    dispatch({ type: 'SET_LANGUAGE', language });
  }, []);

  const updateTranscriptManually = useCallback(
    (text: string) => {
      const entities = parseTextToEntities(text);
      dispatch({ type: 'MANUAL_EDIT', text, entities });
    },
    [parseTextToEntities]
  );

  const confirmPlan = useCallback(() => {
    if (context.parsedEntities && onPlanConfirmedRef.current) {
      onPlanConfirmedRef.current(context.parsedEntities, context.transcript);
    }
  }, [context.parsedEntities, context.transcript]);

  return {
    context,
    isListening: context.state === 'LISTENING',
    isProcessing: context.state === 'PROCESSING',
    hasError: context.state === 'ERROR',
    hasPreview: context.state === 'COMMAND_PREVIEW',
    startListening,
    stopListening,
    cancelListening,
    reset,
    setLanguage,
    updateTranscriptManually,
    confirmPlan,
  };
}
