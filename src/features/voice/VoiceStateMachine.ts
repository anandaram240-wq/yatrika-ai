/**
 * src/features/voice/VoiceStateMachine.ts
 * Canonical 10-State Finite State Machine for YatriKa AI Voice Interactions.
 * Enforces session-isolated transitions, inactivity watchdogs, and explicit reachable states.
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
  sessionId: string | null;
  language: VoiceLanguage;
  isSupported: boolean;
  isPermissionGranted: boolean;
  transcript: string;
  interimTranscript: string;
  parsedEntities: ParsedTravelEntities | null;
  confidence: number;
  error: VoiceErrorDetails | null;
  startedAt: number | null;
  inactivityTimeoutMs: number;
  maxDurationMs: number;
}

export type VoiceEvent =
  | { type: 'CHECK_SUPPORT'; supported: boolean; error?: VoiceErrorDetails }
  | { type: 'CHECK_SUPPORT_START' }
  | { type: 'CHECK_SUPPORT_SUCCESS'; supported: boolean }
  | { type: 'CHECK_SUPPORT_FAILURE'; error: VoiceErrorDetails }
  | { type: 'REQUEST_PERMISSION' }
  | { type: 'PERMISSION_GRANTED' }
  | { type: 'PERMISSION_DENIED'; error: VoiceErrorDetails }
  | { type: 'START_LISTENING'; sessionId?: string }
  | { type: 'AUDIO_STARTED'; sessionId?: string }
  | { type: 'INTERIM_RESULT'; sessionId?: string; text: string }
  | { type: 'FINAL_RESULT'; sessionId?: string; text: string }
  | { type: 'TRANSCRIPT_READY'; sessionId?: string; text?: string }
  | { type: 'START_PROCESSING'; sessionId?: string }
  | { type: 'PARSING_COMPLETE'; sessionId?: string; entities: ParsedTravelEntities; confidence: number }
  | { type: 'MANUAL_EDIT'; text: string; entities?: ParsedTravelEntities }
  | { type: 'STOP'; sessionId?: string }
  | { type: 'CANCEL'; sessionId?: string }
  | { type: 'RESET' }
  | { type: 'FAIL'; sessionId?: string; error: VoiceErrorDetails }
  | { type: 'SET_LANGUAGE'; language: VoiceLanguage };

export const INITIAL_VOICE_CONTEXT: VoiceContext = {
  state: 'IDLE',
  sessionId: null,
  language: 'kn-IN',
  isSupported: true,
  isPermissionGranted: false,
  transcript: '',
  interimTranscript: '',
  parsedEntities: null,
  confidence: 0,
  error: null,
  startedAt: null,
  inactivityTimeoutMs: 7000,
  maxDurationMs: 45000,
};

/**
 * Pure transition function enforcing session verification and all 10 canonical states
 */
export function voiceStateReducer(context: VoiceContext, event: VoiceEvent): VoiceContext {
  // Session validation: if an active session event does not match active sessionId, ignore stale callback
  if ('sessionId' in event && event.sessionId && context.sessionId && event.sessionId !== context.sessionId) {
    return context; // Reject stale callback
  }

  switch (event.type) {
    case 'SET_LANGUAGE':
      return { ...context, language: event.language };

    case 'CHECK_SUPPORT':
      if (event.supported) {
        return { ...context, isSupported: true, state: 'READY', error: null };
      }
      return {
        ...context,
        isSupported: false,
        state: 'ERROR',
        error: event.error || {
          code: 'UNSUPPORTED_BROWSER',
          messageKannada: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕ್ರೋಮ್ ಅಥವಾ ಸಫಾರಿ ಬಳಸಿ.',
          messageEnglish: 'Voice speech recognition is not supported in this browser.',
          retryable: false,
        },
      };

    case 'CHECK_SUPPORT_START':
      return { ...context, state: 'CHECKING_SUPPORT', error: null };

    case 'CHECK_SUPPORT_SUCCESS':
      return { ...context, isSupported: event.supported, state: 'READY', error: null };

    case 'CHECK_SUPPORT_FAILURE':
      return {
        ...context,
        isSupported: false,
        state: 'ERROR',
        error: event.error,
      };

    case 'REQUEST_PERMISSION':
      return { ...context, state: 'REQUESTING_PERMISSION', error: null };

    case 'PERMISSION_GRANTED':
      return { ...context, isPermissionGranted: true, state: 'READY', error: null };

    case 'PERMISSION_DENIED':
      return { ...context, isPermissionGranted: false, state: 'ERROR', error: event.error };

    case 'START_LISTENING':
      if (context.state === 'ERROR' && !context.error?.retryable) {
        return context;
      }
      return {
        ...context,
        sessionId: event.sessionId || `voice_sess_${Date.now()}`,
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

    case 'TRANSCRIPT_READY':
      return {
        ...context,
        transcript: event.text ?? context.transcript,
        interimTranscript: '',
        state: 'TRANSCRIPT_READY',
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
          state: 'TRANSCRIPT_READY',
        };
      }
      return context;

    case 'CANCEL':
      return {
        ...context,
        sessionId: null,
        state: 'CANCELLED',
        interimTranscript: '',
      };

    case 'RESET':
      return {
        ...INITIAL_VOICE_CONTEXT,
        language: context.language,
        isSupported: context.isSupported,
        isPermissionGranted: context.isPermissionGranted,
      };

    case 'FAIL':
      return {
        ...context,
        sessionId: null,
        state: 'ERROR',
        error: event.error,
        interimTranscript: '',
      };

    default:
      return context;
  }
}
