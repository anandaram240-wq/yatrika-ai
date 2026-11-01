/**
 * src/features/voice/VoiceStateMachine.ts
 * Formal Finite State Machine for YatriKa AI Voice Interactions.
 * Enforces explicit, deterministic state transitions with zero undefined states.
 */

export type VoiceState =
  | 'IDLE'
  | 'CHECKING_SUPPORT'
  | 'REQUESTING_PERMISSION'
  | 'READY'
  | 'LISTENING'
  | 'PROCESSING'
  | 'TRANSCRIPT_READY'
  | 'COMMAND_PREVIEW'
  | 'ERROR'
  | 'CANCELLED';

export type VoiceLanguage = 'kn-IN' | 'en-IN';

export interface VoiceErrorDetails {
  code:
    | 'UNSUPPORTED_BROWSER'
    | 'PERMISSION_DENIED'
    | 'MICROPHONE_UNAVAILABLE'
    | 'NO_SPEECH_DETECTED'
    | 'NETWORK_FAILURE'
    | 'SERVICE_UNAVAILABLE'
    | 'ABORTED'
    | 'EMPTY_TRANSCRIPT'
    | 'UNCLEAR_TRANSCRIPT'
    | 'TIMEOUT';
  messageKannada: string;
  messageEnglish: string;
  technicalDetails?: string;
  retryable: boolean;
}

export interface ParsedTravelEntities {
  origin?: string;
  destination?: string;
  waypoints?: string[];
  durationDays?: number;
  budgetInr?: number;
  isFemalePassenger?: boolean;
  unresolvedTerms?: string[];
}

export interface VoiceContext {
  state: VoiceState;
  language: VoiceLanguage;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  parsedEntities: ParsedTravelEntities | null;
  confidence: number;
  error: VoiceErrorDetails | null;
  startedAt: number | null;
}

export type VoiceEvent =
  | { type: 'CHECK_SUPPORT'; supported: boolean }
  | { type: 'REQUEST_PERMISSION' }
  | { type: 'PERMISSION_GRANTED' }
  | { type: 'PERMISSION_DENIED'; error: VoiceErrorDetails }
  | { type: 'START_LISTENING' }
  | { type: 'AUDIO_STARTED' }
  | { type: 'INTERIM_RESULT'; text: string }
  | { type: 'FINAL_RESULT'; text: string }
  | { type: 'START_PROCESSING' }
  | { type: 'PARSING_COMPLETE'; entities: ParsedTravelEntities; confidence: number }
  | { type: 'MANUAL_EDIT'; text: string; entities?: ParsedTravelEntities }
  | { type: 'STOP' }
  | { type: 'CANCEL' }
  | { type: 'RESET' }
  | { type: 'FAIL'; error: VoiceErrorDetails }
  | { type: 'SET_LANGUAGE'; language: VoiceLanguage };

export const INITIAL_VOICE_CONTEXT: VoiceContext = {
  state: 'IDLE',
  language: 'kn-IN',
  isSupported: true,
  transcript: '',
  interimTranscript: '',
  parsedEntities: null,
  confidence: 0,
  error: null,
  startedAt: null,
};

/**
 * Pure transition function for Voice State Machine
 */
export function voiceStateReducer(context: VoiceContext, event: VoiceEvent): VoiceContext {
  switch (event.type) {
    case 'SET_LANGUAGE':
      return { ...context, language: event.language };

    case 'CHECK_SUPPORT':
      if (!event.supported) {
        return {
          ...context,
          isSupported: false,
          state: 'ERROR',
          error: {
            code: 'UNSUPPORTED_BROWSER',
            messageKannada: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯದಲ್ಲಿ ನಮೂದಿಸಿ.',
            messageEnglish: 'Voice recognition is not supported in this browser. Please type your query.',
            retryable: false,
          },
        };
      }
      return { ...context, isSupported: true, state: 'READY' };

    case 'REQUEST_PERMISSION':
      return { ...context, state: 'REQUESTING_PERMISSION', error: null };

    case 'PERMISSION_GRANTED':
      return { ...context, state: 'READY', error: null };

    case 'PERMISSION_DENIED':
      return { ...context, state: 'ERROR', error: event.error };

    case 'START_LISTENING':
      if (context.state === 'ERROR' && !context.error?.retryable) {
        return context;
      }
      return {
        ...context,
        state: 'LISTENING',
        transcript: '',
        interimTranscript: '',
        parsedEntities: null,
        error: null,
        startedAt: Date.now(),
      };

    case 'AUDIO_STARTED':
      return { ...context, state: 'LISTENING' };

    case 'INTERIM_RESULT':
      return { ...context, interimTranscript: event.text };

    case 'FINAL_RESULT':
      return {
        ...context,
        transcript: event.text,
        interimTranscript: '',
        state: 'PROCESSING',
      };

    case 'START_PROCESSING':
      return { ...context, state: 'PROCESSING' };

    case 'PARSING_COMPLETE':
      return {
        ...context,
        parsedEntities: event.entities,
        confidence: event.confidence,
        state: 'COMMAND_PREVIEW',
      };

    case 'MANUAL_EDIT':
      return {
        ...context,
        transcript: event.text,
        parsedEntities: event.entities || context.parsedEntities,
        state: 'COMMAND_PREVIEW',
      };

    case 'STOP':
      if (context.state === 'LISTENING') {
        if (!context.transcript && !context.interimTranscript) {
          return {
            ...context,
            state: 'ERROR',
            error: {
              code: 'NO_SPEECH_DETECTED',
              messageKannada: 'ನಿಮ್ಮ ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
              messageEnglish: 'No speech was detected. Please speak clearly and try again.',
              retryable: true,
            },
          };
        }
        return {
          ...context,
          transcript: context.transcript || context.interimTranscript,
          interimTranscript: '',
          state: 'PROCESSING',
        };
      }
      return context;

    case 'CANCEL':
      return {
        ...context,
        state: 'CANCELLED',
        interimTranscript: '',
      };

    case 'RESET':
      return {
        ...INITIAL_VOICE_CONTEXT,
        language: context.language,
        isSupported: context.isSupported,
      };

    case 'FAIL':
      return {
        ...context,
        state: 'ERROR',
        error: event.error,
        interimTranscript: '',
      };

    default:
      return context;
  }
}
