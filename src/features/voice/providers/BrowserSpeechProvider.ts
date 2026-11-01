/**
 * src/features/voice/providers/BrowserSpeechProvider.ts
 * Browser-native Web Speech API provider for Chrome, Edge, and Safari.
 * Enforces session-isolated callbacks, adaptive inactivity watchdog, and hard session caps.
 */

import {
  ISpeechProvider,
  SpeechProviderConfig,
  SpeechProviderCallbacks,
} from './SpeechProvider';
import { VoiceErrorHandler } from '../VoiceErrorHandler';

export class BrowserSpeechProvider implements ISpeechProvider {
  public readonly id = 'browser_web_speech';
  public readonly name = 'Browser Web Speech API';

  private recognitionInstance: any = null;
  private activeSessionId: string | null = null;
  private inactivityTimer: any = null;
  private maxDurationTimer: any = null;
  private isListening = false;
  private userInitiatedStop = false;
  private lastInactivityTimeout = 7000;
  private lastCallbacks: SpeechProviderCallbacks | null = null;

  public get isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public async isReady(): Promise<boolean> {
    return this.isSupported;
  }

  public async start(
    sessionId: string,
    config: SpeechProviderConfig,
    callbacks: SpeechProviderCallbacks
  ): Promise<boolean> {
    if (!this.isSupported) {
      callbacks.onError?.(sessionId, VoiceErrorHandler.getUnsupportedBrowserError());
      return false;
    }

    // Cancel any existing running session cleanly
    if (this.activeSessionId) {
      await this.cancel(this.activeSessionId);
    }

    this.activeSessionId = sessionId;
    this.userInitiatedStop = false;
    this.isListening = true;

    const inactivityTimeout = config.inactivityTimeoutMs ?? 7000;
    const maxDuration = config.maxDurationMs ?? 45000;
    this.lastInactivityTimeout = inactivityTimeout;
    this.lastCallbacks = callbacks;

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      this.recognitionInstance = new SpeechRecognitionClass();
      this.recognitionInstance.lang = config.language;
      this.recognitionInstance.continuous = false; // Single utterance mode prevents endless runaway looping
      this.recognitionInstance.interimResults = true;
      this.recognitionInstance.maxAlternatives = 1;

      // Start the inactivity timer
      this.resetInactivityTimer(sessionId, inactivityTimeout, callbacks);

      // Start hard session duration cap
      this.clearMaxDurationTimer();
      this.maxDurationTimer = setTimeout(() => {
        if (this.activeSessionId === sessionId && this.isListening) {
          this.stop(sessionId);
          callbacks.onError?.(sessionId, VoiceErrorHandler.getTimeoutError());
        }
      }, maxDuration);

      this.recognitionInstance.onstart = () => {
        if (this.activeSessionId !== sessionId) return;
        this.isListening = true;
        callbacks.onStart?.(sessionId);
      };

      this.recognitionInstance.onspeechstart = () => {
        if (this.activeSessionId !== sessionId) return;
        // User started speaking: reset inactivity watchdog
        this.resetInactivityTimer(sessionId, inactivityTimeout, callbacks);
        callbacks.onSpeechStart?.(sessionId);
      };

      this.recognitionInstance.onspeechend = () => {
        if (this.activeSessionId !== sessionId) return;
        callbacks.onSpeechEnd?.(sessionId);
      };

      this.recognitionInstance.onresult = (event: any) => {
        if (this.activeSessionId !== sessionId) return;

        // Active speech detected: reset inactivity watchdog
        this.resetInactivityTimer(sessionId, inactivityTimeout, callbacks);

        let interimText = '';
        let finalText = '';
        let confidence = 0.9;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalText += item[0].transcript;
            if (item[0].confidence) confidence = item[0].confidence;
          } else {
            interimText += item[0].transcript;
          }
        }

        if (interimText && !finalText) {
          callbacks.onInterimResult?.(sessionId, interimText.trim());
        }

        if (finalText) {
          this.clearTimers();
          callbacks.onFinalResult?.(sessionId, finalText.trim(), confidence);
        }
      };

      this.recognitionInstance.onerror = (domError: any) => {
        if (this.activeSessionId !== sessionId) return;
        this.clearTimers();
        this.isListening = false;
        if (!this.userInitiatedStop) {
          callbacks.onError?.(sessionId, VoiceErrorHandler.mapSpeechError(domError));
        }
      };

      this.recognitionInstance.onend = () => {
        if (this.activeSessionId !== sessionId) return;
        this.clearTimers();
        this.isListening = false;
        this.activeSessionId = null;
        callbacks.onEnd?.(sessionId);
      };

      this.recognitionInstance.start();
      return true;
    } catch (err: any) {
      this.clearTimers();
      this.isListening = false;
      this.activeSessionId = null;
      callbacks.onError?.(sessionId, VoiceErrorHandler.mapSpeechError(err));
      return false;
    }
  }

  public resetInactivityWatchdog(): void {
    if (this.activeSessionId && this.lastCallbacks) {
      this.resetInactivityTimer(this.activeSessionId, this.lastInactivityTimeout, this.lastCallbacks);
    }
  }

  public async stop(sessionId: string): Promise<void> {
    if (this.activeSessionId !== sessionId) return;
    this.userInitiatedStop = true;
    this.clearTimers();
    if (this.recognitionInstance && this.isListening) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // Safe catch if already stopping
      }
    }
    this.isListening = false;
  }

  public async cancel(sessionId: string): Promise<void> {
    if (this.activeSessionId === sessionId) {
      this.userInitiatedStop = true;
      this.clearTimers();
      if (this.recognitionInstance) {
        try {
          this.recognitionInstance.abort();
        } catch {
          // Safe catch if already aborted
        }
      }
      this.isListening = false;
      this.activeSessionId = null;
    }
  }

  private resetInactivityTimer(
    sessionId: string,
    timeoutMs: number,
    callbacks: SpeechProviderCallbacks
  ): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      if (this.activeSessionId === sessionId && this.isListening) {
        this.stop(sessionId);
        callbacks.onError?.(sessionId, VoiceErrorHandler.getTimeoutError());
      }
    }, timeoutMs);
  }

  private clearTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }

  private clearMaxDurationTimer(): void {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }
}
