/**
 * src/features/voice/useVoiceRecognition.ts
 * React Hook managing complete 10-state voice machine, session tracking, and NLP parsing.
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
    dispatch({ type: 'CHECK_SUPPORT_START' });
    const supported = voiceControllerInstance.isSupported();
    if (supported) {
      dispatch({ type: 'CHECK_SUPPORT_SUCCESS', supported: true });
    } else {
      dispatch({
        type: 'CHECK_SUPPORT_FAILURE',
        error: {
          code: 'UNSUPPORTED_BROWSER',
          messageKannada: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯದಲ್ಲಿ ನಮೂದಿಸಿ.',
          messageEnglish: 'Voice recognition is not supported in this browser. Please type your query.',
          retryable: false,
        },
      });
    }

    // Teardown recognition on unmount (prevents dangling callbacks in React Strict Mode)
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

    // Extract intermediate stops if present (e.g. "ಹಾಸನದ ಮೂಲಕ", "ಬೇಲೂರು ಮಾರ್ಗವಾಗಿ")
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
      unresolvedTerms: intentResult.requiresClarification
        ? ['ಸ್ಥಳ ಸ್ಪಷ್ಟೀಕರಣ ಅಗತ್ಯ (Clarification Required)']
        : undefined,
    };
  }, []);

  const startListening = useCallback(async () => {
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

    voiceControllerInstance.setLanguage(context.language);

    const sessionId = await voiceControllerInstance.startListening({
      onStart: (sId) => {
        dispatch({ type: 'AUDIO_STARTED', sessionId: sId });
      },
      onInterimResult: (sId, text) => {
        dispatch({ type: 'INTERIM_RESULT', sessionId: sId, text });
      },
      onFinalResult: (sId, text, confidence) => {
        dispatch({ type: 'FINAL_RESULT', sessionId: sId, text });
        dispatch({ type: 'START_PROCESSING', sessionId: sId });
        const entities = parseTextToEntities(text);
        dispatch({
          type: 'PARSING_COMPLETE',
          sessionId: sId,
          entities,
          confidence,
        });
      },
      onError: (sId, error) => {
        dispatch({ type: 'FAIL', sessionId: sId, error });
      },
      onEnd: () => {
        // onEnd handled naturally by state machine
      },
    });

    if (sessionId) {
      dispatch({ type: 'START_LISTENING', sessionId });
    }
  }, [context.isSupported, context.language, parseTextToEntities]);

  const stopListening = useCallback(async () => {
    const sId = context.sessionId || undefined;
    await voiceControllerInstance.stopListening();
    dispatch({ type: 'STOP', sessionId: sId });

    // If text was captured, transition to parsing
    const activeText = context.transcript || context.interimTranscript;
    if (activeText && sId) {
      dispatch({ type: 'START_PROCESSING', sessionId: sId });
      const entities = parseTextToEntities(activeText);
      const intent = classifyKannadaIntent(activeText);
      dispatch({
        type: 'PARSING_COMPLETE',
        sessionId: sId,
        entities,
        confidence: intent.confidence,
      });
    }
  }, [context.sessionId, context.transcript, context.interimTranscript, parseTextToEntities]);

  const cancelListening = useCallback(async () => {
    const sId = context.sessionId || undefined;
    await voiceControllerInstance.cancelListening();
    dispatch({ type: 'CANCEL', sessionId: sId });
  }, [context.sessionId]);

  const reset = useCallback(async () => {
    await voiceControllerInstance.cancelListening();
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
    hasTranscriptReady: context.state === 'TRANSCRIPT_READY',
    hasPreview: context.state === 'COMMAND_PREVIEW',
    hasError: context.state === 'ERROR',
    isCheckingSupport: context.state === 'CHECKING_SUPPORT',
    startListening,
    stopListening,
    cancelListening,
    reset,
    setLanguage,
    updateTranscriptManually,
    confirmPlan,
  };
}
