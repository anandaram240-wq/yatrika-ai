/**
 * src/features/voice/providers/SpeechProvider.ts
 * Provider-independent interface and contracts for Speech-to-Text engines.
 * Decouples Web Speech API from custom backends and on-device engines.
 */

import { VoiceErrorDetails, VoiceLanguage } from '../VoiceStateMachine';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface SpeechProviderCallbacks {
  onStart?: (sessionId: string) => void;
  onSpeechStart?: (sessionId: string) => void;
  onSpeechEnd?: (sessionId: string) => void;
  onInterimResult?: (sessionId: string, transcript: string) => void;
  onFinalResult?: (sessionId: string, transcript: string, confidence: number) => void;
  onError?: (sessionId: string, error: VoiceErrorDetails) => void;
  onEnd?: (sessionId: string) => void;
}

export interface SpeechProviderConfig {
  language: VoiceLanguage;
  inactivityTimeoutMs?: number; // Inactivity timeout (resets on speech activity)
  maxDurationMs?: number;       // Hard session duration cap
}

export interface ISpeechProvider {
  readonly id: string;
  readonly name: string;
  readonly isSupported: boolean;
  isReady(): Promise<boolean>;
  start(
    sessionId: string,
    config: SpeechProviderConfig,
    callbacks: SpeechProviderCallbacks
  ): Promise<boolean>;
  stop(sessionId: string): Promise<void>;
  cancel(sessionId: string): Promise<void>;
}
