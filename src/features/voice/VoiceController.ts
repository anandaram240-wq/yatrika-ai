/**
 * src/features/voice/VoiceController.ts
 * Master Voice Controller coordinating provider lifecycle, session IDs, and speech synthesis.
 */

import { ISpeechProvider } from './providers/SpeechProvider';
import { SpeechProviderFactory } from './providers/SpeechProviderFactory';
import { VoiceErrorHandler } from './VoiceErrorHandler';
import { VoiceErrorDetails, VoiceLanguage } from './VoiceStateMachine';

export interface VoiceControllerEvents {
  onStart?: (sessionId: string) => void;
  onInterimResult?: (sessionId: string, transcript: string) => void;
  onFinalResult?: (sessionId: string, transcript: string, confidence: number) => void;
  onError?: (sessionId: string, error: VoiceErrorDetails) => void;
  onEnd?: (sessionId: string) => void;
}

export class VoiceController {
  private provider: ISpeechProvider;
  private currentSessionId: string | null = null;
  private activeLanguage: VoiceLanguage = 'kn-IN';

  constructor(provider?: ISpeechProvider) {
    this.provider = provider || SpeechProviderFactory.getProvider('browser');
  }

  public setProvider(provider: ISpeechProvider): void {
    if (this.currentSessionId) {
      this.cancelListening();
    }
    this.provider = provider;
  }

  public getProvider(): ISpeechProvider {
    return this.provider;
  }

  public isSupported(): boolean {
    return this.provider.isSupported;
  }

  public setLanguage(lang: VoiceLanguage): void {
    this.activeLanguage = lang;
  }

  public getLanguage(): VoiceLanguage {
    return this.activeLanguage;
  }

  public getActiveSessionId(): string | null {
    return this.currentSessionId;
  }

  public getIsListening(): boolean {
    return Boolean(this.currentSessionId);
  }

  /**
   * Generates unique session identifier to isolate event streams
   */
  public generateSessionId(): string {
    return `voice_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  /**
   * Starts listening session with explicit session ID isolation
   */
  public async startListening(events: VoiceControllerEvents): Promise<string | null> {
    if (!this.isSupported()) {
      const err = VoiceErrorHandler.getUnsupportedBrowserError();
      events.onError?.('no_session', err);
      return null;
    }

    // Cancel any stale session before creating a fresh one
    if (this.currentSessionId) {
      await this.cancelListening();
    }

    const sessionId = this.generateSessionId();
    this.currentSessionId = sessionId;

    const started = await this.provider.start(
      sessionId,
      {
        language: this.activeLanguage,
        inactivityTimeoutMs: 7000, // Resets on speech activity
        maxDurationMs: 45000,       // Hard session cap
      },
      {
        onStart: (sId) => {
          if (this.currentSessionId !== sId) return;
          events.onStart?.(sId);
        },
        onInterimResult: (sId, text) => {
          if (this.currentSessionId !== sId) return;
          events.onInterimResult?.(sId, text);
        },
        onFinalResult: (sId, text, confidence) => {
          if (this.currentSessionId !== sId) return;
          events.onFinalResult?.(sId, text, confidence);
        },
        onError: (sId, error) => {
          if (this.currentSessionId !== sId) return;
          this.currentSessionId = null;
          events.onError?.(sId, error);
        },
        onEnd: (sId) => {
          if (this.currentSessionId !== sId) return;
          this.currentSessionId = null;
          events.onEnd?.(sId);
        },
      }
    );

    if (!started) {
      this.currentSessionId = null;
      return null;
    }

    return sessionId;
  }

  /**
   * Stops listening and triggers processing of captured speech
   */
  public async stopListening(): Promise<void> {
    if (this.currentSessionId) {
      const sId = this.currentSessionId;
      await this.provider.stop(sId);
      this.currentSessionId = null;
    }
  }

  /**
   * Aborts listening immediately and invalidates active session
   */
  public async cancelListening(): Promise<void> {
    if (this.currentSessionId) {
      const sId = this.currentSessionId;
      this.currentSessionId = null;
      await this.provider.cancel(sId);
    }
  }

  /**
   * Speaks text in Kannada or English using Web Speech Synthesis
   */
  public speakText(text: string, lang: VoiceLanguage = 'kn-IN', onComplete?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onComplete?.();
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => onComplete?.();
      utterance.onerror = () => onComplete?.();

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      onComplete?.();
      return false;
    }
  }
}

export const voiceControllerInstance = new VoiceController();
